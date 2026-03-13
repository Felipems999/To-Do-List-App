import os
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db import models
from django.contrib.auth import get_user_model
from .models import Category, Task
from .serializer import CategorySerializer, TaskSerializer
from .permissions import havePermission
from .pagination import StandardResultsSetPagination
from dotenv import load_dotenv
from google import genai


load_dotenv()

User = get_user_model()


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def suggest_subtasks(request):
    api_key = os.getenv("GEMINI_KEY")
    if not api_key:
        return Response({"error": "API Key não configurada"}, status=500)

    client = genai.Client(api_key=api_key)

    task_title = request.data.get("title")
    if not task_title:
        return Response({"error": "Título é obrigatório"}, status=400)

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=f"Com base no objetivo '{task_title}', liste 5 subtarefas curtas e práticas. Retorne apenas a lista, uma por linha, sem números e sem asteriscos.",
        )

        if response.text:
            subtasks = [
                line.strip()
                for line in response.text.strip().split("\n")
                if line.strip()
            ]
            return Response({"suggestions": subtasks})

        return Response({"error": "A IA retornou uma resposta vazia"}, status=500)

    except Exception as e:
        print(f"Erro Gemini (Novo SDK): {e}")
        return Response(
            {"error": f"Erro na IA: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY
        )


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
