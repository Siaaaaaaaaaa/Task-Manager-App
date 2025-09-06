from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from todo.views import TodoViewSet, SignupView, LoginView, me, TeamViewSet, TeamTaskViewSet,ProjectViewSet,SubTaskViewSet,all_users
from rest_framework.authtoken import views

router = routers.DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'team-tasks', TeamTaskViewSet, basename='team-task')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'subtasks', SubTaskViewSet, basename='subtask')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),           # toate viewset-urile
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/users/me/', me, name='me'),
    path('api-auth/', include('rest_framework.urls')), 
    path('api-token-auth/', views.obtain_auth_token),
    path('api/users/', all_users, name='all-users'),
]


