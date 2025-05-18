from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        if not username or not password or not email:
            return Response({'detail': 'All fields are required.'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Username already exists.'}, status=400)
        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({'detail': 'User created successfully.'}, status=201)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
