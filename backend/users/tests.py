import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_create_user(client):
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "strongpassword123",
    }
    response = client.post("/api/users/register/", payload)
    assert response.status_code == 201
    assert User.objects.count() == 1
    assert User.objects.get().email == "test@example.com"
