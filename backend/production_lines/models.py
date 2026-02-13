from django.db import models
from product.models import Product
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import transaction

class ProductionLine(models.Model):

    STATUS_CHOICES = (
        ('inactive', 'Parada'),
        ('active', 'Operacional'),
        ('maintenance', 'Manutenção'),
    )
    
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    qtd_stations = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.name} - {self.location}"

    def is_operational(self):
        return self.status == 'active'
    
    def cascade_status_to_plans(self, old_status, new_status):
 
        from production_plan.models import ProductionPlan 

        if new_status in ['inactive', 'maintenance']:
            # Pausar planos em progresso quando a linha fica inativa ou em manutenção
            plans_to_pause = self.production_plans.filter(status='in_progress')
            for plan in plans_to_pause:
                try:
                    with transaction.atomic():
                        plan.pause(from_order=True)
                except Exception as e:
                    print(f"Erro ao pausar plano {plan.id} devido à mudança de status da linha: {e}")
        elif old_status in ['inactive', 'maintenance'] and new_status == 'active':
            pass
    
class ProductionLineCapacity(models.Model):
    """
    Esta é a base para a regra RN-PP-004 / RN-PP-015.
    """
    production_line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, related_name='capacities')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='line_capacities')
    date = models.DateField()
    capacity = models.IntegerField()

    class Meta:
        unique_together = ('production_line', 'product', 'date')
        verbose_name = "Capacidade da Linha de Produção"
        verbose_name_plural = "Capacidades das Linhas de Produção"

    def __str__(self):
        return f"Capacidade de {self.capacity} para {self.product.name} na linha {self.production_line.name} em {self.date}"
    
# Sinal para propagar mudanças de status da ProductionLine para os ProductionPlans associados
@receiver(pre_save, sender=ProductionLine)
def handle_production_line_status_change(sender, instance, **kwargs):
    
    #Se a linha mudar para 'inactive' ou 'maintenance', os planos em progresso são pausados.
    if instance.pk:
        original_instance = sender.objects.get(pk=instance.pk)
        if original_instance.status != instance.status:
            instance.cascade_status_to_plans(original_instance.status, instance.status)