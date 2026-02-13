from rest_framework import serializers
from .models import ProductionDefect

class ProductionDefectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionDefect
        fields = ['id', 'created', 'updated', 'name', 'description', 'cause_solution', 'discard']
