from rest_framework import serializers
from .models import ProductionLine, ProductionLineCapacity
from line_stations.serializers import LineStationSerializer
from production_order.serializers import ProductionOrderSerializer
from production_plan.serializers import ProductionPlanSerializer

class ProductionLineSerializer(serializers.ModelSerializer):
    stations = LineStationSerializer(many=True, read_only=True)
    production_plans = ProductionOrderSerializer(source='production_line_orders', many=True, read_only=True)
    stations_count = serializers.IntegerField(source='station_count_db', read_only=True)

    class Meta:
        model = ProductionLine
        fields = ['id', 'name', 'location', 'stations_count', 'stations', 'production_plans', 'status']

class ProductionLineCapacitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionLineCapacity
        fields = '__all__'
        read_only_fields = ['id']