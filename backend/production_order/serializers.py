from rest_framework import serializers
from .models import ProductionOrder
from production_plan.serializers import ProductionPlanSerializer


class ProductionOrderSerializer(serializers.ModelSerializer):
    plans = ProductionPlanSerializer(source="orders", many=True, read_only=True)

    class Meta:
        model = ProductionOrder
        fields = [
            'id', 'created', 'updated', 
            'quantity_meta', 'quantity_planned', 'quantity_completed',
            'start_date', 'end_date', 'status', 'plans', 'order_code'
        ]

class QuantityPlannedSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductionOrder
        fields =['id','quantity_planned']
