from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
from user.models import User

class AuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

class AuthLoginSerializer(serializers.Serializer):    
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):      
        email = data.get('email')
        password = data.get('password')        


        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")
        
        user = authenticate(self.context['request'].method, email=email, password=password)
        
        if not user:
            raise serializers.ValidationError("Incorrect Credentials")
            
        if not user.is_active:
            raise serializers.ValidationError("User is not active") 
        return user

class ProfileSerializer(AuthSerializer):    
    class Meta:
        model = User
        fields = ('username', 'email', 'id')