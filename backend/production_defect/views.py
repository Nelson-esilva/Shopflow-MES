from rest_framework import viewsets
from .models import ProductionDefect
from .serializers import ProductionDefectSerializer

class ProductionDefectViewSet(viewsets.ModelViewSet):
    queryset = ProductionDefect.objects.all()
    serializer_class = ProductionDefectSerializer
