import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):

    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    model = django_filters.CharFilter(field_name='model', lookup_expr='icontains')
    code = django_filters.CharFilter(field_name='code', lookup_expr='icontains')
    product_type = django_filters.BaseInFilter(field_name='product_type', lookup_expr='in')

    class Meta:
        model = Product
        fields = '__all__'