import re
import json
import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.mcp.tools import (
    mcp_get_open_finance_overview,
    mcp_list_bank_accounts,
    mcp_get_recent_transactions,
    mcp_analyze_spending_by_category,
    mcp_search_transactions_by_merchant,
    mcp_simulate_connect_bank,
)
from app.models.schemas import ChatMessage, AIChatResponse


class AIAssistantService:
    @property
    def api_key(self) -> str:
        return settings.GEMINI_API_KEY.strip()

    async def _call_gemini(
        self,
        user_message: str,
        context: Dict[str, Any],
        history: Optional[List[ChatMessage]] = None,
    ) -> Optional[str]:
        """
        Calls Google Gemini API (gemini-2.5-flash) using the provided Open Finance context data.
        """
        if not self.api_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
        
        system_instruction = (
            "Você é o Assistente Financeiro IA oficial do DIO Bank, conectado diretamente ao ecossistema Open Finance Brasil.\n"
            "Você tem acesso aos dados consolidados de contas correntes, cartões de crédito, transações e investimentos do usuário.\n"
            "Responda sempre em português brasileiro de forma clara, empática, profissional e objetiva, usando formatação markdown.\n"
            "Quando relevante, forneça dicas práticas de educação financeira e insights sobre os hábitos de consumo do usuário.\n\n"
            f"--- DADOS CONSOLIDADOS DO OPEN FINANCE ---\n{json.dumps(context, ensure_ascii=False, indent=2)}\n"
        )

        contents = []
        if history:
            for h in history[-6:]:
                role = "user" if h.role == "user" else "model"
                contents.append({"role": role, "parts": [{"text": h.content}]})

        contents.append({"role": "user", "parts": [{"text": user_message}]})

        payload = {
            "system_instruction": {"parts": [{"text": system_instruction}]},
            "contents": contents,
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1000,
            },
        }

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, json=payload, timeout=20.0)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text_parts = candidates[0].get("content", {}).get("parts", [])
                        if text_parts:
                            return text_parts[0].get("text")
        except Exception as e:
            # If Gemini call fails (network/quota), fall back cleanly to semantic MCP engine
            print(f"[AIAssistant] Falha ao consultar Gemini API: {e}. Usando fallback local.")
            return None

        return None

    async def chat(self, user_message: str, history: Optional[List[ChatMessage]] = None) -> AIChatResponse:
        """
        Process user natural language queries, dispatch appropriate Open Finance MCP tools,
        and generate a structured, helpful financial response.
        """
        msg = user_message.lower().strip()
        tools_used = []
        data_payload = {}

        # 0. Check for institution connection command (e.g. "conectar Itaú", "conectar Bradesco")
        if "conectar" in msg and any(b in msg for b in ["itau", "itaú", "bradesco", "btg", "brasil"]):
            tools_used.append("simulate_connect_bank")
            connector_id = 2 if "ita" in msg else (1 if "bradesco" in msg else (202 if "btg" in msg else 3))
            res = await mcp_simulate_connect_bank(connector_id)
            bank_name = res["connected_bank"]["connectorName"]
            reply = (
                f"✅ **Conexão Realizada via Open Finance!**\n\n"
                f"A instituição **{bank_name}** foi conectada com sucesso ao seu DIO Bank. "
                f"Suas contas, cartões e transações já foram sincronizados e estão visíveis no seu painel."
            )
            data_payload = res
            return AIChatResponse(reply=reply, tools_used=tools_used, data=data_payload)

        # 1. Check for specific merchant / brand search (e.g. "quanto gastei no ifood", "uber", "netflix", "pix", "spotify")
        merchant_keywords = [
            "uber", "ifood", "netflix", "pão de açúcar", "mercado livre",
            "smart fit", "ipiranga", "raia", "spotify", "salário", "aluguel"
        ]
        found_merchant = next((m for m in merchant_keywords if m in msg), None)

        if found_merchant and not any(w in msg for w in ["categoria", "categorias"]):
            tools_used.append("search_transactions_by_merchant")
            data = await mcp_search_transactions_by_merchant(found_merchant)
            data_payload["search_results"] = data

            if data["match_count"] == 0:
                reply = f"🔍 Não encontrei nenhuma transação recente correspondente a **'{found_merchant.title()}'** nas suas contas conectadas."
            else:
                tx_lines = [
                    f"• {tx['date']} | **{tx['description']}**: R$ {abs(tx['amount']):,.2f} ({tx['bankName']})"
                    for tx in data["transactions"]
                ]
                reply = (
                    f"🔍 **Encontrei {data['match_count']} transação(ões) para '{found_merchant.title()}':**\n\n"
                    + "\n".join(tx_lines)
                    + f"\n\n💰 **Total Gasto com {found_merchant.title()}:** R$ {abs(data['net_total']):,.2f}"
                )
            return AIChatResponse(reply=reply, tools_used=tools_used, data=data_payload)

        # 2. Check for category / general spending breakdown
        category_triggers = [
            "categoria", "categorias", "gastos", "gastei", "despesas", "onde gastei",
            "distribuição", "maiores gastos", "comida", "mercado", "alimentação",
            "transporte", "moradia", "saúde", "lazer", "assinaturas"
        ]
        if any(w in msg for w in category_triggers):
            # Check if user specifically asked about a single category
            specific_cat = None
            if any(w in msg for w in ["mercado", "alimentação", "comida", "restaurante"]):
                specific_cat = "Alimentação & Mercado"
            elif any(w in msg for w in ["transporte", "uber", "gasolina", "combustível"]):
                specific_cat = "Transporte"
            elif any(w in msg for w in ["moradia", "aluguel"]):
                specific_cat = "Moradia"
            elif any(w in msg for w in ["saúde", "farmácia", "academia", "fitness"]):
                specific_cat = "Saúde & Bem-estar"
            elif any(w in msg for w in ["assinaturas", "streaming", "netflix", "spotify"]):
                specific_cat = "Serviços & Assinaturas"

            tools_used.append("analyze_spending_by_category")
            data = await mcp_analyze_spending_by_category()
            data_payload["spending_analysis"] = data

            if specific_cat:
                cat_match = next((c for c in data["categories_breakdown"] if c["category"] == specific_cat), None)
                txs = await mcp_get_recent_transactions(category=specific_cat)
                tools_used.append("get_recent_transactions")
                spent_amount = cat_match["total_spent"] if cat_match else sum(abs(t["amount"]) for t in txs)
                tx_lines = [f"• {t['date']} | **{t['description']}**: R$ {abs(t['amount']):,.2f} ({t['bankName']})" for t in txs]
                
                reply = (
                    f"🛒 **Gastos na categoria '{specific_cat}':**\n\n"
                    f"Você gastou um total de **R$ {spent_amount:,.2f}** nesta categoria recentemente.\n\n"
                    f"**Últimas transações:**\n"
                    + "\n".join(tx_lines)
                    + f"\n\n💡 Isso representa {cat_match['percentage'] if cat_match else 0}% do seu total de despesas."
                )
                return AIChatResponse(reply=reply, tools_used=tools_used, data=data_payload)

            breakdown_lines = []
            for item in data["categories_breakdown"][:5]:
                breakdown_lines.append(
                    f"• **{item['category']}**: R$ {item['total_spent']:,.2f} ({item['percentage']}%)"
                )
            breakdown_text = "\n".join(breakdown_lines)

            reply = (
                f"📊 **Análise de Gastos por Categoria (Open Finance):**\n\n"
                f"O seu total de despesas recentes é de **R$ {data['total_expenses']:,.2f}**.\n\n"
                f"Aqui está a divisão das suas principais despesas:\n"
                f"{breakdown_text}\n\n"
                f"💡 **Dica DIO Bank:** Sua maior concentração de gastos está em **{data['categories_breakdown'][0]['category']}**. "
                f"Recomendo estabelecer um limite mensal nesta categoria para otimizar seus aportes em investimentos."
            )
            return AIChatResponse(reply=reply, tools_used=tools_used, data=data_payload)

        # 3. Check for specific merchant or query search
        if found_merchant or any(w in msg for w in ["procure", "busca", "pesquise"]):
            query_target = found_merchant or msg.replace("procure", "").replace("pesquise", "").strip()
            tools_used.append("search_transactions_by_merchant")
            data = await mcp_search_transactions_by_merchant(query_target)
            data_payload["search_results"] = data

            if data["match_count"] == 0:
                reply = f"🔍 Não encontrei nenhuma transação recente correspondente a **'{query_target}'** nas suas contas conectadas."
            else:
                tx_lines = [
                    f"• {tx['date']} | **{tx['description']}**: R$ {abs(tx['amount']):,.2f} ({tx['bankName']})"
                    for tx in data["transactions"]
                ]
                reply = (
                    f"🔍 **Encontrei {data['match_count']} transação(ões) para '{query_target}':**\n\n"
                    + "\n".join(tx_lines)
                    + f"\n\n💰 **Impacto Financeiro Total:** R$ {data['net_total']:,.2f}"
                )
            return AIChatResponse(reply=reply, tools_used=tools_used, data=data_payload)

        # 4. Check for balances / accounts query
        if any(w in msg for w in ["saldo", "saldo total", "contas", "extrato", "bancos", "cartão", "fatura", "patrimônio"]):
            tools_used.extend(["get_open_finance_overview", "list_bank_accounts"])
            overview = await mcp_get_open_finance_overview()
            accounts = await mcp_list_bank_accounts()
            data_payload["overview"] = overview
            data_payload["accounts"] = accounts

            summary = overview["summary"]
            accounts_lines = []
            for acc in accounts:
                balance_formatted = f"R$ {acc['balance']:,.2f}"
                if acc['type'] == 'CREDIT':
                    accounts_lines.append(f"• **{acc['bankName']}** ({acc['name']}): Fatura atual {balance_formatted} | Limite: R$ {acc.get('creditLimit', 0):,.2f}")
                else:
                    accounts_lines.append(f"• **{acc['bankName']}** ({acc['name']}): Saldo {balance_formatted}")

            reply = (
                f"💳 **Visão Geral das Suas Contas Conectadas:**\n\n"
                f"• **Patrimônio Líquido:** R$ {summary['net_worth']:,.2f}\n"
                f"• **Saldo em Conta Corrente:** R$ {summary['total_balance']:,.2f}\n"
                f"• **Investimentos:** R$ {summary['total_investments']:,.2f}\n"
                f"• **Fatura de Cartões (Dívida Aberta):** R$ {summary['total_credit_debt']:,.2f}\n\n"
                f"**Detalhamento por Conta:**\n"
                + "\n".join(accounts_lines)
            )
            return AIChatResponse(reply=reply, tools_used=tools_used, data=data_payload)

        # 5. Default / Open-Ended Query: Execute Overview & Pass to Gemini (if API Key present)
        tools_used.append("get_open_finance_overview")
        overview = await mcp_get_open_finance_overview()
        accounts = await mcp_list_bank_accounts()
        spending = await mcp_analyze_spending_by_category()
        txs = await mcp_get_recent_transactions(limit=20)

        context_data = {
            "financial_summary": overview["summary"],
            "accounts": accounts,
            "spending_by_category": spending,
            "recent_transactions": txs,
        }
        data_payload["context"] = context_data

        # If Gemini API Key is available, use LLM synthesis
        if self.api_key:
            tools_used.append("gemini_2.5_flash")
            gemini_reply = await self._call_gemini(
                user_message=user_message,
                context=context_data,
                history=history,
            )
            if gemini_reply:
                return AIChatResponse(reply=gemini_reply, tools_used=tools_used, data=data_payload)

        # Fallback to local structured financial diagnostic
        summary = overview["summary"]
        reply = (
            f"Olá! Eu sou seu **Assistente Financeiro DIO Bank**, conectado via **Open Finance MCP**.\n\n"
            f"Aqui está o seu diagnóstico financeiro em tempo real:\n"
            f"• 💰 **Patrimônio Consolidado:** R$ {summary['net_worth']:,.2f}\n"
            f"• 🏦 **Contas Conectadas:** {summary['banks_connected']} bancos ({summary['accounts_count']} contas/cartões)\n"
            f"• 📥 **Renda no Período:** R$ {summary['monthly_income']:,.2f}\n"
            f"• 📤 **Gastos no Período:** R$ {summary['monthly_expenses']:,.2f}\n\n"
            f"Você pode me perguntar:\n"
            f"1. *'Quanto gastei com mercado este mês?'*\n"
            f"2. *'Mostre meus gastos com Uber e iFood'*\n"
            f"3. *'Qual meu saldo total e faturas de cartão?'*\n"
            f"4. *'Analise minhas despesas por categoria'*"
        )
        return AIChatResponse(reply=reply, tools_used=tools_used, data=data_payload)


ai_assistant_service = AIAssistantService()
