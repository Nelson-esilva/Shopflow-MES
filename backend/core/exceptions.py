from rest_framework.exceptions import APIException
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler
from django.utils.translation import gettext_lazy as _

class BaseAPIException(APIException):
    """
    Classe base para todas as exceções da API
    Padroniza erros com mensagens detalhadas para o usuário
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('Ocorreu um erro inesperado. Por favor, tente novamente.')
    default_code = 'api_error'

    def __init__(self, detail=None, code=None, extra_data=None):
        """
        Args:
            detail: Mensagem amigável para o usuário final
            code: Código de erro específico (opcional)
            extra_data: Dados adicionais para ajudar no debug (opcional)
        """
        self.extra_data = extra_data or {}
        super().__init__(detail=detail, code=code)

# ==================== ERROS COMUNS DA API ==================== 

class ValidationError(BaseAPIException):
    """Erros de validação de dados"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('Dados inválidos fornecidos. Verifique os campos.')
    default_code = 'validation_error'

class AuthenticationFailed(BaseAPIException):
    """Credenciais inválidas"""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = _('Credenciais inválidas. Verifique seu email e senha.')
    default_code = 'auth_failed'

class NotAuthenticated(BaseAPIException):
    """Usuário não autenticado"""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = _('Autenticação necessária. Faça login para acessar este recurso.')
    default_code = 'not_authenticated'

class PermissionDenied(BaseAPIException):
    """Acesso negado"""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = _('Você não tem permissão para executar esta ação.')
    default_code = 'permission_denied'

class NotFound(BaseAPIException):
    """Recurso não encontrado"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _('O recurso solicitado não foi encontrado.')
    default_code = 'not_found'

class MethodNotAllowed(BaseAPIException):
    """Método HTTP não permitido"""
    status_code = status.HTTP_405_METHOD_NOT_ALLOWED
    default_detail = _('Método HTTP não permitido para este endpoint.')
    default_code = 'method_not_allowed'

class Throttled(BaseAPIException):
    """Limite de requisições excedido"""
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = _('Limite de requisições excedido. Tente novamente mais tarde.')
    default_code = 'throttled'

class ServerError(BaseAPIException):
    """Erro interno do servidor"""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = _('Erro interno no servidor. Nossa equipe já foi notificada.')
    default_code = 'server_error'

# ==================== HANDLER GLOBAL ====================

def custom_exception_handler(exc, context):
    """
    Handler global que padroniza todas as respostas de erro da API
    """
    # Primeiro, usa o handler padrão do DRF
    response = exception_handler(exc, context)

    if response is None:
        # Trata erros não capturados pelo DRF
        if isinstance(exc, BaseAPIException):
            response = Response(
                {
                    'error': {
                        'code': exc.status_code,
                        'type': exc.default_code,
                        'message': str(exc.detail),
                        'details': exc.extra_data
                    }
                },
                status=exc.status_code
            )
        else:
            # Erro inesperado
            response = Response(
                {
                    'error': {
                        'code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                        'type': 'unexpected_error',
                        'message': 'Ocorreu um erro inesperado. Por favor, contate o suporte.',
                        'details': str(exc) if str(exc) else None
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return response