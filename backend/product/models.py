from django.db import models


class Product(models.Model):

    class ProductType(models.TextChoices):
        RAW_MATERIAL = 'raw_material', 'Raw Material'
        SEMI_FINISHED = 'semi_finished', 'Semi Finished'
        FINISHED = 'finished', 'Finished'

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    code = models.CharField(max_length=100, unique=True, blank=False, null=False)
    product_type = models.CharField(
        max_length=20,
        choices=ProductType.choices,
        default=ProductType.RAW_MATERIAL
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return f'Product: {self.name}'
