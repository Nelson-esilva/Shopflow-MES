from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'administrator')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):    

    ROLE_CHOICES = (
        ('administrator', 'Administrator'),
        ('manager', 'Manager'),
        ('operator', 'Operator'),
    )
    
    STATUS_CHOICES = (
        ('pending_registration', 'Pending'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    )

    ROLE_PERMISSIONS = {
        'administrator': [
            'users.create', 'users.read', 'users.update', 'users.delete',
            'reports.read', 'reports.export',
            'settings.read', 'settings.update',
            'roles.manage'  # Pode alterar cargos de outros usuários
        ],
        'manager': [
            'users.read', 'users.update',  # Pode ver e editar usuários, mas não criar/deletar
            'reports.read', 'reports.export',
            'settings.read'
        ],
        'operator': [
            'users.read',  # Apenas visualizar usuários
            'reports.read'  # Apenas visualizar relatórios
        ]
    }


    # Permissions and status
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    is_active = models.BooleanField(default=True)     # Necessário para autenticação
    is_staff = models.BooleanField(default=False)     # Necessário para admin
    is_superuser = models.BooleanField(default=False) # Necessário para admin completo

    # Custom user fields
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    cpf = models.CharField(max_length=14, unique=False, blank=True)  # CPF é opcional
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    job_title = models.CharField(max_length=100)
    last_access = models.DateTimeField(null=True, blank=True)  # Data do último acesso
    deleted_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()
    
    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"


    # Permissions methods
    #////////////////////

    def has_permission(self, permission):
        if self.is_superuser:
            return True
        role_permissions = self.ROLE_PERMISSIONS.get(self.role, [])
        return permission in role_permissions
    
    def get_permissions(self):
        if self.is_superuser:
            all_permissions = set()
            for perms in self.ROLE_PERMISSIONS.values():
                all_permissions.update(perms)
            return list(all_permissions)
        
        return self.ROLE_PERMISSIONS.get(self.role, [])
    
    def can_manage_users(self):
        return self.has_permission('users.create') or self.has_permission('users.update')
    
    def can_change_user_role(self):
        return self.has_permission('roles.manage')
    
    def can_export_reports(self):
        return self.has_permission('reports.export')