from rest_framework import permissions


class havePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            obj.owner == request.user
            or obj.shared_with.filter(id=request.user.id).exists()
        )
