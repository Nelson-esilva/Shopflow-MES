from rest_framework import serializers
from .models import User
from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'job_title']
        depth = 1


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "name", "username", "role", "cpf", "phone", "address", "job_title"]
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["name", "username", "cpf", "email","phone", "address", "job_title"]

class UserRoleSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'email', 'cpf', 'role', 'phone', 'address', 'role_display', 'permissions', 'is_active','last_access']
        read_only_fields = ['id', 'permissions']
    
    def get_permissions(self, obj):
        return obj.get_permissions()
    
    def get_last_access_formatted(self, obj):
        if obj.last_access:
            return obj.last_access.strftime("%d/%m/%Y %H:%M:%S")
        return "Sem acesso anterior."
    
class UserRoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role']
    
    def validate_role(self, value):
        valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if value not in valid_roles:
            raise serializers.ValidationError("Cargo inválido")
        return value
    
class AdminPasswordChangeSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=6, max_length=68, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'created', 'username', 'email')
        
class UserRegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            "password": {"write_only": True},
            'email': {
                'validators': [
                    UniqueValidator(
                        queryset=User.objects.all(),
                            message = ("Email is already in use")
                        )
                    ]
                }
            }

    def create(self, validated_data):
        validated_data.setdefault("role", "operator") 
        return User.objects.create_user(**validated_data)

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=6, max_length=68, write_only=True)
    confirm_new_password = serializers.CharField(required=True, min_length=6, max_length=68, write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError({"new_password": "As novas senhas não coincidem."})
        return data

