from typing import Optional, Dict, Any, List
from mcp.server.mcpserver import MCPServer
from app.mcp.tools import (
    mcp_get_open_finance_overview,
    mcp_list_bank_accounts,
    mcp_get_recent_transactions,
    mcp_analyze_spending_by_category,
    mcp_search_transactions_by_merchant,
    mcp_simulate_connect_bank,
)

mcp_server = MCPServer("DIO Bank Open Finance MCP")


@mcp_server.tool()
async def get_open_finance_overview() -> Dict[str, Any]:
    """
    Get a complete Open Finance overview of the user's financial health,
    including total balances across all connected banks, credit card debt,
    investments, calculated net worth, and monthly income vs expenses.
    """
    return await mcp_get_open_finance_overview()


@mcp_server.tool()
async def list_bank_accounts(bank_name: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    List all connected bank accounts, checking accounts, credit cards, and investments.
    Optionally filter by bank name (e.g. 'Nubank', 'Inter', 'Itaú').
    """
    return await mcp_list_bank_accounts(bank_name)


@mcp_server.tool()
async def get_recent_transactions(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 15,
) -> List[Dict[str, Any]]:
    """
    Retrieve the most recent transactions across all connected accounts.
    Allows filtering by category (e.g. 'Alimentação', 'Transporte', 'Moradia') or keyword.
    """
    return await mcp_get_recent_transactions(category=category, search=search, limit=limit)


@mcp_server.tool()
async def analyze_spending_by_category() -> Dict[str, Any]:
    """
    Analyze and break down all user expenses by category.
    Returns the total spent per category and percentage share.
    """
    return await mcp_analyze_spending_by_category()


@mcp_server.tool()
async def search_transactions_by_merchant(query: str) -> Dict[str, Any]:
    """
    Search for all transactions associated with a specific merchant, payee, or keyword
    (e.g. 'Uber', 'iFood', 'Netflix', 'Pão de Açúcar', 'Pix', 'Salário').
    """
    return await mcp_search_transactions_by_merchant(query)


@mcp_server.tool()
async def simulate_connect_bank(connector_id: int) -> Dict[str, Any]:
    """
    Simulate connecting a new bank in Open Finance (Mock mode).
    Available connector IDs: 1 (Bradesco), 2 (Itaú), 202 (BTG Pactual), 3 (Banco do Brasil).
    """
    return await mcp_simulate_connect_bank(connector_id)


if __name__ == "__main__":
    import asyncio
    print("Iniciando DIO Bank Open Finance MCP Server (stdio)...")
    asyncio.run(mcp_server.run_stdio_async())
