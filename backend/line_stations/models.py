from django.db import models
from production_lines.models import ProductionLine

class LineStation(models.Model):

    production_line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, related_name='stations', null=False, blank=False)
    name = models.CharField(max_length=255)
    description = models.JSONField()
    current_status = models.BooleanField(default=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    num_employees = models.IntegerField()

    class Meta:
        ordering = ['name']
        
    def __str__(self):
        return f"{self.name} ({Linha: self.production_line.name})"