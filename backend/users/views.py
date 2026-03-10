from django.shortcuts import render

from rest_framework import generics, permissions
from .serializer import UserSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
