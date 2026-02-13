from functools import wraps
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied

def permission_required(permission ):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                if request.content_type == 'application/json':
                    return JsonResponse({'error': 'Authentication required'}, status=401)
                raise PermissionDenied("Login necessário")
            
            if not request.user.has_permission(permission):
                if request.content_type == 'application/json':
                    return JsonResponse({'error': 'Permission denied'}, status=403)
                raise PermissionDenied("Você não tem permissão para acessar esta página")
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            if request.content_type == 'application/json':
                return JsonResponse({'error': 'Authentication required'}, status=401)
            raise PermissionDenied("Login necessário")
        
        if request.user.role != 'administrator':
            if request.content_type == 'application/json':
                return JsonResponse({'error': 'Admin access required'}, status=403)
            raise PermissionDenied("Acesso restrito a administradores")
        
        return view_func(request, *args, **kwargs)
    return wrapper
