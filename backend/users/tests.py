import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_create_user(api_client):
    url = reverse("register")
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "strongpassword123",
    }
    response = api_client.post(url, payload)
    assert response.status_code == 201
