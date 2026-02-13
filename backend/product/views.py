from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from .models import Product
from .serializers import ProductSerializer
from .filters import ProductFilter
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from .pagination import StandardResultsSetPagination


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = StandardResultsSetPagination
    
    # Filters and ordering
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filterset_class = ProductFilter
    search_fields = ['name', 'model', 'code']
    ordering_fields = '__all__'
    ordering = ['id']  # Default ordering
