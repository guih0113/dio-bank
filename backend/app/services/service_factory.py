from app.core.config import settings
from app.services.pluggy_base import BasePluggyService
from app.services.mock_service import MockPluggyService
from app.services.pluggy_service import RealPluggyService

_mock_instance: MockPluggyService = MockPluggyService()
_real_instance: RealPluggyService = RealPluggyService()


def get_pluggy_service() -> BasePluggyService:
    """
    Returns the appropriate Open Finance service based on configuration.
    If PLUGGY_MOCK_MODE is True or credentials are empty, returns the Mock service.
    Otherwise returns the Real Pluggy API service.
    """
    if settings.is_mock_mode:
        return _mock_instance
    return _real_instance
