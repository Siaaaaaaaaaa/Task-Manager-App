from django.db import models
from django.contrib.auth.models import User
# ------------------------
# Profile
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default.png')

    def __str__(self):
        return self.full_name

# ------------------------
# Todo
class Todo(models.Model):
    PRIORITY_CHOICES = [
        ('CAN_WAIT', 'Can Wait'),
        ('IMPORTANT', 'Important'),
        ('URGENT', 'Urgent'),
    ]

    title = models.CharField(max_length=250)
    description = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='IMPORTANT')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title


# ------------------------
# Team
# ------------------------
class Team(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, related_name='owned_teams', on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='teams')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
# ------------------------
# Team Task
# ------------------------
class TeamTask(models.Model):
    PRIORITY_CHOICES = [
        ('CAN_WAIT', 'Can Wait'),
        ('IMPORTANT', 'Important'),
        ('URGENT', 'Urgent'),
    ]

    team = models.ForeignKey(Team, related_name='tasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    due_date = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='IMPORTANT')
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title

class Project(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)

class SubTask(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='subtasks')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)