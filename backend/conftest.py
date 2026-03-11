import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "strongpassword123",
    }


@pytest.fixture
def create_user(db, user_data):
    return get_user_model().objects.create_user(**user_data)


@pytest.fixture
def auth_client(api_client, create_user):
    api_client.force_authenticate(user=create_user)
    return api_client
