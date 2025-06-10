from django.contrib import admin
from django.urls import path, include
from api import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls')),  
    path('register/', views.register, name ='register'),
    path('login/', views.login, name ='login'),
    path('log_code/', views.log_code, name='log_code'),
    path('crear_pais/', views.crear_pais, name='crear_pais'),
    path('crear_ciudad/', views.crear_ciudad, name='crear_ciudad'),
    path('crear_auto/', views.crear_auto, name='crear_auto'),
    path('crear_hotel/', views.crear_hotel, name='crear_hotel'),
    path('crear_paquete/', views.crear_paquete, name='crear_paquete'),
    path('crear_persona/', views.crear_persona, name='crear_persona'),
]

