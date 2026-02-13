from allauth.socialaccount.helpers import render_authentication_error
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.models import SocialLogin
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.views import OAuth2CallbackView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView): # Herdando de SocialLoginView
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client 
    # Opcional: defina client_class se precisar de customização extra no cliente OAuth2

class GoogleLogoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        # Aqui você pode adicionar lógica extra se necessário
        return Response({'detail': 'Logout do Google realizado com sucesso.'}, status=200)

