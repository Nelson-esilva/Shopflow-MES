from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import LineStation
from .serializers import LineStationSerializer
from rest_framework.permissions import IsAuthenticated

class LineStationViewSet(ModelViewSet):
    queryset = LineStation.objects.all()
    serializer_class = LineStationSerializer
    permission_classes = [IsAuthenticated]