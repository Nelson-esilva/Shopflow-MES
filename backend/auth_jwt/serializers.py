from rest_framework import serializers
from django.contrib.auth import authenticate


class AuthLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        user = authenticate(self.context["request"].method, email=email, password=password)
        if not user:
            raise serializers.ValidationError("Incorrect Credentials")
        if not user.is_active:
            raise serializers.ValidationError("User is not active")
        return user
