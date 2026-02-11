
# 🗳️ Biduga - Electoral Command Center

Suíte estratégica para gestão de campanhas eleitorais, monitoramento de eleitores e inteligência de dados.

## 🚀 Como Deployar na Vercel

### 1. Requisitos de Ambiente
O sistema utiliza o **Google Gemini API** para insights estratégicos. É obrigatório configurar a variável de ambiente no dashboard da Vercel:

- `API_KEY`: Sua chave de API do Google AI Studio.

### 2. Passo a Passo
1. Conecte este repositório à Vercel.
2. Nas configurações de **Environment Variables**, adicione a chave `API_KEY`.
3. O deploy será automático. O arquivo `vercel.json` já cuida do roteamento SPA.

## 🛠️ Arquitetura
- **Frontend:** React 19 (Modern ESM/No-build approach).
- **Estilização:** Tailwind CSS.
- **IA:** Google Gemini 3 Flash para análise preditiva e insights.
- **BI:** Recharts para visualização de dados e Heatmaps georreferenciados.

## ⚖️ LGPD
Este sistema foi projetado para conformidade com a LGPD, exigindo criptografia de dados de eleitores e controle de acesso baseado em papéis (RBAC).
