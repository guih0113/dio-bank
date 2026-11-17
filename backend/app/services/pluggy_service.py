import httpx
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.schemas import Connector, Item, Account, Transaction, FinancialSummary
from app.services.pluggy_base import BasePluggyService
from app.core.config import settings


class RealPluggyService(BasePluggyService):
    def __init__(self):
        self._api_key: Optional[str] = None
        self._api_key_expires_at: Optional[datetime] = None

    @property
    def base_url(self) -> str:
        return settings.PLUGGY_BASE_URL.rstrip("/")

    @property
    def client_id(self) -> str:
        return settings.PLUGGY_CLIENT_ID

    @property
    def client_secret(self) -> str:
        return settings.PLUGGY_CLIENT_SECRET

    async def _get_api_key(self) -> str:
        """Authenticate with Pluggy and retrieve or refresh an API Key."""
        if self._api_key:
            return self._api_key

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/auth",
                json={
                    "clientId": self.client_id,
                    "clientSecret": self.client_secret,
                },
                timeout=15.0,
            )
            resp.raise_for_status()
            data = resp.json()
            api_key = data.get("apiKey")
            if not api_key or not isinstance(api_key, str):
                raise ValueError("Resposta de autenticação da Pluggy não retornou uma 'apiKey' válida.")
            
            self._api_key = api_key
            return api_key

    async def _headers(self) -> Dict[str, str]:
        key = await self._get_api_key()
        return {
            "X-API-KEY": key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def get_connectors(self) -> List[Connector]:
        headers = await self._headers()
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/connectors",
                headers=headers,
                params={"countries": "BR"},
                timeout=15.0,
            )
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", [])
            return [
                Connector(
                    id=c["id"],
                    name=c["name"],
                    primaryColor=c.get("primaryColor") or "#0066FF",
                    institutionUrl=c.get("institutionUrl"),
                    imageUrl=c.get("imageUrl"),
                    type=c.get("type", "PERSONAL_BANK"),
                    country="BR",
                )
                for c in results
            ]

    async def create_connect_token(self, client_user_id: Optional[str] = None) -> Dict[str, Any]:
        headers = await self._headers()
        body: Dict[str, Any] = {}
        if client_user_id:
            body["clientUserId"] = client_user_id

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/connect_token",
                headers=headers,
                json=body,
                timeout=15.0,
            )
            resp.raise_for_status()
            data = resp.json()
            token = data.get("accessToken")
            if not token or not isinstance(token, str):
                raise ValueError("Resposta da Pluggy não retornou um 'accessToken' válido.")
            return {
                "accessToken": token,
                "isMock": False,
            }

    async def list_items(self) -> List[Item]:
        headers = await self._headers()
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/items", headers=headers, timeout=15.0)
            resp.raise_for_status()
            data = resp.json()
            items_list = data.get("results", [])

            items = []
            for it in items_list:
                conn = it.get("connector", {})
                items.append(
                    Item(
                        id=it["id"],
                        connectorId=conn.get("id", 0),
                        connectorName=conn.get("name", "Desconhecido"),
                        connectorColor=conn.get("primaryColor") or "#1F2937",
                        connectorLogo=conn.get("imageUrl"),
                        status=it.get("status", "UPDATED"),
                        createdAt=it.get("createdAt", ""),
                        updatedAt=it.get("updatedAt", ""),
                        error=it.get("error"),
                    )
                )
            return items

    async def get_item(self, item_id: str) -> Optional[Item]:
        headers = await self._headers()
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/items/{item_id}", headers=headers, timeout=15.0)
            if resp.status_code == 404:
                return None
            resp.raise_for_status()
            it = resp.json()
            conn = it.get("connector", {})
            return Item(
                id=it["id"],
                connectorId=conn.get("id", 0),
                connectorName=conn.get("name", "Desconhecido"),
                connectorColor=conn.get("primaryColor") or "#1F2937",
                connectorLogo=conn.get("imageUrl"),
                status=it.get("status", "UPDATED"),
                createdAt=it.get("createdAt", ""),
                updatedAt=it.get("updatedAt", ""),
                error=it.get("error"),
            )

    async def delete_item(self, item_id: str) -> bool:
        headers = await self._headers()
        async with httpx.AsyncClient() as client:
            resp = await client.delete(f"{self.base_url}/items/{item_id}", headers=headers, timeout=15.0)
            return resp.status_code in (200, 204)

    async def list_accounts(self, item_id: Optional[str] = None) -> List[Account]:
        headers = await self._headers()
        params = {}
        if item_id:
            params["itemId"] = item_id

        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/accounts", headers=headers, params=params, timeout=15.0)
            resp.raise_for_status()
            data = resp.json()
            raw_accs = data.get("results", [])

            items_map = {item.id: item for item in await self.list_items()}

            accounts = []
            for acc in raw_accs:
                item_obj = items_map.get(acc.get("itemId"))
                bank_name = item_obj.connectorName if item_obj else "Banco Conectado"
                bank_color = item_obj.connectorColor if item_obj else "#2563EB"
                bank_logo = item_obj.connectorLogo if item_obj else None

                accounts.append(
                    Account(
                        id=acc["id"],
                        itemId=acc["itemId"],
                        type=acc.get("type", "BANK"),
                        subtype=acc.get("subtype", "CHECKING_ACCOUNT"),
                        name=acc.get("name", "Conta Bancária"),
                        balance=float(acc.get("balance", 0.0)),
                        currencyCode=acc.get("currencyCode", "BRL"),
                        number=acc.get("number"),
                        creditLimit=acc.get("creditData", {}).get("creditLimit"),
                        availableCreditLimit=acc.get("creditData", {}).get("availableCreditLimit"),
                        bankName=bank_name,
                        bankColor=bank_color,
                        bankLogo=bank_logo,
                    )
                )
            return accounts

    async def list_transactions(
        self,
        account_id: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[Transaction]:
        headers = await self._headers()
        params: Dict[str, Any] = {"pageSize": 100}
        if account_id:
            params["accountId"] = account_id
        if start_date:
            params["from"] = start_date
        if end_date:
            params["to"] = end_date

        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/transactions", headers=headers, params=params, timeout=15.0)
            resp.raise_for_status()
            data = resp.json()
            raw_txs = data.get("results", [])

            # Accounts map for metadata
            accounts_map = {acc.id: acc for acc in await self.list_accounts()}

            transactions = []
            for tx in raw_txs:
                acc_obj = accounts_map.get(tx.get("accountId"))
                bank_name = acc_obj.bankName if acc_obj else None
                bank_color = acc_obj.bankColor if acc_obj else None

                amount = float(tx.get("amount", 0.0))
                tx_type = tx.get("type", "DEBIT" if amount < 0 else "CREDIT")

                transactions.append(
                    Transaction(
                        id=tx["id"],
                        accountId=tx["accountId"],
                        description=tx.get("description", "Transação"),
                        amount=amount,
                        date=tx.get("date", ""),
                        category=tx.get("category", "Geral"),
                        type=tx_type,
                        status=tx.get("status", "POSTED"),
                        bankName=bank_name,
                        bankColor=bank_color,
                    )
                )

            if category:
                transactions = [t for t in transactions if category.lower() in t.category.lower()]
            if search:
                query = search.lower()
                transactions = [
                    t for t in transactions
                    if query in t.description.lower() or query in t.category.lower()
                ]

            return transactions

    async def get_financial_summary(self) -> FinancialSummary:
        accounts = await self.list_accounts()
        items = await self.list_items()
        transactions = await self.list_transactions()

        checking_balance = sum(
            acc.balance for acc in accounts if acc.subtype in ("CHECKING_ACCOUNT", "SAVINGS_ACCOUNT")
        )
        credit_debt = abs(
            sum(acc.balance for acc in accounts if acc.type == "CREDIT" and acc.balance < 0)
        )
        investments = sum(
            acc.balance for acc in accounts if acc.type == "INVESTMENT"
        )
        net_worth = checking_balance + investments - credit_debt

        monthly_income = sum(
            tx.amount for tx in transactions if tx.type == "CREDIT"
        )
        monthly_expenses = abs(
            sum(tx.amount for tx in transactions if tx.type == "DEBIT")
        )

        return FinancialSummary(
            total_balance=round(checking_balance, 2),
            total_credit_debt=round(credit_debt, 2),
            total_investments=round(investments, 2),
            net_worth=round(net_worth, 2),
            monthly_income=round(monthly_income, 2),
            monthly_expenses=round(monthly_expenses, 2),
            accounts_count=len(accounts),
            banks_connected=len(items),
        )

    async def connect_mock_institution(self, connector_id: int) -> Item:
        raise NotImplementedError("RealPluggyService uses the Pluggy Connect Widget to connect institutions.")
