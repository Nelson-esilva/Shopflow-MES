from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from .models import ProductionOrder
from .serializers import ProductionOrderSerializer
from .filters import ProductionOrderFilter
from .pagination import StandardResultsSetPagination


class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer
    pagination_class = StandardResultsSetPagination

    # Filters and ordering
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filterset_class = ProductionOrderFilter
    search_fields = ['order_code']
    ordering_fields = '__all__'
    ordering = ['id']  # Default ordering