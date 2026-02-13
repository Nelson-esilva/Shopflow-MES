import django_filters
from .models import User


class UserFilter(django_filters.FilterSet):

    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    username = django_filters.CharFilter(field_name='username', lookup_expr='icontains')
    email = django_filters.CharFilter(field_name='email', lookup_expr='icontains')
    role = django_filters.BaseInFilter(field_name='role', lookup_expr='in')

    class Meta:
        model = User
        fields = '__all__'