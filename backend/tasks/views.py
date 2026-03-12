from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Category, Task
from .serializer import CategorySerializer, TaskSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from django.db import models
from .permissions import havePermission
from django.contrib.auth import get_user_model

User = get_user_model()


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [havePermission]

    def get_queryset(self):
        user = self.request.user

        return Task.objects.filter(
            models.Q(owner=user) | models.Q(shared_with=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def share(self, request, pk=None):
        task = self.get_object()
        email = request.data.get("email")

        User = get_user_model()

        try:
            user_to_share = User.objects.get(email=email)
            if user_to_share == task.owner:
                return Response(
                    {"error": "Você já é o dono desta tarefa."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            task.shared_with.add(user_to_share)
            return Response(
                {"message": f"Tarefa compartilhada com {user_to_share.username}!"},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND
            )
