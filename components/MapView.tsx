
import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Crosshair, 
  Map as MapIcon, 
  Plus, 
  Minus, 
  Settings2,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { MOCK_STATIONS } from '../constants';
import { useToast } from './Toast';

const MapView: React.FC = () => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { showToast } = useToast();

  const hasActiveLayers = showHeatmap || showStations;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1));
  };

  const handleCenterMap = () => {
    if (!navigator.geolocation) {
      showToast("Geolocalização não suportada pelo seu navegador.", "error");
      return;
    }

    setIsLocating(true);
    showToast("Obtendo sua localização atual...", "info");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        setZoom(2.5); // Zoom in on location
        showToast("Mapa centralizado na sua posição atual.", "success");
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        let msg = "Não foi possível obter sua localização.";
        if (error.code === error.PERMISSION_DENIED) msg = "Permissão de geolocalização negada.";
        showToast(msg, "error");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[600px] relative overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-white z-20 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Mapa de Monitoramento Georreferenciado</h2>
          <p className="text-xs text-slate-500">Visualização estratégica de concentração eleitoral</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick Toggle Group */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all ${
                showHeatmap 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Layers size={14} /> Heatmap
            </button>
            <button 
              onClick={() => setShowStations(!showStations)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all ${
                showStations 
                ? 'bg-white text-rose-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <MapPin size={14} /> Urnas
            </button>
          </div>
          
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      {/* Map Surface */}
      <div className="flex-1 relative bg-slate-100 overflow-hidden group/map cursor-crosshair">
        {/* Background Image (Mock Tiles) */}
        <div 
          className="absolute inset-0 grayscale transition-all duration-700 pointer-events-none origin-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=2000)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${zoom})`,
            filter: showHeatmap ? 'grayscale(100%) brightness(0.7) contrast(1.2)' : 'grayscale(0%) brightness(1)'
          }}
        ></div>
        
        {/* Mock Map Markers mapped from MOCK_STATIONS */}
        {showStations && MOCK_STATIONS.map((station, idx) => (
          <div 
            key={station.id}
            className="absolute group z-10 transition-transform duration-300 hover:scale-125"
            style={{ 
              top: idx === 0 ? '25%' : '55%', 
              left: idx === 0 ? '30%' : '65%' 
            }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-xl cursor-pointer ${
              station.strategicImportance === 'HIGH' ? 'bg-blue-600' : 'bg-rose-500'
            }`}>
               <MapPin size={18} className="text-white" />
            </div>
            
            {/* Tooltip detail */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 bg-white p-4 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100 z-50">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                  station.strategicImportance === 'HIGH' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {station.strategicImportance} Priority
                </span>
                <span className="text-[10px] text-slate-400 font-bold"># {station.id}</span>
              </div>
              <p className="font-bold text-sm text-slate-800 leading-tight mb-1">{station.name}</p>
              <p className="text-[11px] text-slate-500 mb-2">{station.address}</p>
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Eleitores</p>
                  <p className="text-xs font-bold text-slate-700">{station.voterCount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Domínio</p>
                  <p className={`text-xs font-bold ${station.strategicImportance === 'HIGH' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {station.strategicImportance === 'HIGH' ? 'Consolidado' : 'Disputado'}
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45"></div>
            </div>
          </div>
        ))}

        {/* User Location Pulse Indicator (Simulated) */}
        {userLocation && (
          <div 
            className="absolute z-40 transition-all duration-500"
            style={{ top: '45%', left: '48%' }} 
          >
            <div className="relative">
              <div className="absolute inset-0 w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-40 -translate-x-1.5 -translate-y-1.5"></div>
              <div className="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                <Navigation size={10} className="text-white fill-current" />
              </div>
            </div>
          </div>
        )}

        {/* Heatmap Overlay Simulation */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-700 overflow-hidden opacity-60">
            {/* Radial Gradients as Density Blobs */}
            <div className="absolute top-[15%] left-[20%] w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] animate-pulse"></div>
            <div className="absolute top-[45%] left-[50%] w-[350px] h-[350px] bg-teal-400 rounded-full mix-blend-screen filter blur-[70px] animate-pulse delay-300"></div>
            <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-blue-600 rounded-full mix-blend-screen filter blur-[90px] animate-pulse delay-700"></div>
            <div className="absolute top-[30%] right-[25%] w-[200px] h-[200px] bg-amber-400 rounded-full mix-blend-screen filter blur-[50px] opacity-40"></div>
          </div>
        )}

        {/* Floating Toolbar (Layers & Zoom) */}
        <div className="absolute right-4 top-4 space-y-3 z-30">
          <div className="flex flex-col bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              title={showHeatmap ? "Desativar Heatmap" : "Ativar Heatmap"}
              className={`p-3 transition-colors ${showHeatmap ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layers size={22} />
            </button>
            <div className="h-px bg-slate-100 mx-2"></div>
            <button 
              onClick={() => setShowStations(!showStations)}
              title={showStations ? "Ocultar Urnas" : "Mostrar Urnas"}
              className={`p-3 transition-colors ${showStations ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <MapPin size={22} />
            </button>
          </div>

          <div className="flex flex-col bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            <button 
              onClick={handleZoomIn} 
              className="p-3 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Aumentar Zoom"
            >
              <Plus size={22} />
            </button>
            <div className="h-px bg-slate-100 mx-2"></div>
            <button 
              onClick={handleZoomOut} 
              className="p-3 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Diminuir Zoom"
            >
              <Minus size={22} />
            </button>
          </div>

          <button 
            onClick={handleCenterMap}
            disabled={isLocating}
            className={`p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 text-slate-600 hover:text-blue-600 transition-all active:scale-95 ${isLocating ? 'animate-pulse' : ''}`}
            title="Centralizar na minha localização"
          >
            <Crosshair size={22} className={isLocating ? 'text-blue-500' : ''} />
          </button>
        </div>

        {/* Legend Panel */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white shadow-2xl min-w-[200px] max-w-[240px] z-30 transition-all duration-500">
          <h4 className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
            <MapIcon size={14} className="text-slate-600" />
            Legenda do Mapa
          </h4>
          
          <div className="space-y-4">
            {!hasActiveLayers && (
              <div className="py-2 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <AlertCircle size={24} className="text-slate-300 mb-1" />
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Nenhuma camada selecionada</p>
                <p className="text-[9px] text-slate-300 mt-1">Ative camadas acima para ver a legenda</p>
              </div>
            )}

            {showHeatmap && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={12} className="text-blue-500" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Calor de Eleitores</span>
                  </div>
                  <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1 rounded">ATIVO</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-transparent via-blue-400 to-blue-600 border border-slate-100"></div>
                <div className="flex justify-between text-[8px] font-black text-slate-400">
                  <span>DENSIDADE BAIXA</span>
                  <span>ALTA</span>
                </div>
              </div>
            )}
            
            {showHeatmap && showStations && <div className="h-px bg-slate-100"></div>}

            {showStations && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300 delay-75">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-rose-500" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Locais de Votação</span>
                  </div>
                  <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-1 rounded">ATIVO</span>
                </div>
                <div className="space-y-1.5 mt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white shadow-sm"></div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Consolidado (Meta Batida)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-sm"></div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Disputa (Abaixo da Meta)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => showToast("Exportando dados geográficos...", "info")}
            className="w-full mt-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
          >
            Baixar Análise Geográfica
          </button>
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest z-30 flex items-center gap-2">
          <Crosshair size={10} className="text-blue-400" />
          Zoom: {zoom.toFixed(1)}x
        </div>
      </div>
    </div>
  );
};

export default MapView;
