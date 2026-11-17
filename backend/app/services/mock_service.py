import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from app.models.schemas import Connector, Item, Account, Transaction, FinancialSummary
from app.services.pluggy_base import BasePluggyService


class MockPluggyService(BasePluggyService):
    def __init__(self):
        self._init_data()

    def _init_data(self):
        # Supported Brazilian Open Finance Connectors
        self.connectors: List[Connector] = [
            Connector(
                id=201,
                name="Nubank",
                primaryColor="#820AD1",
                institutionUrl="https://nubank.com.br",
                imageUrl="https://assets.pluggy.ai/connectors/logos/201.svg",
                type="PERSONAL_BANK",
            ),
            Connector(
                id=200,
                name="Banco Inter",
                primaryColor="#FF7A00",
                institutionUrl="https://bancointer.com.br",
                imageUrl="https://assets.pluggy.ai/connectors/logos/200.svg",
                type="PERSONAL_BANK",
            ),
            Connector(
                id=2,
                name="Itaú Unibanco",
                primaryColor="#EC7000",
                institutionUrl="https://itau.com.br",
                imageUrl="https://assets.pluggy.ai/connectors/logos/2.svg",
                type="PERSONAL_BANK",
            ),
            Connector(
                id=1,
                name="Banco Bradesco",
                primaryColor="#CC092F",
                institutionUrl="https://bradesco.com.br",
                imageUrl="https://assets.pluggy.ai/connectors/logos/1.svg",
                type="PERSONAL_BANK",
            ),
            Connector(
                id=202,
                name="BTG Pactual",
                primaryColor="#001E62",
                institutionUrl="https://btgpactual.com",
                imageUrl="https://assets.pluggy.ai/connectors/logos/202.svg",
                type="INVESTMENT",
            ),
            Connector(
                id=3,
                name="Banco do Brasil",
                primaryColor="#FFF100",
                institutionUrl="https://bb.com.br",
                imageUrl="https://assets.pluggy.ai/connectors/logos/3.svg",
                type="PERSONAL_BANK",
            ),
        ]

        # Initial Connected Items (Nubank & Inter)
        self.items: Dict[str, Item] = {
            "item-nubank-001": Item(
                id="item-nubank-001",
                connectorId=201,
                connectorName="Nubank",
                connectorColor="#820AD1",
                connectorLogo="https://assets.pluggy.ai/connectors/logos/201.svg",
                status="UPDATED",
                createdAt=(datetime.now() - timedelta(days=45)).isoformat(),
                updatedAt=datetime.now().isoformat(),
            ),
            "item-inter-002": Item(
                id="item-inter-002",
                connectorId=200,
                connectorName="Banco Inter",
                connectorColor="#FF7A00",
                connectorLogo="https://assets.pluggy.ai/connectors/logos/200.svg",
                status="UPDATED",
                createdAt=(datetime.now() - timedelta(days=20)).isoformat(),
                updatedAt=datetime.now().isoformat(),
            ),
        }

        # Initial Accounts
        self.accounts: Dict[str, Account] = {
            "acc-nu-checking": Account(
                id="acc-nu-checking",
                itemId="item-nubank-001",
                type="BANK",
                subtype="CHECKING_ACCOUNT",
                name="NuConta Corrente",
                balance=4280.50,
                currencyCode="BRL",
                number="0001 / 928371-2",
                bankName="Nubank",
                bankColor="#820AD1",
                bankLogo="https://assets.pluggy.ai/connectors/logos/201.svg",
            ),
            "acc-nu-credit": Account(
                id="acc-nu-credit",
                itemId="item-nubank-001",
                type="CREDIT",
                subtype="CREDIT_CARD",
                name="Cartão Nubank Ultravioleta",
                balance=-1640.00,
                currencyCode="BRL",
                number="•••• 4819",
                creditLimit=12000.00,
                availableCreditLimit=10360.00,
                bankName="Nubank",
                bankColor="#820AD1",
                bankLogo="https://assets.pluggy.ai/connectors/logos/201.svg",
            ),
            "acc-inter-checking": Account(
                id="acc-inter-checking",
                itemId="item-inter-002",
                type="BANK",
                subtype="CHECKING_ACCOUNT",
                name="Conta Digital Inter",
                balance=8920.00,
                currencyCode="BRL",
                number="0001 / 582103-9",
                bankName="Banco Inter",
                bankColor="#FF7A00",
                bankLogo="https://assets.pluggy.ai/connectors/logos/200.svg",
            ),
            "acc-inter-invest": Account(
                id="acc-inter-invest",
                itemId="item-inter-002",
                type="INVESTMENT",
                subtype="INVESTMENT",
                name="Inter Carteira Global & CDBs",
                balance=25400.00,
                currencyCode="BRL",
                number="INV-88219",
                bankName="Banco Inter",
                bankColor="#FF7A00",
                bankLogo="https://assets.pluggy.ai/connectors/logos/200.svg",
            ),
        }

        now = datetime.now()
        def days_ago(d: int, hours: int = 10) -> str:
            return (now - timedelta(days=d, hours=hours)).strftime("%Y-%m-%d %H:%M")

        # Initial Transactions
        self.transactions: List[Transaction] = [
            Transaction(
                id="tx-001",
                accountId="acc-nu-checking",
                description="Pix Recebido - Salário DIO Innovation",
                amount=7500.00,
                date=days_ago(3, 9),
                category="Salário & Renda",
                type="CREDIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-002",
                accountId="acc-nu-checking",
                description="Pix Enviado - Aluguel Imobiliária",
                amount=-2200.00,
                date=days_ago(4, 14),
                category="Moradia",
                type="DEBIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-003",
                accountId="acc-nu-credit",
                description="Supermercado Pão de Açúcar",
                amount=-432.80,
                date=days_ago(2, 18),
                category="Alimentação & Mercado",
                type="DEBIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-004",
                accountId="acc-nu-credit",
                description="iFood Delivery Gourmet",
                amount=-84.50,
                date=days_ago(1, 20),
                category="Alimentação & Mercado",
                type="DEBIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-005",
                accountId="acc-nu-credit",
                description="Uber Viagem Centro",
                amount=-38.90,
                date=days_ago(1, 15),
                category="Transporte",
                type="DEBIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-006",
                accountId="acc-nu-credit",
                description="Netflix Assinatura Mensal",
                amount=-55.90,
                date=days_ago(5, 8),
                category="Serviços & Assinaturas",
                type="DEBIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-007",
                accountId="acc-nu-credit",
                description="Smart Fit - Plano Black",
                amount=-139.90,
                date=days_ago(6, 7),
                category="Saúde & Bem-estar",
                type="DEBIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-008",
                accountId="acc-inter-checking",
                description="Rendimento Automático CDB Liquidez Diária",
                amount=234.50,
                date=days_ago(2, 23),
                category="Investimentos",
                type="CREDIT",
                bankName="Banco Inter",
                bankColor="#FF7A00",
            ),
            Transaction(
                id="tx-009",
                accountId="acc-inter-checking",
                description="Farmácia Raia Cosméticos e Saúde",
                amount=-96.40,
                date=days_ago(3, 16),
                category="Saúde & Bem-estar",
                type="DEBIT",
                bankName="Banco Inter",
                bankColor="#FF7A00",
            ),
            Transaction(
                id="tx-010",
                accountId="acc-inter-checking",
                description="Posto Ipiranga Gasolina Aditivada",
                amount=-210.00,
                date=days_ago(5, 11),
                category="Transporte",
                type="DEBIT",
                bankName="Banco Inter",
                bankColor="#FF7A00",
            ),
            Transaction(
                id="tx-011",
                accountId="acc-nu-credit",
                description="Mercado Livre - Fone de Ouvido",
                amount=-189.00,
                date=days_ago(7, 13),
                category="Compras & Lazer",
                type="DEBIT",
                bankName="Nubank",
                bankColor="#820AD1",
            ),
            Transaction(
                id="tx-012",
                accountId="acc-inter-checking",
                description="Spotify Premium Family",
                amount=-34.90,
                date=days_ago(8, 6),
                category="Serviços & Assinaturas",
                type="DEBIT",
                bankName="Banco Inter",
                bankColor="#FF7A00",
            ),
        ]

    async def get_connectors(self) -> List[Connector]:
        return self.connectors

    async def create_connect_token(self, client_user_id: Optional[str] = None) -> Dict[str, Any]:
        return {
            "accessToken": f"mock_token_{uuid.uuid4().hex[:12]}",
            "isMock": True,
        }

    async def list_items(self) -> List[Item]:
        return list(self.items.values())

    async def get_item(self, item_id: str) -> Optional[Item]:
        return self.items.get(item_id)

    async def delete_item(self, item_id: str) -> bool:
        if item_id in self.items:
            del self.items[item_id]
            # Remove associated accounts
            account_ids_to_remove = [
                acc_id for acc_id, acc in self.accounts.items() if acc.itemId == item_id
            ]
            for acc_id in account_ids_to_remove:
                del self.accounts[acc_id]
                # Remove transactions
                self.transactions = [
                    tx for tx in self.transactions if tx.accountId != acc_id
                ]
            return True
        return False

    async def list_accounts(self, item_id: Optional[str] = None) -> List[Account]:
        if item_id:
            return [acc for acc in self.accounts.values() if acc.itemId == item_id]
        return list(self.accounts.values())

    async def list_transactions(
        self,
        account_id: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[Transaction]:
        results = self.transactions

        if account_id:
            results = [tx for tx in results if tx.accountId == account_id]
        if category:
            results = [tx for tx in results if category.lower() in tx.category.lower()]
        if search:
            query = search.lower()
            results = [
                tx for tx in results
                if query in tx.description.lower() or query in tx.category.lower()
            ]
        return results

    async def get_financial_summary(self) -> FinancialSummary:
        accounts = list(self.accounts.values())
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
            tx.amount for tx in self.transactions if tx.type == "CREDIT"
        )
        monthly_expenses = abs(
            sum(tx.amount for tx in self.transactions if tx.type == "DEBIT")
        )

        return FinancialSummary(
            total_balance=round(checking_balance, 2),
            total_credit_debt=round(credit_debt, 2),
            total_investments=round(investments, 2),
            net_worth=round(net_worth, 2),
            monthly_income=round(monthly_income, 2),
            monthly_expenses=round(monthly_expenses, 2),
            accounts_count=len(accounts),
            banks_connected=len(self.items),
        )

    async def connect_mock_institution(self, connector_id: int) -> Item:
        connector = next((c for c in self.connectors if c.id == connector_id), None)
        if not connector:
            raise ValueError(f"Conector com ID {connector_id} não encontrado.")

        # Check if already connected
        existing = next((i for i in self.items.values() if i.connectorId == connector_id), None)
        if existing:
            return existing

        item_id = f"item-{connector.name.lower().replace(' ', '')}-{uuid.uuid4().hex[:6]}"
        now = datetime.now()

        new_item = Item(
            id=item_id,
            connectorId=connector.id,
            connectorName=connector.name,
            connectorColor=connector.primaryColor,
            connectorLogo=connector.imageUrl,
            status="UPDATED",
            createdAt=now.isoformat(),
            updatedAt=now.isoformat(),
        )
        self.items[item_id] = new_item

        # Generate accounts and sample transactions based on institution
        acc_checking_id = f"acc-{item_id}-checking"
        self.accounts[acc_checking_id] = Account(
            id=acc_checking_id,
            itemId=item_id,
            type="BANK",
            subtype="CHECKING_ACCOUNT",
            name=f"Conta Corrente {connector.name}",
            balance=3150.75,
            currencyCode="BRL",
            number="3401 / 88129-4",
            bankName=connector.name,
            bankColor=connector.primaryColor,
            bankLogo=connector.imageUrl,
        )

        acc_credit_id = f"acc-{item_id}-credit"
        self.accounts[acc_credit_id] = Account(
            id=acc_credit_id,
            itemId=item_id,
            type="CREDIT",
            subtype="CREDIT_CARD",
            name=f"Cartão {connector.name} Platinum",
            balance=-780.40,
            currencyCode="BRL",
            number="•••• 7731",
            creditLimit=8000.00,
            availableCreditLimit=7219.60,
            bankName=connector.name,
            bankColor=connector.primaryColor,
            bankLogo=connector.imageUrl,
        )

        # Sample transactions for the new connection
        self.transactions.extend([
            Transaction(
                id=f"tx-{uuid.uuid4().hex[:6]}",
                accountId=acc_checking_id,
                description=f"Depósito / Transferência {connector.name}",
                amount=1200.00,
                date=(now - timedelta(days=2)).strftime("%Y-%m-%d %H:%M"),
                category="Transferência",
                type="CREDIT",
                bankName=connector.name,
                bankColor=connector.primaryColor,
            ),
            Transaction(
                id=f"tx-{uuid.uuid4().hex[:6]}",
                accountId=acc_credit_id,
                description="Restaurante Outback Steakhouse",
                amount=-195.40,
                date=(now - timedelta(days=1)).strftime("%Y-%m-%d %H:%M"),
                category="Alimentação & Mercado",
                type="DEBIT",
                bankName=connector.name,
                bankColor=connector.primaryColor,
            ),
            Transaction(
                id=f"tx-{uuid.uuid4().hex[:6]}",
                accountId=acc_credit_id,
                description="Livraria Cultura Online",
                amount=-85.00,
                date=now.strftime("%Y-%m-%d %H:%M"),
                category="Educação & Cultura",
                type="DEBIT",
                bankName=connector.name,
                bankColor=connector.primaryColor,
            ),
        ])

        return new_item
