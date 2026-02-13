from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from clickhouse_utils import Utils
from production_order.serializers import QuantityPlannedSerializer
from production_order.models import ProductionOrder
from django.shortcuts import get_object_or_404

def getTable(data, id):
    client = Utils.init_clickhouse_connection()

    table = Utils.get_table(data, id, client)   
    
    Utils.close_clickhouse_conncection(client)

    return table

def dataToJson(table, quantity_planned = 0):

    json = Utils.data_to_json(table, quantity_planned)

    return json 

class WorkstationRelativoView(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all()
    serializer_class = QuantityPlannedSerializer
    permission_classes = (IsAuthenticated,)
    
    
    def retrieve(self, request, pk=None):

        order = get_object_or_404(ProductionOrder, id=pk)

        table = getTable(request.data, id=pk)

        response_data = dataToJson(table, order.quantity_planned)

        return Response(response_data, status=status.HTTP_200_OK)
    
    def list(self, request):
        
        table = getTable(request.data, id=None)

        response_data = dataToJson(table)

        return Response(response_data, status=status.HTTP_200_OK)
    
    def create(self, request):
        return Response("NOT ALLOWED", status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        return Response("NOT ALLOWED", status=status.HTTP_400_BAD_REQUEST)

    

