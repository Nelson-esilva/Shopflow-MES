from rest_framework import serializers
from .models import ProductionPlan

class ProductionPlanSerializer(serializers.ModelSerializer):
    production_day = serializers.DateField(format="%d/%m/%Y", input_formats=["%Y-%m-%d", "%d/%m/%Y"], required=True)

    class Meta:
        model = ProductionPlan
        fields = '__all__'
        read_only_fields = ['id', 'created', 'updated']