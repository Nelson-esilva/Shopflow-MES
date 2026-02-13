from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.utils.translation import gettext_lazy as _


class ProductionOrder(models.Model):
    
    class ProductionOrderStatus(models.TextChoices):
        EMPTY = 'empty', 'Empty'
        IN_PROGRESS = 'in_progress', 'In Progress'
        PAUSED = 'paused', 'Paused'
        COMPLETED = 'completed', 'Completed',
        CANCELED = 'canceled', 'Canceled'

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    order_code = models.CharField(max_length=255, unique=True)
    quantity_meta = models.IntegerField(default=0)
    quantity_planned = models.IntegerField(default=0)
    quantity_completed = models.IntegerField(default=0)
    start_date = models.DateField(blank=False, null=False)
    end_date = models.DateField(blank=False, null=False)
    status = models.CharField(max_length=20, choices=ProductionOrderStatus.choices, default=ProductionOrderStatus.EMPTY)


    def __str__(self):
        return f"Ordem {self.id} - Status: {self.status}"

    def clean(self):
        # ... (suas validações existentes aqui) ...
        pass # Placeholder para suas validações

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def update_quantities_from_plans(self):
        """
        RN-INT-005: Atualiza quantity_planned e quantity_completed da ordem
        com base nos planos de produção associados.
        RN-PO-007: Consistência com Planos (soma dos planos vs quantity_planned da ordem)
        RN-INT-003: Quantidade Total Planejada vs. Quantidade da Ordem
        """
        # Acessa os planos através do related_name 'orders'
        self.quantity_planned = self.orders.filter(
            status__in=['planned', 'in_progress', 'paused']
        ).aggregate(Sum('total_quantity'))['total_quantity__sum'] or 0

        self.quantity_completed = self.orders.filter(
            status='completed'
        ).aggregate(Sum('total_quantity'))['total_quantity__sum'] or 0
        
        self.save(update_fields=['quantity_planned', 'quantity_completed'])
        self.check_completion() # Verifica se a ordem pode ser concluída após atualizar quantidades

    def check_completion(self):
        """
        RN-PO-004: Status de Conclusão
        RN-INT-006: Conclusão da Ordem por Planos
        Verifica se a ordem de produção pode ser marcada como concluída.
        """
        if self.status in [self.ProductionOrderStatus.COMPLETED, self.ProductionOrderStatus.CANCELED]:
            return

        if self.quantity_meta is not None and self.quantity_completed is not None:
            if self.quantity_completed >= self.quantity_meta:
                self.status = self.ProductionOrderStatus.COMPLETED
                self.save(update_fields=['status'])
                print(f"Ordem {self.id} marcada como CONCLUÍDA (meta atingida).")
                return
        
        all_plans_finalized = not self.orders.exclude(
            status__in=['completed', 'canceled']
        ).exists()
        
        if all_plans_finalized and self.quantity_planned == self.quantity_completed:
            self.status = self.ProductionOrderStatus.COMPLETED
            self.save(update_fields=['status'])
            print(f"Ordem {self.id} marcada como CONCLUÍDA (todos os planos finalizados e planejado atingido).")


    def cascade_status_to_plans(self, new_order_status):
        """
        RN-INT-004: Propagação de Status da Ordem para Planos
        Propaga o status da ordem para os planos de produção associados.
        """
        if new_order_status == self.ProductionOrderStatus.CANCELED:
            for plan in self.orders.exclude(status='canceled'):
                plan.cancel(from_order=True)
        elif new_order_status == self.ProductionOrderStatus.PAUSED:
            for plan in self.orders.filter(status='in_progress'):
                plan.pause(from_order=True)
        elif new_order_status == self.ProductionOrderStatus.IN_PROGRESS:
            for plan in self.orders.filter(status='paused', previous_status__isnull=False):
                plan.resume(from_order=True)

    def is_final_status(self):
        return self.status in [self.ProductionOrderStatus.COMPLETED, self.ProductionOrderStatus.CANCELED]

    def update_quantity_planned(self, new_quantity):
        if self.is_final_status():
            raise ValidationError("Não é possível alterar a quantidade planejada de uma ordem finalizada.")
        
        active_plans_sum = self.orders.filter(
            status__in=['planned', 'in_progress', 'paused']
        ).aggregate(Sum('total_quantity'))['total_quantity__sum'] or 0

        if new_quantity < active_plans_sum:
            raise ValidationError("Não é possível diminuir a quantidade planejada para um valor menor do que a soma das quantidades dos planos ativos.")
        
        self.quantity_planned = new_quantity
        self.save(update_fields=['quantity_planned'])