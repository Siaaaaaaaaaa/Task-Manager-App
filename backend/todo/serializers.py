from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Todo, Profile, Team, TeamTask, Project,SubTask

# ------------------------
# Profile Serializer
# ------------------------
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['full_name', 'role', 'avatar']


# ------------------------
# User Serializer
# ------------------------
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']


# ------------------------
# Todo Serializer
# ------------------------
class TodoSerializer(serializers.ModelSerializer):
    assigned_to = serializers.StringRelatedField()

    class Meta:
        model = Todo
        fields = '__all__'


# ------------------------
# Signup Serializer
# ------------------------
class SignupSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        role = validated_data.pop('role')
        password = validated_data.pop('password')

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        Profile.objects.get_or_create(
            user=user,
            defaults={'full_name': full_name, 'role': role}
        )
        return user


# ------------------------
# Team Serializers
# ------------------------
class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_progress(self, obj):
        subtasks = obj.subtasks.all()
        if not subtasks.exists():
            return 0
        completed_count = subtasks.filter(completed=True).count()
        return round(completed_count / subtasks.count() * 100, 2)


class TeamSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'owner', 'members', 'created_at']


class TeamTaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)

    class Meta:
        model = TeamTask
        fields = ['id', 'team', 'title', 'description', 'completed', 'due_date', 'priority', 'assigned_to']
