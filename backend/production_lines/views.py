from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import ProductionLine, ProductionLineCapacity
from .serializers import ProductionLineSerializer, ProductionLineCapacitySerializer
from .pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import viewsets, filters
from .models import ProductionLine, ProductionLineCapacity
from .serializers import ProductionLineSerializer, ProductionLineCapacitySerializer
from .filters import ProductionLineFilter


class ProductionLineViewSet(ModelViewSet):
    serializer_class = ProductionLineSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    # Filters and ordering
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filterset_class = ProductionLineFilter
    search_fields = ['name', 'location']
    ordering_fields = '__all__'
    ordering = ['id']  # Default ordering

    def get_queryset(self):
        return ProductionLine.objects.annotate(
            station_count_db=Count('stations')
        ).prefetch_related('stations', 'plans')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_queryset().get(id=kwargs['pk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class ProductionLineCapacityViewSet(ModelViewSet):
    queryset = ProductionLineCapacity.objects.all()
    serializer_class = ProductionLineCapacitySerializer
    permission_classes = [IsAuthenticated]


    
    
