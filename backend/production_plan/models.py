from django.db import models
from product.models import Product
from production_order.models import ProductionOrder
from production_lines.models import ProductionLine
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone


class ProductionPlan(models.Model):

    STATUS_CHOICES = [
        ('planned', 'Planejado'),
        ('in_progress', 'Em Progresso'),
        ('completed', 'Concluído'),
        ('paused', 'Pausado'),
        ('canceled', 'Cancelado')
    ]

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    plan_code = models.CharField(max_length=255, unique=True)
    production_day = models.DateField(unique=False)
    shifts = models.JSONField(blank=True, null=True)
    total_quantity = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    previous_status = models.CharField(max_length=20, choices=STATUS_CHOICES, null=True, blank=True)

    # Foreign Keys
    product_order = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE, related_name='orders', null=False, blank=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='products', null=False, blank=False)
    production_line = models.ForeignKey(ProductionLine,on_delete=models.CASCADE,related_name='plans',null=False, blank=False)

    class Meta:
        verbose_name = "Production Plan"
        verbose_name_plural = "Production Plans"
    
    def __str__(self):
        return f"Plan for Order {self.production_order.name} on Line {self.production_line.name} ({self.production_day.strftime('%Y-%m-%d')})"
    
    
    def clean(self):

        #RN-PP-013: Não negatividade e positividade
        if self.total_quantity <= 0:
            raise ValueError("Total quantity must be greater than zero.")
        
        # RN-PP-011: Período da Ordem (production_day)
        if self.product_order.start_date and self.production_day < self.product_order.start_date:
            raise ValidationError({'production_day': "A data do plano não pode ser anterior à data de início da ordem de produção."})
        
        if self.product_order.end_date and self.production_day > self.product_order.end_date:
            raise ValidationError({'production_day': "A data do plano não pode ser posterior à data de término da ordem de produção."})

        # RN-PP-002: Consistência de Status da Ordem (ao criar/modificar)
        if self.product_order.status in [ProductionOrder.ProductionOrderStatus.COMPLETED, ProductionOrder.ProductionOrderStatus.CANCELED]:
            raise ValidationError("Não é possível criar ou modificar um plano para uma ordem de produção que já está 'Concluída' ou 'Cancelada'.")

        # RN-PP-010: Data Válida (production_day) - para novos planos
        if not self.pk and self.production_day < timezone.localdate():
            raise ValidationError({'production_day': "A data de produção para um novo plano não pode ser no passado."})

        # # RN-PP-009: Consistência de Quantidade por Turno (shifts vs total_quantity)
        if self.shifts and isinstance(self.shifts, dict):
            for shift_data in self.shifts.values():
                if 'total_quantity_per_shift' not in shift_data:
                    raise ValidationError("Todos os turnos devem ter a sua quantidade total de produção. (total_quantity_per_shift)")

            sum_shift_quantities = sum(
                shift_data['total_quantity_per_shift']
                for shift_data in self.shifts.values()
            )

            if sum_shift_quantities != self.total_quantity:
                raise ValidationError("A soma das quantidades por turno não corresponde à quantidade total do plano.")
            
        
        if not self.production_line.is_operational():
            raise ValidationError(
                f"Não é possível criar ou iniciar um plano na linha '{self.production_line.name}' "
                f"porque ela está com status '{self.production_line.get_status_display()}'."
            )
        

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


    # --- Métodos para Transição de Status ---

    # RN-PO-016: Transições de Status (para planos)
    def start(self):
        """Inicia o plano de produção."""
        # Regra: Só pode iniciar se a ordem não estiver cancelada ou concluída
        if self.product_order.status in [ProductionOrder.ProductionOrderStatus.CANCELED, ProductionOrder.ProductionOrderStatus.COMPLETED]:
            raise ValueError(f"Não é possível iniciar o plano. A ordem associada '{self.product_order.id}' está '{self.product_order.status}'.")
        
        # RN-INT-007: Início da Ordem por Planos
        # Se a ordem estiver 'EMPTY', ela deve ir para 'IN_PROGRESS' ao iniciar um plano
        if self.product_order.status == ProductionOrder.ProductionOrderStatus.EMPTY:
            self.product_order.status = ProductionOrder.ProductionOrderStatus.IN_PROGRESS
            self.product_order.save(update_fields=['status'])

        if self.status == 'planned':
            self.previous_status = self.status
            self.status = 'in_progress'
            self.save(update_fields=['status', 'previous_status'])
        else:
            raise ValueError(f"Não é possível iniciar o plano. Status atual é '{self.status}'.")

    def complete(self):
        """Conclui o plano de produção."""
        # Regra: Só pode concluir se a ordem não estiver cancelada
        if self.product_order.status == ProductionOrder.ProductionOrderStatus.CANCELED:
            raise ValueError(f"Não é possível concluir o plano. A ordem associada '{self.product_order.id}' está '{self.product_order.status}'.")

        if self.status in ['in_progress', 'paused']: # Permite concluir mesmo se pausado (trabalho pode ter sido finalizado)
            self.previous_status = self.status
            self.status = 'completed'
            self.save(update_fields=['status', 'previous_status'])
        else:
            raise ValueError(f"Não é possível concluir o plano. Status atual é '{self.status}'.")

    def pause(self, from_order=False):
        """Pausa o plano de produção."""
        # Regra: Só pode pausar se a ordem não estiver cancelada ou concluída
        if self.product_order.status in [ProductionOrder.ProductionOrderStatus.CANCELED, ProductionOrder.ProductionOrderStatus.COMPLETED]:
            raise ValueError(f"Não é possível pausar o plano. A ordem associada '{self.product_order.id}' está '{self.product_order.status}'.")

        if self.status == 'in_progress':
            self.previous_status = self.status
            self.status = 'paused'
            self.save(update_fields=['status', 'previous_status'])
        elif not from_order: # Se não veio da ordem, e o status não é in_progress, levanta erro
            raise ValueError(f"Não é possível pausar o plano. Status atual é '{self.status}'.")

    def resume(self, from_order=False):
        """Retoma um plano de produção pausado."""
        # Regra: Só pode retomar se a ordem não estiver cancelada ou concluída
        if self.product_order.status in [ProductionOrder.ProductionOrderStatus.CANCELED, ProductionOrder.ProductionOrderStatus.COMPLETED]:
            raise ValueError(f"Não é possível retomar o plano. A ordem associada '{self.product_order.id}' está '{self.product_order.status}'.")
        
        # Regra: Se a ordem estiver 'PAUSED', não pode retomar o plano individualmente
        if self.product_order.status == ProductionOrder.ProductionOrderStatus.PAUSED and not from_order:
            raise ValueError(f"Não é possível retomar o plano. A ordem associada '{self.product_order.id}' está pausada. Retome a ordem primeiro.")

        if self.status == 'paused':
            # Retorna ao status anterior, ou 'in_progress' se previous_status for nulo ou 'planned'
            if self.previous_status in ['planned', 'in_progress']:
                self.status = self.previous_status
            else: # Caso previous_status seja 'completed' ou 'canceled' (o que não deveria acontecer se a lógica for seguida)
                self.status = 'in_progress' # Default para in_progress
            self.previous_status = None # Limpa o previous_status após retomar
            self.save(update_fields=['status', 'previous_status'])
        elif not from_order:
            raise ValueError(f"Não é possível retomar o plano. Status atual é '{self.status}'.")

    def cancel(self, from_order=False):
        """Cancela o plano de produção."""
        if self.status != 'canceled':
            self.previous_status = self.status # Armazena o status anterior antes de cancelar
            self.status = 'canceled'
            self.save(update_fields=['status', 'previous_status'])
        elif not from_order: # Se já está cancelado e não veio da ordem, levanta erro
            raise ValueError(f"O plano já está cancelado.")


# --- Sinais para Manter a Consistência ---

@receiver(post_save, sender=ProductionPlan)
def update_order_on_plan_save(sender, instance, **kwargs):
    """
    Atualiza as quantidades e verifica o status da ProductionOrder
    sempre que um ProductionPlan é salvo.
    """
    instance.product_order.update_quantities_from_plans()

# Sinal para lidar com mudanças de status na ProductionOrder
@receiver(pre_save, sender=ProductionOrder)
def handle_order_status_change(sender, instance, **kwargs):
    """
    Propaga mudanças de status da ProductionOrder para os ProductionPlans associados.
    """
    if instance.pk: # Verifica se é uma atualização de uma instância existente
        original_instance = sender.objects.get(pk=instance.pk)
        # Se o status da ordem mudou E não é um status final (RN-PO-017)
        if original_instance.status != instance.status and not original_instance.is_final_status():
            instance.cascade_status_to_plans(instance.status)
        # RN-PO-017: Imutabilidade de Status Final
        elif original_instance.is_final_status() and original_instance.status != instance.status:
            raise ValidationError("Não é possível alterar o status de uma ordem que já está 'Concluída' ou 'Cancelada'.")
