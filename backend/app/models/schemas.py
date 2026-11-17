from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class Connector(BaseModel):
    id: int
    name: str
    primaryColor: str
    institutionUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    type: str = "PERSONAL_BANK"
    country: str = "BR"


class Item(BaseModel):
    id: str
    connectorId: int
    connectorName: str
    connectorColor: str
    connectorLogo: Optional[str] = None
    status: str = "UPDATED"
    createdAt: str
    updatedAt: str
    error: Optional[str] = None


class Account(BaseModel):
    id: str
    itemId: str
    type: str  # "BANK", "CREDIT", "INVESTMENT"
    subtype: str  # "CHECKING_ACCOUNT", "SAVINGS_ACCOUNT", "CREDIT_CARD", "INVESTMENT"
    name: str
    balance: float
    currencyCode: str = "BRL"
    number: Optional[str] = None
    creditLimit: Optional[float] = None
    availableCreditLimit: Optional[float] = None
    bankName: str
    bankColor: str
    bankLogo: Optional[str] = None


class Transaction(BaseModel):
    id: str
    accountId: str
    description: str
    amount: float
    date: str
    category: str
    type: str  # "DEBIT", "CREDIT"
    status: str = "POSTED"
    bankName: Optional[str] = None
    bankColor: Optional[str] = None


class FinancialSummary(BaseModel):
    total_balance: float
    total_credit_debt: float
    total_investments: float
    net_worth: float
    monthly_income: float
    monthly_expenses: float
    accounts_count: int
    banks_connected: int


class ConnectTokenResponse(BaseModel):
    accessToken: str
    isMock: bool


class ConnectMockRequest(BaseModel):
    connectorId: int


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = Field(default_factory=list)


class AIChatResponse(BaseModel):
    reply: str
    tools_used: List[str] = Field(default_factory=list)
    data: Optional[Dict[str, Any]] = None
