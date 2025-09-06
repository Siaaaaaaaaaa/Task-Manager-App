from django.contrib import admin
from .models import Todo, Profile

class TodoAdmin (admin.ModelAdmin):

    ist_display = ("title", "priority", "assigned_to", "due_date", "completed", "created_at", "updated_at")
    list_filter = ("completed", "priority", "assigned_to")  # Filters on the right side
    search_fields = ("title", "description")  # Search bar
    ordering = ("due_date",)  # Default ordering

admin.site.register(Todo,TodoAdmin)   


class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "full_name", "role")  # afișează câmpurile dorite
    search_fields = ("user__username", "full_name", "role")
    list_filter = ("role",)

admin.site.register(Profile,ProfileAdmin)
