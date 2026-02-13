from rest_framework import serializers
from .models import LineStation
from production_lines.models import ProductionLine

class LineStationSerializer(serializers.ModelSerializer):
    production_line = serializers.PrimaryKeyRelatedField(queryset=ProductionLine.objects.all())
    
    class Meta:
        model = LineStation
        fields = ['id', 'name', 'description', 'current_status', 'num_employees', 'production_line']


