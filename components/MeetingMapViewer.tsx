import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  MapPin, Layers, Crosshair, Plus, Minus, Settings2, 
  Calendar, Clock, Users, ArrowRight, Eye, Navigation, 
  Filter, Sparkles, Shield, AlertCircle, Compass, CheckCircle2,
  TrendingUp, BarChart2, Radio, Maximize2, Minimize2, Map as MapIcon,
  ChevronRight, Activity, Zap, UserCheck
} from 'lucide-react';
import { Meeting, MeetingType, MeetingStatus } from '../types';
import { useToast } from './Toast';

interface MeetingMapViewerProps {
  meetings: Meeting[];
  selectedMeetingId?: string;
  onSelectMeeting?: (meetingId: string) => void;
  onOpenNewMeetingModal?: () => void;
}

export const MeetingMapViewer: React.FC<MeetingMapViewerProps> = ({
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  onOpenNewMeetingModal
}) => {
  const { showToast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Layer Toggles
  const [showDensityHeatmap, setShowDensityHeatmap] = useState(true);
  const [showEventMarkers, setShowEventMarkers] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showInfluenceRadius, setShowInfluenceRadius] = useState(true);
  const [activeZoneFilter, setActiveZoneFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Map Navigation State
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [hoveredMeetingId, setHoveredMeetingId] = useState<string | null>(null);
  const [activeMeetingDetailsId, setActiveMeetingDetailsId] = useState<string | null>(selectedMeetingId || (meetings[0]?.id ?? null));
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filtered Meetings
  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.votingZone.includes(searchQuery);
      
      const matchesZone = activeZoneFilter === 'ALL' || m.votingZone === activeZoneFilter || 
        (activeZoneFilter === 'Zona Sul' && ['088', 'Santo Amaro'].some(k => m.votingZone.includes(k) || m.neighborhood.includes(k))) ||
        (activeZoneFilter === 'Zona Norte' && ['105', 'Brasilândia'].some(k => m.votingZone.includes(k) || m.neighborhood.includes(k))) ||
        (activeZoneFilter === 'Zona Leste' && ['094', 'Itaquera'].some(k => m.votingZone.includes(k) || m.neighborhood.includes(k))) ||
        (activeZoneFilter === 'Zona Oeste' && ['082', 'Pinheiros'].some(k => m.votingZone.includes(k) || m.neighborhood.includes(k))) ||
        (activeZoneFilter === 'Centro' && ['102', 'Centro'].some(k => m.votingZone.includes(k) || m.neighborhood.includes(k)));

      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        const today = new Date().toISOString().split('T')[0];
        matchesDate = m.date === today;
      }

      return matchesSearch && matchesZone && matchesStatus && matchesDate;
    });
  }, [meetings, searchQuery, activeZoneFilter, statusFilter, dateFilter]);

  // Active Focused Meeting for Drawer / Details
  const activeMeeting = useMemo(() => {
    return meetings.find(m => m.id === activeMeetingDetailsId) || filteredMeetings[0] || meetings[0];
  }, [meetings, activeMeetingDetailsId, filteredMeetings]);

  // Compute Georeferenced Coordinates Projection
  // Default São Paulo Geo Bounding Box Anchor
  const geoBounds = useMemo(() => {
    const defaultBounds = {
      minLat: -23.68,
      maxLat: -23.45,
      minLng: -46.75,
      maxLng: -46.43
    };

    if (meetings.length === 0) return defaultBounds;

    const lats = meetings.map(m => m.coordinates?.lat || -23.55);
    const lngs = meetings.map(m => m.coordinates?.lng || -46.63);

    const minLat = Math.min(...lats) - 0.03;
    const maxLat = Math.max(...lats) + 0.03;
    const minLng = Math.min(...lngs) - 0.04;
    const maxLng = Math.max(...lngs) + 0.04;

    return { minLat, maxLat, minLng, maxLng };
  }, [meetings]);

  // Helper to convert lat/lng to percentage X/Y on canvas
  const getCoordinatesPercent = useCallback((lat: number, lng: number) => {
    const { minLat, maxLat, minLng, maxLng } = geoBounds;
    // Map projection: higher lat (North) -> lower Y percentage (Top)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10; // keep in 10%-90% range
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y))
    };
  }, [geoBounds]);

  // Aggregate Regional Density Metrics
  const regionalMetrics = useMemo(() => {
    const regions: Record<string, { name: string; count: number; totalPublic: number; avgJacobsDensity: number; zones: string[] }> = {
      'Zona Sul': { name: 'Zona Sul', count: 0, totalPublic: 0, avgJacobsDensity: 0, zones: ['088'] },
      'Zona Norte': { name: 'Zona Norte', count: 0, totalPublic: 0, avgJacobsDensity: 0, zones: ['105'] },
      'Zona Leste': { name: 'Zona Leste', count: 0, totalPublic: 0, avgJacobsDensity: 0, zones: ['094'] },
      'Zona Oeste': { name: 'Zona Oeste', count: 0, totalPublic: 0, avgJacobsDensity: 0, zones: ['082'] },
      'Centro': { name: 'Centro Histórico', count: 0, totalPublic: 0, avgJacobsDensity: 0, zones: ['102'] },
    };

    meetings.forEach(m => {
      let assigned = 'Centro';
      if (m.neighborhood.includes('Santo Amaro') || m.votingZone === '088') assigned = 'Zona Sul';
      else if (m.neighborhood.includes('Brasilândia') || m.votingZone === '105') assigned = 'Zona Norte';
      else if (m.neighborhood.includes('Itaquera') || m.votingZone === '094') assigned = 'Zona Leste';
      else if (m.neighborhood.includes('Pinheiros') || m.votingZone === '082') assigned = 'Zona Oeste';
      else if (m.neighborhood.includes('Centro') || m.votingZone === '102') assigned = 'Centro';

      if (regions[assigned]) {
        regions[assigned].count += 1;
        regions[assigned].totalPublic += (m.expectedAttendance || 0);
        const density = m.attendanceData?.densityFactor || 2.0;
        regions[assigned].avgJacobsDensity += density;
      }
    });

    Object.keys(regions).forEach(k => {
      if (regions[k].count > 0) {
        regions[k].avgJacobsDensity = Number((regions[k].avgJacobsDensity / regions[k].count).toFixed(1));
      }
    });

    const totalPublicCampaign = meetings.reduce((acc, m) => acc + (m.expectedAttendance || 0), 0);
    const highestDensityRegion = Object.values(regions).sort((a, b) => b.totalPublic - a.totalPublic)[0];

    return {
      regionsList: Object.values(regions),
      totalPublicCampaign,
      highestDensityRegion
    };
  }, [meetings]);

  // Handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.8));
  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCenterUserLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocalização não suportada pelo navegador.", "error");
      return;
    }
    setIsLocating(true);
    showToast("Obtendo posição via GPS...", "info");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        setZoom(2.0);
        showToast("Mapa alinhado às suas coordenadas georreferenciadas.", "success");
      },
      (err) => {
        setIsLocating(false);
        showToast("Não foi possível obter geolocalização exata.", "error");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Mouse Drag Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Helper for meeting type colors
  const getTypeColor = (type: MeetingType) => {
    switch (type) {
      case MeetingType.PLENARY: return { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-500', glow: 'rgba(37, 99, 235, 0.35)', halo: 'bg-blue-500/20' };
      case MeetingType.MINI_RALLY: return { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-500', glow: 'rgba(225, 29, 72, 0.35)', halo: 'bg-rose-500/20' };
      case MeetingType.LEADERS_MEETING: return { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-500', glow: 'rgba(217, 119, 6, 0.35)', halo: 'bg-amber-500/20' };
      case MeetingType.THEMATIC_DEBATE: return { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-500', glow: 'rgba(147, 51, 234, 0.35)', halo: 'bg-purple-500/20' };
      default: return { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-500', glow: 'rgba(5, 150, 105, 0.35)', halo: 'bg-emerald-500/20' };
    }
  };

  return (
    <div id="meetings-map-viewer" className={`bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[740px]'
    }`}>
      {/* Top Header / Filter Controls */}
      <div className="p-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm z-30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <Compass size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base leading-tight">Mapa Estratégico Georreferenciado</h3>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {filteredMeetings.length} Eventos Plotados
              </span>
            </div>
            <p className="text-xs text-slate-500">Visualização espacial de eventos, zonas de votação e densidade de público estimada (Método Jacobs)</p>
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Territory filter */}
          <select 
            id="map-zone-filter"
            aria-label="Filtrar por Região / Zona"
            value={activeZoneFilter}
            onChange={(e) => setActiveZoneFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todas as Regiões (Geral)</option>
            <option value="Zona Sul">Zona Sul (Santo Amaro)</option>
            <option value="Zona Norte">Zona Norte (Brasilândia)</option>
            <option value="Zona Leste">Zona Leste (Itaquera)</option>
            <option value="Zona Oeste">Zona Oeste (Pinheiros)</option>
            <option value="Centro">Centro Histórico</option>
          </select>

          {/* Status filter */}
          <select 
            id="map-status-filter"
            aria-label="Filtrar por Status do Evento"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value={MeetingStatus.SCHEDULED}>Agendadas</option>
            <option value={MeetingStatus.IN_PROGRESS}>Em Andamento</option>
            <option value={MeetingStatus.COMPLETED}>Realizadas</option>
          </select>

          {/* Layer toggles pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
            <button
              id="toggle-density-heatmap"
              onClick={() => setShowDensityHeatmap(!showDensityHeatmap)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showDensityHeatmap ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Ativar/Desativar Mancha de Densidade Jacobs"
            >
              <Activity size={14} />
              <span className="hidden sm:inline">Densidade</span>
            </button>
            <button
              id="toggle-event-markers"
              onClick={() => setShowEventMarkers(!showEventMarkers)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showEventMarkers ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Ativar/Desativar Pins de Eventos"
            >
              <MapPin size={14} />
              <span className="hidden sm:inline">Pins</span>
            </button>
            <button
              id="toggle-routes"
              onClick={() => setShowRoutes(!showRoutes)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showRoutes ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Ativar/Desativar Linhas de Deslocamento do Itinerário"
            >
              <Radio size={14} />
              <span className="hidden sm:inline">Rotas</span>
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            id="toggle-fullscreen-map"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title={isFullscreen ? "Sair da Tela Cheia" : "Modo Tela Cheia"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Main Map Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden bg-slate-950 select-none">
        {/* Interactive Map Canvas */}
        <div 
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex-1 relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} bg-slate-900`}
        >
          {/* Digital Cartographic Grid Surface */}
          <div 
            className="absolute inset-0 transition-transform duration-150 ease-out origin-center"
            style={{
              transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
            }}
          >
            {/* Dark Styled Map Background with Geographic Texture */}
            <div 
              className="absolute inset-[-100%] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-40"
            />
            
            {/* Topographic and Zone Grid Vectors Simulation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <pattern id="electoral-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#electoral-grid)" />
              
              {/* Simulated Territorial Borders */}
              <path d="M 100 250 Q 300 280 500 220 T 900 350" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6 6" />
              <path d="M 250 100 Q 380 400 450 650" fill="none" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4 4" />
              <path d="M 500 50 Q 650 320 850 500" fill="none" stroke="#34d399" strokeWidth="1.2" strokeDasharray="5 5" />
            </svg>

            {/* Regional Name Watermarks on Canvas */}
            <div className="absolute top-[18%] left-[22%] text-slate-600/40 text-sm font-black tracking-widest uppercase pointer-events-none">
              Zona Norte • Z.E. 105
            </div>
            <div className="absolute top-[48%] left-[45%] text-slate-600/40 text-sm font-black tracking-widest uppercase pointer-events-none">
              Centro Histórico • Z.E. 102
            </div>
            <div className="absolute top-[75%] left-[26%] text-slate-600/40 text-sm font-black tracking-widest uppercase pointer-events-none">
              Zona Sul • Z.E. 088
            </div>
            <div className="absolute top-[38%] left-[72%] text-slate-600/40 text-sm font-black tracking-widest uppercase pointer-events-none">
              Zona Leste • Z.E. 094
            </div>
            <div className="absolute top-[52%] left-[16%] text-slate-600/40 text-sm font-black tracking-widest uppercase pointer-events-none">
              Zona Oeste • Z.E. 082
            </div>

            {/* Connecting Routes Between Sequential Agenda Events */}
            {showRoutes && filteredMeetings.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                {filteredMeetings.slice(0, -1).map((m, idx) => {
                  const nextM = filteredMeetings[idx + 1];
                  const p1 = getCoordinatesPercent(m.coordinates?.lat || -23.55, m.coordinates?.lng || -46.63);
                  const p2 = getCoordinatesPercent(nextM.coordinates?.lat || -23.55, nextM.coordinates?.lng || -46.63);

                  return (
                    <g key={`route-${m.id}-${nextM.id}`}>
                      {/* Glow effect */}
                      <line 
                        x1={`${p1.x}%`} 
                        y1={`${p1.y}%`} 
                        x2={`${p2.x}%`} 
                        y2={`${p2.y}%`} 
                        stroke="#38bdf8" 
                        strokeWidth="4" 
                        strokeOpacity="0.25"
                        strokeLinecap="round"
                      />
                      {/* Animated dash line */}
                      <line 
                        x1={`${p1.x}%`} 
                        y1={`${p1.y}%`} 
                        x2={`${p2.x}%`} 
                        y2={`${p2.y}%`} 
                        stroke="#38bdf8" 
                        strokeWidth="2" 
                        strokeDasharray="6 6" 
                        strokeOpacity="0.8"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Heatmap / Jacobs Crowd Density Halos */}
            {showDensityHeatmap && filteredMeetings.map((meeting) => {
              const coords = getCoordinatesPercent(
                meeting.coordinates?.lat || -23.55, 
                meeting.coordinates?.lng || -46.63
              );
              const expected = meeting.expectedAttendance || 100;
              const densityFactor = meeting.attendanceData?.densityFactor || 2.0;
              // Halo size scaled by crowd magnitude
              const baseSize = Math.max(120, Math.min(320, (expected / 400) * 240 + 80));
              const typeColor = getTypeColor(meeting.type);

              return (
                <div
                  key={`density-${meeting.id}`}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-all duration-700"
                  style={{
                    top: `${coords.y}%`,
                    left: `${coords.x}%`,
                    width: `${baseSize}px`,
                    height: `${baseSize}px`,
                    background: `radial-gradient(circle, ${typeColor.glow} 0%, rgba(14, 165, 233, 0.12) 50%, transparent 75%)`,
                    filter: 'blur(20px)',
                  }}
                />
              );
            })}

            {/* Influence Radius Rings (500m & 1km Mobilization Reach) */}
            {showInfluenceRadius && filteredMeetings.map((meeting) => {
              const coords = getCoordinatesPercent(
                meeting.coordinates?.lat || -23.55, 
                meeting.coordinates?.lng || -46.63
              );
              const isFocused = activeMeetingDetailsId === meeting.id;

              return (
                <div
                  key={`radius-${meeting.id}`}
                  className={`absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20 transition-all ${
                    isFocused ? 'border-blue-400/60 scale-105' : ''
                  }`}
                  style={{
                    top: `${coords.y}%`,
                    left: `${coords.x}%`,
                    width: '180px',
                    height: '180px',
                  }}
                >
                  <div className="absolute inset-0 rounded-full border border-dashed border-sky-500/30 animate-spin" style={{ animationDuration: '45s' }} />
                </div>
              );
            })}

            {/* User GPS Location Indicator */}
            {userLocation && (
              <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                style={{
                  top: `${getCoordinatesPercent(userLocation.lat, userLocation.lng).y}%`,
                  left: `${getCoordinatesPercent(userLocation.lat, userLocation.lng).x}%`
                }}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-emerald-500/30 rounded-full animate-ping absolute -inset-2" />
                  <div className="w-6 h-6 bg-emerald-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                    <Navigation size={12} className="text-white fill-current" />
                  </div>
                </div>
              </div>
            )}

            {/* Event Markers Plotting */}
            {showEventMarkers && filteredMeetings.map((meeting, index) => {
              const coords = getCoordinatesPercent(
                meeting.coordinates?.lat || -23.55, 
                meeting.coordinates?.lng || -46.63
              );
              const isSelected = activeMeetingDetailsId === meeting.id;
              const isHovered = hoveredMeetingId === meeting.id;
              const typeColor = getTypeColor(meeting.type);

              return (
                <div
                  key={`pin-${meeting.id}`}
                  id={`marker-${meeting.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMeetingDetailsId(meeting.id);
                  }}
                  onMouseEnter={() => setHoveredMeetingId(meeting.id)}
                  onMouseLeave={() => setHoveredMeetingId(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 ${
                    isSelected ? 'scale-125 z-40' : isHovered ? 'scale-115 z-30' : 'hover:scale-110'
                  }`}
                  style={{
                    top: `${coords.y}%`,
                    left: `${coords.x}%`
                  }}
                >
                  {/* Pin Body */}
                  <div className="relative flex flex-col items-center">
                    {/* Event Sequence / Attendance Badge */}
                    <div className="flex items-center gap-1 bg-slate-900/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-700 shadow-lg mb-1 whitespace-nowrap backdrop-blur-md">
                      <Users size={10} className="text-sky-400" />
                      <span>{meeting.expectedAttendance} pax</span>
                    </div>

                    {/* Core Pin Icon */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 border-white shadow-2xl transition-all ${typeColor.bg} ${
                      isSelected ? 'ring-4 ring-sky-400 ring-offset-2 ring-offset-slate-900' : ''
                    }`}>
                      <MapPin size={18} className="text-white drop-shadow-sm" />
                    </div>

                    {/* Ripple on In Progress / Active */}
                    {meeting.status === MeetingStatus.IN_PROGRESS && (
                      <span className="absolute bottom-0 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
                    )}

                    {/* Pin Neighborhood Label */}
                    <span className="mt-1 text-[10px] font-bold text-slate-200 bg-slate-900/80 px-1.5 py-0.5 rounded-md border border-slate-800/80 backdrop-blur-xs whitespace-nowrap shadow-xs">
                      {meeting.neighborhood}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Navigation Controls (Zoom, Geolocation, Reset) */}
          <div className="absolute right-4 top-4 z-40 flex flex-col gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-1 flex flex-col">
              <button
                id="map-zoom-in"
                onClick={handleZoomIn}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                title="Aumentar Zoom"
              >
                <Plus size={18} />
              </button>
              <div className="h-px bg-slate-800 mx-1" />
              <button
                id="map-zoom-out"
                onClick={handleZoomOut}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                title="Diminuir Zoom"
              >
                <Minus size={18} />
              </button>
              <div className="h-px bg-slate-800 mx-1" />
              <button
                id="map-reset-view"
                onClick={handleResetView}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-[10px] font-black"
                title="Resetar Enquadramento"
              >
                1x
              </button>
            </div>

            <button
              id="map-locate-user"
              onClick={handleCenterUserLocation}
              disabled={isLocating}
              className={`p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-2xl shadow-2xl transition-all ${
                isLocating ? 'animate-pulse text-sky-400' : ''
              }`}
              title="Centralizar na Minha Localização"
            >
              <Crosshair size={18} />
            </button>
          </div>

          {/* Live Map Legend Floating Box */}
          <div className="absolute bottom-4 left-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl shadow-2xl text-white max-w-[280px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 flex items-center gap-1.5">
                <Layers size={12} className="text-sky-400" />
                Legenda do Mapa
              </span>
              <span className="text-[9px] text-slate-400 font-mono">SP-CAPITAL</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-300 truncate">Plenária / Geral</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span className="text-slate-300 truncate">Mini-Comício</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-slate-300 truncate">Lideranças</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-300 truncate">Apoiadores</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Mancha de Calor:</span>
              <span className="text-sky-400 font-bold">Método Jacobs (m²)</span>
            </div>
          </div>
        </div>

        {/* Strategic Inspector Sidebar on Right */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col z-30 h-full overflow-y-auto">
          {/* Sidebar Top: Regional Density Breakdown */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Densidade Estimada por Região</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                Total: <strong className="text-blue-600">{regionalMetrics.totalPublicCampaign.toLocaleString()}</strong> pax
              </span>
            </div>

            {/* Regional Progress List */}
            <div className="space-y-2">
              {regionalMetrics.regionsList.map((region) => {
                const percent = regionalMetrics.totalPublicCampaign > 0 
                  ? Math.round((region.totalPublic / regionalMetrics.totalPublicCampaign) * 100) 
                  : 0;

                return (
                  <div 
                    key={region.name}
                    onClick={() => setActiveZoneFilter(activeZoneFilter === region.name ? 'ALL' : region.name)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      activeZoneFilter === region.name 
                        ? 'bg-blue-50/80 border-blue-200 shadow-xs' 
                        : 'bg-white border-slate-200/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${region.count > 0 ? 'bg-blue-500' : 'bg-slate-300'}`} />
                        {region.name}
                      </span>
                      <span className="font-mono font-semibold text-slate-600 text-[11px]">
                        {region.totalPublic} pax ({region.count} ev.)
                      </span>
                    </div>
                    
                    {/* Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>Z.E.: {region.zones.join(', ')}</span>
                      <span>Densidade: {region.avgJacobsDensity > 0 ? `${region.avgJacobsDensity} pax/m²` : 'Sem eventos'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Event Card Inspector */}
          {activeMeeting ? (
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    activeMeeting.type === MeetingType.PLENARY ? 'bg-blue-100 text-blue-700' :
                    activeMeeting.type === MeetingType.MINI_RALLY ? 'bg-rose-100 text-rose-700' :
                    activeMeeting.type === MeetingType.LEADERS_MEETING ? 'bg-amber-100 text-amber-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {activeMeeting.type}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeMeeting.status === MeetingStatus.SCHEDULED ? 'bg-slate-100 text-slate-600' :
                    activeMeeting.status === MeetingStatus.IN_PROGRESS ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {activeMeeting.status === MeetingStatus.SCHEDULED ? 'Agendada' :
                     activeMeeting.status === MeetingStatus.IN_PROGRESS ? 'Em Andamento' : 'Realizada'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2">
                  {activeMeeting.title}
                </h3>

                {/* Location Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 mb-3">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <MapPin size={14} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold text-slate-900">{activeMeeting.venueName}</strong>
                      <span className="text-slate-500 text-[11px]">{activeMeeting.address}</span>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                        <span>Bairro: {activeMeeting.neighborhood}</span>
                        <span>•</span>
                        <span>Zona: {activeMeeting.votingZone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{activeMeeting.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      <span>{activeMeeting.startTime} às {activeMeeting.endTime}</span>
                    </div>
                  </div>
                </div>

                {/* Jacobs Density Computation Card */}
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 mb-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Zap size={14} className="text-blue-600" />
                      Cálculo de Capacidade & Densidade
                    </span>
                    <span className="text-[10px] bg-blue-200/70 text-blue-800 px-1.5 py-0.5 rounded">
                      Jacobs {activeMeeting.attendanceData?.densityFactor || 2.0} p/m²
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="bg-white/80 p-2 rounded-lg border border-blue-100/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Público Esperado</span>
                      <strong className="text-sm font-black text-blue-700">{activeMeeting.expectedAttendance} pax</strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-blue-100/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Área do Local</span>
                      <strong className="text-sm font-black text-slate-800">{activeMeeting.attendanceData?.venueAreaM2 || 150} m²</strong>
                    </div>
                  </div>
                </div>

                {/* Mobilized Leaders Snapshot */}
                <div className="flex items-center justify-between text-xs text-slate-600 px-1 mb-2">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <Users size={13} className="text-slate-400" />
                    Lideranças Mapeadas:
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    {activeMeeting.leadersCheckIn?.length || 0} confirmadas
                  </span>
                </div>

                {/* Coordinator Card */}
                <div className="p-2.5 bg-slate-100/80 rounded-xl border border-slate-200/60 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center font-black text-[10px] shrink-0">
                      <UserCheck size={12} />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 font-medium block leading-none">Coordenador Responsável</span>
                      <strong className="text-slate-800 font-bold truncate text-[11px] block mt-0.5">{activeMeeting.coordinatorName}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Jump to Full Event Management */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  id={`open-meeting-details-${activeMeeting.id}`}
                  onClick={() => {
                    if (onSelectMeeting) {
                      onSelectMeeting(activeMeeting.id);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all"
                >
                  <span>Abrir Gestão Completa do Evento</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center flex-1">
              <MapPin size={32} className="text-slate-300 mb-2" />
              <p className="text-xs font-medium">Selecione um evento no mapa para inspecionar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingMapViewer;
