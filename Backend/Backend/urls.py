from django.contrib import admin
from django.urls import path, include
from api import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls')),  
    path('register/', views.register, name ='register'),
    path('login/', views.login, name ='login'),
    path('log_code/', views.log_code, name='log_code'),
]
