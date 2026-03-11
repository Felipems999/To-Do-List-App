from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categories"
    )

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owned_tasks"
    )

    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="tasks"
    )

    shared_with = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="shared_tasks", blank=True
    )

    def __str__(self):
        return self.title
