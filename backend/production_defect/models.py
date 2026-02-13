from django.db import models

class ProductionDefect(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=False, default="")
    cause_solution = models.TextField()
    discard = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']   

    def __str__(self):
        return self.name
