from django.contrib import admin
from django.urls import path, include
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('api.urls')),

    # Registro y login
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('log_code/', views.log_code, name='log_code'),

    # Crear datos
    path('crear_persona/', views.crear_persona, name='crear_persona'),
    path('crear_paquete/', views.crear_paquete, name='crear_paquete'),
    path('admin_crear_paquete/', views.admin_crear_paquete, name='admin_crear_paquete'),
    path('hacer_pago/', views.realizar_pago, name='hacer_pago'),

    # POST Jefe de ventas
    path('crear_pais/', views.crear_pais, name='crear_pais'),
    path('crear_ciudad/', views.crear_ciudad, name='crear_ciudad'),
    path('crear_auto/', views.crear_auto, name='crear_auto'),
    path('crear_hotel/', views.crear_hotel, name='crear_hotel'),
    path('crear_avion/', views.crear_avion, name='crear_avion'),
    path('crear_vuelo/', views.crear_vuelo, name='crear_vuelo'),
    path('crear_asiento/', views.crear_asiento, name='crear_asiento'),
    path('anular_pedido/<int:paquete_id>/', views.anular_pedido, name='anular_pedido'),

    # GET generales
    path('conseguir_mi_usuario/', views.get_my_user, name='conseguir_mi_usuario'),
    path('conseguir_carrito/', views.get_carrito, name='conseguir_carrito'),
    path('conseguir_mis_reservas/', views.get_reservas_usuario, name='conseguir_mis_reservas'),
    path('conseguir_mis_reservas_pendientes/', views.get_paquetes_pendientes_usuario, name='conseguir_mis_reservas_pendientes'),
    path('conseguir_autos/', views.get_autos, name='conseguir_autos'),
    path('conseguir_hoteles/', views.get_hoteles, name='conseguir_hoteles'),
    path('conseguir_paises/', views.get_paises, name='conseguir_paises'),
    path('conseguir_ciudades/', views.get_ciudades, name='conseguir_ciudades'),
    path('conseguir_paquetes_en_venta/', views.get_paquetes_en_venta, name='conseguir_paquetes_en_venta'),
    path('conseguir_paquetes_lista/', views.conseguir_paquetes_en_venta, name='conseguir_paquetes_lista'),
    path('buscar_hoteles/', views.buscar_hoteles, name='buscar_hoteles'),
    path('obtener_paquetes_search/', views.obtener_paquetes_search, name='obtener_paquetes_search'),
    path('obtener_vuelos_personalizados/', views.get_vuelos_personalizados, name='get_vuelos_personalizados'),
    path('cotizar_vuelo/', views.calcular_cotizacion_vuelo),
    path('conseguir_hotel_ciudad/', views.get_hotel_ciudad, name='conseguir_hotel_ciudad'),

    # GET Jefe de ventas
    path('conseguir_personas/', views.get_personas, name='conseguir_personas'),
    path('conseguir_paquetes_pendientes/', views.get_paquetes_pendientes, name='conseguir_paquetes_pendientes'),
    path('conseguir_facturas/', views.ver_facturas_a_cobrar, name='conseguir_facturas'),

    # PUTS generales
    path('modificar_paquete/<int:paquete_id>/', views.modificar_paquete, name='modificar_paquete'),


    # DELETE generales


    # NUEVAS rutas de modelos agregados
    path('conseguir_vuelos/', views.get_vuelos, name='conseguir_vuelos'),
    path('conseguir_aviones/', views.get_aviones, name='conseguir_aviones'),
    path('conseguir_asientos/', views.get_asientos, name='conseguir_asientos'),
    path('conseguir_pagos/', views.get_pagos, name='conseguir_pagos'),
    path('conseguir_asientos_vuelo/<int:vuelo_id>/', views.get_asientos_vuelo, name='conseguir_asientos_vuelos')
   # path('conseguir_facturas_completas/', views.get_facturas_completas, name='conseguir_facturas_completas'),



]
