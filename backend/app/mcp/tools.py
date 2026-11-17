from typing import Optional, Dict, Any, List
from app.services.service_factory import get_pluggy_service


async def mcp_get_open_finance_overview() -> Dict[str, Any]:
    """
    Get a complete Open Finance overview of the user's financial health,
    including total balances across all connected banks, credit card debt,
    investments, calculated net worth, and monthly income vs expenses.
    """
    service = get_pluggy_service()
    summary = await service.get_financial_summary()
    items = await service.list_items()
    accounts = await service.list_accounts()

    return {
        "summary": summary.model_dump(),
        "connected_banks": [
            {"id": item.id, "name": item.connectorName, "status": item.status}
            for item in items
        ],
        "accounts_overview": [
            {
                "name": acc.name,
                "bank": acc.bankName,
                "type": acc.subtype,
                "balance": acc.balance,
                "creditLimit": acc.creditLimit,
            }
            for acc in accounts
        ],
    }


async def mcp_list_bank_accounts(bank_name: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    List all connected bank accounts, checking accounts, credit cards, and investments.
    Optionally filter by bank name (e.g. 'Nubank', 'Inter', 'Itaú').
    """
    service = get_pluggy_service()
    accounts = await service.list_accounts()

    if bank_name:
        accounts = [acc for acc in accounts if bank_name.lower() in acc.bankName.lower()]

    return [acc.model_dump() for acc in accounts]


async def mcp_get_recent_transactions(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 15,
) -> List[Dict[str, Any]]:
    """
    Retrieve the most recent transactions across all connected accounts.
    Allows filtering by category (e.g. 'Alimentação', 'Transporte', 'Moradia') or keyword.
    """
    service = get_pluggy_service()
    transactions = await service.list_transactions(category=category, search=search)
    return [tx.model_dump() for tx in transactions[:limit]]


async def mcp_analyze_spending_by_category() -> Dict[str, Any]:
    """
    Analyze and break down all user expenses by category.
    Returns the total spent per category and percentage share.
    """
    service = get_pluggy_service()
    transactions = await service.list_transactions()

    expenses = [tx for tx in transactions if tx.type == "DEBIT"]
    total_spent = abs(sum(tx.amount for tx in expenses))

    category_totals: Dict[str, float] = {}
    for tx in expenses:
        cat = tx.category
        category_totals[cat] = category_totals.get(cat, 0.0) + abs(tx.amount)

    breakdown = []
    for cat, amount in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
        percentage = round((amount / total_spent) * 100, 1) if total_spent > 0 else 0
        breakdown.append({
            "category": cat,
            "total_spent": round(amount, 2),
            "percentage": percentage,
        })

    return {
        "total_expenses": round(total_spent, 2),
        "categories_breakdown": breakdown,
    }


async def mcp_search_transactions_by_merchant(query: str) -> Dict[str, Any]:
    """
    Search for all transactions associated with a specific merchant, payee, or keyword
    (e.g. 'Uber', 'iFood', 'Netflix', 'Pão de Açúcar', 'Pix', 'Salário').
    """
    service = get_pluggy_service()
    transactions = await service.list_transactions(search=query)
    total_amount = sum(tx.amount for tx in transactions)

    return {
        "query": query,
        "match_count": len(transactions),
        "net_total": round(total_amount, 2),
        "transactions": [tx.model_dump() for tx in transactions],
    }


async def mcp_simulate_connect_bank(connector_id: int) -> Dict[str, Any]:
    """
    Simulate connecting a new bank in Open Finance (Mock mode).
    Available connector IDs: 1 (Bradesco), 2 (Itaú), 202 (BTG Pactual), 3 (Banco do Brasil).
    """
    service = get_pluggy_service()
    item = await service.connect_mock_institution(connector_id)
    return {
        "success": True,
        "connected_bank": item.model_dump(),
        "message": f"Instituição {item.connectorName} conectada com sucesso via Open Finance!",
    }
