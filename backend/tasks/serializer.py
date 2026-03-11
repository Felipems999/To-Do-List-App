from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Task

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "user"]
        read_only_fields = ["user"]


class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")

    shared_with_emails = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="email"
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "is_completed",
            "is_suspended",
            "created_at",
            "owner",
            "category",
            "category_name",
            "shared_with",
            "shared_with_emails",
        ]
        read_only_fields = ["owner", "created_at"]

    def validate_category(self, value):
        if value and value.user != self.context["request"].user:
            raise serializers.ValidationError("Você não pode usar esta categoria.")
        return value
