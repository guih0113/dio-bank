from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
from app.models.schemas import (
    Connector,
    Item,
    Account,
    Transaction,
    FinancialSummary,
    ConnectTokenResponse,
    ConnectMockRequest,
    AIChatRequest,
    AIChatResponse,
)
from app.services.service_factory import get_pluggy_service
from app.services.ai_assistant import ai_assistant_service

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "DIO Bank Open Finance API",
        "mode": "mock" if settings.is_mock_mode else "real",
    }


@router.get("/mode")
async def get_system_mode():
    return {
        "isMock": settings.is_mock_mode,
        "pluggyConfigured": bool(settings.PLUGGY_CLIENT_ID and settings.PLUGGY_CLIENT_SECRET),
        "baseUrl": settings.PLUGGY_BASE_URL,
    }


@router.get("/connectors", response_model=List[Connector])
async def list_connectors():
    """List available Open Finance banking institutions."""
    service = get_pluggy_service()
    return await service.get_connectors()


@router.post("/connect/token", response_model=ConnectTokenResponse)
async def create_connect_token():
    """Create a token for the Pluggy Connect Widget (or simulated mock token)."""
    service = get_pluggy_service()
    data = await service.create_connect_token()
    return ConnectTokenResponse(
        accessToken=data["accessToken"],
        isMock=data.get("isMock", False),
    )


@router.post("/connect/mock", response_model=Item)
async def connect_mock_institution(req: ConnectMockRequest):
    """Simulate connecting a financial institution in mock mode."""
    service = get_pluggy_service()
    try:
        return await service.connect_mock_institution(req.connectorId)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/items", response_model=List[Item])
async def list_items():
    """List all connected banking items."""
    service = get_pluggy_service()
    return await service.list_items()


@router.delete("/items/{item_id}")
async def delete_item(item_id: str):
    """Disconnect a banking institution."""
    service = get_pluggy_service()
    success = await service.delete_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item não encontrado ou já removido.")
    return {"success": True, "message": "Instituição desconectada com sucesso."}


@router.get("/accounts", response_model=List[Account])
async def list_accounts(itemId: Optional[str] = Query(None)):
    """List all aggregated accounts across connected institutions."""
    service = get_pluggy_service()
    return await service.list_accounts(item_id=itemId)


@router.get("/transactions", response_model=List[Transaction])
async def list_transactions(
    accountId: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
):
    """List and search transactions."""
    service = get_pluggy_service()
    return await service.list_transactions(
        account_id=accountId,
        category=category,
        search=search,
        start_date=startDate,
        end_date=endDate,
    )


@router.get("/summary", response_model=FinancialSummary)
async def get_financial_summary():
    """Get aggregated financial health metrics."""
    service = get_pluggy_service()
    return await service.get_financial_summary()


@router.post("/ai/chat", response_model=AIChatResponse)
async def chat_with_ai(request: AIChatRequest):
    """Interact with the Open Finance AI Assistant powered by MCP tools."""
    return await ai_assistant_service.chat(
        user_message=request.message,
        history=request.history,
    )


@router.get("/mcp/tools")
async def list_mcp_tools():
    """List registered Open Finance MCP tools available to AI agents."""
    return {
        "tools": [
            {
                "name": "get_open_finance_overview",
                "description": "Calculates consolidated net worth, total balance, credit debt, income, and expenses.",
            },
            {
                "name": "list_bank_accounts",
                "description": "Lists all bank accounts, checking accounts, credit cards, and investments.",
            },
            {
                "name": "get_recent_transactions",
                "description": "Retrieves recent transactions with optional filters for category and search.",
            },
            {
                "name": "analyze_spending_by_category",
                "description": "Breaks down all user expenses by category with percentages.",
            },
            {
                "name": "search_transactions_by_merchant",
                "description": "Searches for transactions matching a specific merchant or keyword.",
            },
            {
                "name": "simulate_connect_bank",
                "description": "Simulates connecting a new bank in Open Finance.",
            },
        ]
    }
