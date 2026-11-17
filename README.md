# DIO Bank 🏦

Aplicação bancária inteligente conectada via **Open Finance Brasil** com gerador de conexões **Pluggy** e servidor **MCP (Model Context Protocol)**, construída com backend em **Python (FastAPI + FastMCP)** e frontend moderno em **React + TypeScript + Tailwind CSS**.

---

## 🌟 Visão Geral da Arquitetura

```
dio-bank/
├── backend/                  # API Python FastAPI + Servidor MCP
│   ├── app/
│   │   ├── api/routes.py     # Endpoints REST (contas, transações, connect, IA)
│   │   ├── core/config.py    # Configurações de ambiente & detecção de modo
│   │   ├── mcp/
│   │   │   ├── server.py     # Servidor FastMCP oficial (MCP SDK v2.3)
│   │   │   └── tools.py      # Ferramentas Open Finance (saldo, faturas, gastos)
│   │   ├── models/schemas.py # Modelos Pydantic tipados
│   │   └── services/
│   │       ├── pluggy_base.py     # Interface abstrata Open Finance
│   │       ├── mock_service.py    # Simulação realista com bancos brasileiros
│   │       ├── pluggy_service.py  # Integração real com a API Pluggy.ai
│   │       ├── service_factory.py # Injeção de dependência (Mock vs Real)
│   │       └── ai_assistant.py    # Assistente IA com execução de ferramentas MCP
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                 # Interface React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Cabeçalho com status Open Finance & CTAs
│   │   │   ├── SummaryCards.tsx   # Métricas (Patrimônio, Saldo, Dívida, Fluxo)
│   │   │   ├── ConnectedBanks.tsx # Bancos conectados com logos & desconexão
│   │   │   ├── AccountsList.tsx   # Contas e cartões com limite utilizado
│   │   │   ├── TransactionsFeed.tsx # Extrato com busca e filtros de categoria
│   │   │   ├── ConnectModal.tsx   # Fluxo de conexão (Mock ou Widget Pluggy)
│   │   │   └── AIChatDrawer.tsx   # Assistente Financeiro IA com badges MCP
│   │   ├── services/api.ts        # Cliente de comunicação com o backend
│   │   └── types/openFinance.ts   # Interfaces TypeScript
│   └── package.json
│
├── run_backend.bat / .ps1    # Iniciar backend FastAPI
├── run_frontend.bat / .ps1   # Iniciar frontend React Vite
└── run_all.bat / .ps1        # Iniciar aplicação completa
```

---

## 🚀 Como Executar

### 1. Iniciar Tudo com Um Clique
Execute no terminal PowerShell:
```powershell
.\run_all.ps1
```
Ou no CMD:
```cmd
run_all.bat
```

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔄 Modo Mock vs. Modo Pluggy Real

O DIO Bank foi projetado com o padrão **Adapter**:

### Modo Mock (Padrão - Não requer credenciais)
* Já vem pré-configurado e funcionando imediatamente!
* Carrega instituições bancárias brasileiras reais: **Nubank**, **Banco Inter**, **Itaú**, **Bradesco**, **BTG Pactual** e **Banco do Brasil**.
* Permite simular a conexão de novos bancos com consentimento Open Finance em tempo real.
* As contas, faturas e transações atualizam instantaneamente na interface e nas respostas da IA.

### Modo Pluggy Real
Quando você criar sua conta no [Dashboard da Pluggy](https://dashboard.pluggy.ai):
1. Abra o arquivo `backend/.env` (ou copie de `backend/.env.example`).
2. Preencha suas credenciais:
   ```env
   PLUGGY_CLIENT_ID=seu_client_id_aqui
   PLUGGY_CLIENT_SECRET=seu_client_secret_aqui
   PLUGGY_MOCK_MODE=false
   ```
3. Reinicie o backend. O sistema ativará automaticamente as chamadas à API da Pluggy e o widget oficial **Pluggy Connect**!

---

## 🧠 Servidor Open Finance MCP (Model Context Protocol)

O servidor MCP expõe ferramentas padronizadas para agentes de Inteligência Artificial:

| Ferramenta MCP | Descrição |
|---|---|
| `get_open_finance_overview` | Retorna o patrimônio líquido, saldos, dívida total de faturas e fluxo mensal consolidado. |
| `list_bank_accounts` | Lista todas as contas (corrente, poupança, investimento, cartões), com filtro opcional por banco. |
| `get_recent_transactions` | Recupera as últimas transações com filtros por categoria ou termo de busca. |
| `analyze_spending_by_category` | Realiza o agrupamento e cálculo percentual das despesas por categoria. |
| `search_transactions_by_merchant` | Pesquisa transações de um estabelecimento específico (*Uber*, *iFood*, *Netflix*, *Pão de Açúcar*, etc.). |
| `simulate_connect_bank` | Conecta uma nova instituição bancária ao ecossistema Open Finance do usuário. |

### Assistente Financeiro IA Integrado (Opção A)
No canto inferior direito da tela, clique no botão flutuante **Assistente Financeiro IA**:
* Responde a perguntas em linguagem natural como:
  * *"Quanto gastei com mercado este mês?"*
  * *"Mostre meus gastos com Uber"*
  * *"Qual meu saldo total e faturas de cartão?"*
  * *"Analise minhas despesas por categoria"*
  * *"Conectar Itaú"*
* Cada resposta exibe badges visuais `mcp:tool_name` mostrando exatamente quais ferramentas MCP foram consultadas em tempo real!
