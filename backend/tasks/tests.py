import pytest
from django.contrib.auth import get_user_model
from tasks.models import Task, Category

User = get_user_model()


@pytest.mark.django_db
class TestTaskSecurity:

    def test_user_cannot_access_others_tasks(self, auth_client, db):
        user_b = User.objects.create_user(
            username="user_b", email="b@test.com", password="password"
        )
        Task.objects.create(title="Task do B", owner=user_b)

        response = auth_client.get("/api/tasks/tasks/")

        assert response.status_code == 200
        assert len(response.data) == 0

    def test_user_can_access_shared_task(self, auth_client, create_user, db):
        user_b = User.objects.create_user(
            username="user_b", email="b@test.com", password="password"
        )

        task_b = Task.objects.create(title="Task Compartilhada", owner=user_b)
        task_b.shared_with.add(create_user)

        response = auth_client.get("/api/tasks/tasks/")

        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["title"] == "Task Compartilhada"

    def test_task_suspension_state(self, auth_client, create_user, db):
        task = Task.objects.create(
            title="Task Pausada", owner=create_user, is_suspended=True
        )

        response = auth_client.get(f"/api/tasks/tasks/{task.id}/")
        assert response.data["is_suspended"] is True


@pytest.mark.django_db
class TestCategorySecurity:

    def test_user_cannot_access_others_categories(self, auth_client, db):
        user_b = User.objects.create_user(
            username="user_b", email="b@test.com", password="password"
        )
        Category.objects.create(name="Categoria de B", user=user_b)

        response = auth_client.get("/api/tasks/categories/")

        assert response.status_code == 200
        assert len(response.data) == 0
