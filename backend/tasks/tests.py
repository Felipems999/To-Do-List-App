import pytest
from unittest import patch
from django.urls import reverse
from django.contrib.auth import get_user_model
from tasks.models import Task, Category

User = get_user_model()


@pytest.mark.django_db
class TestTaskSecurity:

    def test_user_cannot_access_others_tasks(self, auth_client):
        user_b = User.objects.create_user(
            username="user_b", email="b@test.com", password="password"
        )
        Task.objects.create(title="Task do B", owner=user_b)

        url = reverse("task-list")
        response = auth_client.get(url)

        assert response.status_code == 200
        assert len(response.data) == 4

    def test_user_can_access_shared_task(self, auth_client, create_user):
        user_b = User.objects.create_user(
            username="user_b", email="b@test.com", password="password"
        )
        task_b = Task.objects.create(title="Task Compartilhada", owner=user_b)
        task_b.shared_with.add(create_user)

        url = reverse("task-list")
        response = auth_client.get(url)

        assert response.status_code == 200
        assert len(response.data) == 4


@pytest.mark.django_db
class TestCategorySecurity:

    def test_user_cannot_access_others_categories(self, auth_client):
        user_b = User.objects.create_user(
            username="user_b", email="b@test.com", password="password"
        )

        Category.objects.create(name="Categoria de B", user=user_b)

        url = reverse("category-list")
        response = auth_client.get(url)

        assert response.status_code == 200
        assert len(response.data) == 0


@patch("genai.Client")
def test_suggest_subtasks_mocked(mock_client, client):
    mock_instance = mock_client.return_value
    mock_instance.models.generate_content.return_value.text = (
        "Passo 1\nPasso 2\nPasso 3"
    )

    response = client.post("/api/v1/tasks/suggest-steps/", {"title": "Teste Unitário"})

    assert response.status_code == 200
    assert len(response.data["suggestions"]) == 3
