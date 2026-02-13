import django_filters
from .models import ProductionLine


class ProductionLineFilter(django_filters.FilterSet):

    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    status = django_filters.BaseInFilter(field_name='status', lookup_expr='in')

    class Meta:
        model = ProductionLine
        fields = '__all__'