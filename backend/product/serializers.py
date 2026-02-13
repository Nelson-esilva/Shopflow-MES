from rest_framework import serializers
from .models import Product
from production_order.serializers import ProductionOrderSerializer


class ProductSerializer(serializers.ModelSerializer):

    #product_orders = ProductionOrderSerializer(source='orders',many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'created', 'updated', 
            'name', 'model', 
            'code', 'product_type'
        ]
