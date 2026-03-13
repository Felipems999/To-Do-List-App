from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from django.contrib.auth import get_user_model
from .models import Category, Task
from .serializer import CategorySerializer, TaskSerializer
from .permissions import havePermission
from .pagination import StandardResultsSetPagination

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
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user = self.request.user

        queryset = Task.objects.filter(
            models.Q(owner=user) | models.Q(shared_with=user)
        ).distinct()

        is_completed = self.request.query_params.get("is_completed")
        category_id = self.request.query_params.get("category")

        if is_completed is not None:
            is_completed_bool = is_completed.lower() == "true"
            queryset = queryset.filter(is_completed=is_completed_bool)

        if category_id is not None:
            queryset = queryset.filter(category_id=category_id)

        return queryset.order_by("-id")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def share(self, request, pk=None):
        task = self.get_object()
        email = request.data.get("email")

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
