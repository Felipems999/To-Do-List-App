from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    birthday = models.DateField()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __init__(self):
        pass

    def __str__(self):
        return self.email

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "birthday": self.birthday.isoformat(),
            "first_name": self.first_name,
            "last_name": self.last_name,
        }
