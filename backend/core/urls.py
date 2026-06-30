from django.urls import include, path
from django.contrib import admin
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('user.urls')),
    path('api/auth/', include('auth_jwt.urls')),
    path('api/', include('clickhouse_data.urls')),
    path('api/', include('product.urls')),
    path('api/', include('production_plan.urls')),
    path('api/', include('production_order.urls')),
    path('api/', include('production_lines.urls')),
    path('api/', include('line_stations.urls')),
    path('api/', include('production_defect.urls')),
    path('accounts/', include('allauth.urls')),
    path('', include('auth_allauth.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
