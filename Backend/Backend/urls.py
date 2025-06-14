from django.contrib import admin
from django.urls import path, include
from api import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls')),  
    path('register/', views.register, name ='register'),
    path('login/', views.login, name ='login'),
    path('log_code/', views.log_code, name='log_code'),
    path('crear_persona/', views.crear_persona, name='crear_persona'),
    path('crear_paquete/', views.crear_paquete, name='crear_paquete'),
    path('pago_aprobado/', views.pago_paquete_aprobado_directo, name='pago_aprobado'),
    #POST Jefe de ventas
    path('crear_pais/', views.crear_pais, name='crear_pais'),
    path('crear_ciudad/', views.crear_ciudad, name='crear_ciudad'),
    path('crear_auto/', views.crear_auto, name='crear_auto'),
    path('crear_hotel/', views.crear_hotel, name='crear_hotel'),
    path('anular_pedido/<int:paquete_id>/', views.anular_pedido, name='anular_pedido'),
    #POST Mercado pago
    path('mercado-pago/webhook/', views.mercado_pago_webhook, name='mercado_pago_webhook'),


    #GET generales
    path('conseguir_mi_usuario/', views.get_my_user, name='conseguir_mi_usuario'),
    path('conseguir_carrito/', views.get_carrito, name='conseguir_carrito'),
    path('conseguir_mis_reservas/', views.get_reservas_usuario, name='conseguir_mis_reservas'),
    path('conseguir_autos/', views.get_autos, name='conseguir_autos'),
    path('conseguir_hoteles/', views.get_hoteles, name='conseguir_hoteles'),
    path('conseguir_paises/', views.get_paises, name='conseguir_paises'),
    path('conseguir_ciudades/', views.get_ciudades, name='conseguir_ciudades'),
    path('conseguir_paquetes_en_venta/', views.get_paquetes_en_venta, name='conseguir_paquetes_en_venta'),
    path('buscar_hoteles/', views.buscar_hoteles, name='buscar_hoteles'),
    path('obtener_paquetes_search/', views.obtener_paquetes_search, name='obtener_paquetes_search'),
    #Get Jefe de ventas
    path('conseguir_personas/', views.get_personas, name='conseguir_personas'),
    path('conseguir_paquetes_pendientes/', views.get_paquetes_pendientes, name='conseguir_paquetes_pendientes'),
    path('conseguir_facturas/', views.ver_facturas_a_cobrar, name='conseguir_facturas'),

    #PUTS generales
    path('modificar_paquete/<int:paquete_id>/', views.modificar_paquete, name='modificar_paquete'),
    
    #Deletes generales
    path('eliminar_paquete/<int:paquete_id>/', views.eliminar_paquete, name='eliminar_paquete'),

]

