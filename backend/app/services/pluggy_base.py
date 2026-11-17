from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from app.models.schemas import Connector, Item, Account, Transaction, FinancialSummary


class BasePluggyService(ABC):
    @abstractmethod
    async def get_connectors(self) -> List[Connector]:
        """Fetch list of supported financial connectors."""
        pass

    @abstractmethod
    async def create_connect_token(self, client_user_id: Optional[str] = None) -> Dict[str, Any]:
        """Create a connect token for Pluggy Connect widget."""
        pass

    @abstractmethod
    async def list_items(self) -> List[Item]:
        """List all connected items (financial connections)."""
        pass

    @abstractmethod
    async def get_item(self, item_id: str) -> Optional[Item]:
        """Get details of a specific item connection."""
        pass

    @abstractmethod
    async def delete_item(self, item_id: str) -> bool:
        """Disconnect/delete a financial institution connection."""
        pass

    @abstractmethod
    async def list_accounts(self, item_id: Optional[str] = None) -> List[Account]:
        """List all accounts, optionally filtered by item_id."""
        pass

    @abstractmethod
    async def list_transactions(
        self,
        account_id: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[Transaction]:
        """List transactions across accounts with optional filters."""
        pass

    @abstractmethod
    async def get_financial_summary(self) -> FinancialSummary:
        """Calculate aggregated summary across all accounts and transactions."""
        pass

    @abstractmethod
    async def connect_mock_institution(self, connector_id: int) -> Item:
        """Simulate connecting a new financial institution (used in mock mode)."""
        pass
