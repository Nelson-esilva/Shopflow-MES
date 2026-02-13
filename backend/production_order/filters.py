import django_filters
from .models import ProductionOrder


class ProductionOrderFilter(django_filters.FilterSet):

    order_code = django_filters.CharFilter(field_name='order_code', lookup_expr='icontains')
    status = django_filters.BaseInFilter(field_name='status', lookup_expr='in')

    class Meta:
        model = ProductionOrder
        fields = '__all__'