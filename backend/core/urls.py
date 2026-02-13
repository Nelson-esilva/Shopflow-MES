from django.urls import include, path
from django.contrib import admin
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [   
    path('admin/',admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('user.urls')),
    path('api/auth/', include('auth_jwt.urls')),
    path('api/', include('clickhouse_data.urls')),

    #new table for test
    path('api/', include('daily_workstation_relativo.urls')),
    
    # URLs para os aplicativos de produção
    path('api/', include('product.urls')),
    path('api/', include('production_plan.urls')),
    path('api/', include('production_order.urls')),
    path('api/', include('production_lines.urls')),
    path('api/', include('line_stations.urls')),
    path('api/', include('production_defect.urls')),

   # URLs do allauth (necessárias para fluxo social e gerenciamento de conta)
    path('accounts/', include('allauth.urls')),

    # URLs do app auth_user (para callback do Google)
    path("", include('auth_allauth.urls')),

    # Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

