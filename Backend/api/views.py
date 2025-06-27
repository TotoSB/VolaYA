from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import Usuarios, Carritos, Reservas_usuario
import random
from django.core.mail import send_mail
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import math
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Q, Count, Sum
import mercadopago

sdk = mercadopago.SDK("TEST-6677338736055594-061201-ec6608dc36251133dd3b1718995d2dc4-292453564")

#Funciones
def calcular_distancia_km(lat1, lon1, lat2, lon2):
    R = 6371  # Radio de la Tierra en km

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distancia = R * c
    print(f"Distancia calculada: {distancia} km")
    return distancia

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calcular_cotizacion_vuelo(request):
    try:
        vuelo_id = request.data.get('vuelo_id')
        asientos_ids = request.data.get('asientos_ids', [])

        vuelo = Vuelos.objects.select_related('avion', 'origen', 'destino').get(id=vuelo_id)
        asientos = Asientos.objects.filter(id__in=asientos_ids, vuelo=vuelo)

        lat1, lon1 = vuelo.origen.latitud, vuelo.origen.longitud
        lat2, lon2 = vuelo.destino.latitud, vuelo.destino.longitud

        distancia = calcular_distancia_km(lat1, lon1, lat2, lon2)

        total = 0
        for asiento in asientos:
            if asiento.vip:
                total += vuelo.avion.costo_km_vip * distancia
            else:
                total += vuelo.avion.costo_km_general * distancia

        return Response({'costo': round(total, 2), 'distancia': round(distancia, 2)})

    except Exception as e:
        return Response({'error': str(e)}, status=400)


#POST

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.activo = False  # El usuario se desactiva, para validar luego y pedir el codigo de verificacion
        user.save()
        send_verification_code(user)
        return Response(
            {"message": "Registro exitoso. Verifica tu correo electrónico para activar tu cuenta."},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    correo = request.data.get('correo')
    password = request.data.get('password')

    if correo is None or password is None:
        return Response({'error': 'Correo y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, correo=correo, password=password)
    if user is None:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.activo:
        return Response({'error': 'Usuario no activo'}, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'correo': user.correo,
        'nombre_usuario': user.nombre_usuario,
    })


def send_verification_code(user):
    code = random.randint(100000, 999999)
    user.codigo_activacion = code
    user.save()

    send_mail(
        'Volaya - Tu código de verificación',
        f'Tu código de verificación es: {code}',
        "noreplyprobuildsalbiononline@gmail.com",
        [user.correo],
        fail_silently=False,
    )

    return "Se ha enviado un código de verificación a tu correo electrónico."



@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    correo = request.data.get('correo')
    password = request.data.get('password')

    if not correo or not password:
        return Response({"error": "Correo y contraseña son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Usuarios.objects.get(correo=correo)
    except Usuarios.DoesNotExist:
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.activo:
        return Response({
            "message": "Ingresa el código de verificación para terminar de iniciar sesión",
            "usuario_id": user.id  # Opcional, si querés usar esto para la validación posterior
        }, status=status.HTTP_403_FORBIDDEN)

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "correo": user.correo,
        "nombre_usuario": user.nombre_usuario,
    })


@api_view(['POST']) 
@permission_classes([AllowAny])
def log_code(request):
    usuario_id = request.data.get('id_usuario')
    codigo = request.data.get('codigo_activacion')

    try:
        user = Usuarios.objects.get(id=usuario_id)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if user.activo:
        return Response({"error": "El usuario ya está activado"}, status=status.HTTP_400_BAD_REQUEST)

    if str(user.codigo_activacion) != str(codigo):
        return Response({"error": "Código de verificación incorrecto"}, status=status.HTTP_400_BAD_REQUEST)

    user.activo = True
    user.codigo_activacion = None
    user.save()

    refresh = RefreshToken.for_user(user)

    Carritos.objects.create(id_usuario=user)

    return Response({
        "message": "Usuario activado correctamente",
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "correo": user.correo,
        "nombre_usuario": user.nombre_usuario,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_pais(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = PaisSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "País creado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_ciudad(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    serializer = CiudadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Ciudad creada correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_auto(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    serializer = AutoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Auto creado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_hotel(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    serializer = HotelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Hotel creado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def crear_avion(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    capacidad_vip = request.data.get('capacidad_vip', 0)
    capacidad_general = request.data.get('capacidad_general', 0)

    try:
        capacidad_vip = int(capacidad_vip)
        capacidad_general = int(capacidad_general)
    except ValueError:
        return Response({"error": "Los campos de capacidad deben ser enteros."}, status=status.HTTP_400_BAD_REQUEST)

    capacidad_total = capacidad_vip + capacidad_general

    data = request.data.copy()
    data['capacidad_avion'] = capacidad_total

    serializer = AvionSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Avión creado correctamente."}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def crear_vuelo(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    data = request.data

    try:
        # Recuperar objetos relacionados
        avion = Aviones.objects.get(id=data['avion'])
        origen = Ciudades.objects.get(id=data['origen'])
        destino = Ciudades.objects.get(id=data['destino'])

        # Crear el vuelo
        vuelo = Vuelos.objects.create(
            avion=avion,
            origen=origen,
            destino=destino,
            fecha=data.get('fecha')
        )

        # Inicializamos contador de número de asiento
        numero_asiento = 1

        # Crear asientos VIP
        for _ in range(avion.capacidad_vip):
            Asientos.objects.create(vuelo=vuelo, vip=True, numero=numero_asiento)
            numero_asiento += 1

        # Crear asientos Generales
        for _ in range(avion.capacidad_general):
            Asientos.objects.create(vuelo=vuelo, vip=False, numero=numero_asiento)
            numero_asiento += 1

        return Response({"message": "Vuelo y asientos creados correctamente."}, status=status.HTTP_201_CREATED)

    except KeyError as e:
        return Response({"error": f"Falta el campo requerido: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    except Aviones.DoesNotExist:
        return Response({"error": "El avión especificado no existe."}, status=status.HTTP_400_BAD_REQUEST)
    except Ciudades.DoesNotExist:
        return Response({"error": "La ciudad de origen o destino no existe."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([AllowAny])
def crear_asiento(request):
    if not request.user.is_staff:
            return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    serializer = AsientoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Asientos creado correctamente."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_paquete(request):
    serializer = PaqueteSerializer(data=request.data)

    if serializer.is_valid():
        paquete = serializer.save(id_usuario=request.user)

        # Agregar los asientos ManyToMany
        paquete.asiento_ida.set(serializer.validated_data['asiento_ida'])
        paquete.asiento_vuelta.set(serializer.validated_data['asiento_vuelta'])

        # Actualizar carrito y reservas si no es staff
        if not request.user.is_staff:
            carrito = Carritos.objects.get(id_usuario=request.user)
            carrito.total += Decimal(str(paquete.total))
            carrito.save()

            Reservas_usuario.objects.create(
                usuario=request.user,
                paquete=paquete
            )

        return Response({
            "message": "Paquete creado exitosamente",
            "costo_total": float(paquete.total)
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_crear_paquete(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    print("Datos recibidos:", request.data)

    try:
        paquete = Paquetes.objects.create(
            id_usuario=request.user,
            descripcion=request.data.get('descripcion'),
            personas=request.data.get('personas'),
            vuelo_ida_id=request.data.get('vuelo_ida'),
            vuelo_vuelta_id=request.data.get('vuelo_vuelta'),
            hotel_id=request.data.get('hotel') or None,
            auto_id=request.data.get('auto') or None,
            total=request.data.get('total')
        )

        return Response(
            {"message": "Paquete creado exitosamente.", "id": paquete.id},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"error": f"Error al guardar el paquete: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_persona(request):
    if request.method == 'POST':
        serializer = PersonaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Persona creada exitosamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def asignar_reserva_a_usuario(request, reserva_id):
    try:
        reserva = Paquetes.objects.get(id=reserva_id)
    except Paquetes.DoesNotExist:
        return Response({"error": "Reserva no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    if Reservas_usuario.objects.filter(id_usuario=request.user, id_paquete=reserva).exists():
        return Response({"error": "La reserva ya ha sido asignada al usuario"}, status=status.HTTP_400_BAD_REQUEST)

    Reservas_usuario.objects.create(
        id_usuario=request.user,
        id_paquete=reserva
    )

    #Actualizamos el valor del carrito del usuario
    Carritos.objects.filter(usuario=request.user).total += reserva.total


    return Response({"message": "Reserva asignada al usuario correctamente"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def anular_pedido(request, paquete_id):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)
    try:
        paquete = Paquetes.objects.get(id=paquete_id)
    except Paquetes.DoesNotExist:
        return Response({"error": "Paquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if not paquete.pagado:
        return Response({"error": "El paquete no ha sido pagado"}, status=status.HTTP_400_BAD_REQUEST)

    paquete.pagado = False
    paquete.save()

    factura_pago = Pagos.objects.get(paquete=paquete, estado='COMPLETADO')
    factura_pago.estado = 'CANCELADO'
    factura_pago.save()

    Historica.objects.filter(paquete=paquete).delete()

    return Response({"message": "Pedido anulado correctamente"}, status=status.HTTP_200_OK)

#GET

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_user(request):
    if request.method == 'GET':
        user = Usuarios.objects.get(id=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST'])
@permission_classes([AllowAny])
def obtener_paquetes_search(request):
    if request.method == 'POST':
        serializer = CotizarPaqueteSerializer(data=request.data)
        if serializer.is_valid():
            ciudad_salida = serializer.validated_data['ciudad_salida']
            ciudad_destino = serializer.validated_data['ciudad_destino']
            personass = serializer.validated_data['personas']

            fecha_salida = serializer.validated_data['fecha_salida']
            fecha_regreso = serializer.validated_data['fecha_regreso']

            lat1 = float(ciudad_salida.latitud)
            lon1 = float(ciudad_salida.longitud)
            lat2 = float(ciudad_destino.latitud)
            lon2 = float(ciudad_destino.longitud)

            distancia_km = calcular_distancia_km(lat1, lon1, lat2, lon2)
            precio_por_km = 2000

            costo_vuelo = (distancia_km * precio_por_km) * personass
            costo_vuelo = round(costo_vuelo, 2)  # Redondear a dos decimales

            auto = serializer.validated_data.get('auto')
            if auto:
                auto_seleccionado = Autos.objects.get(id=auto.id)
                costo_vuelo += auto_seleccionado.precio_dia * (fecha_regreso - fecha_salida).days


            # Filtrar hoteles con capacidad suficiente
            hoteles_buscar = Hoteles.objects.filter(
                ciudad=ciudad_destino,
                personas__gte=personass
            )

            # Podés seguir acá con lo que querés hacer con los hoteles filtrados y el costo
            return Response({
                "costo_vuelo_y_servicios": costo_vuelo,
                "hoteles_disponibles": HotelSerializer(hoteles_buscar, many=True).data
            })
        return Response(serializer.errors, status=400)

@api_view(['POST']) 
@permission_classes([AllowAny])
def get_vuelos_personalizados(request):
    fecha_ida = request.data.get('fecha_ida')
    fecha_vuelta = request.data.get('fecha_vuelta')
    destino_id = request.data.get('destino')
    origen_id = request.data.get('origen')
    personas = int(request.data.get('personas', 1))

    if not fecha_ida or not fecha_vuelta or not destino_id or not origen_id:
        return Response({"error": "Faltan datos requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Vuelos de ida con al menos 'personas' asientos disponibles
        vuelos_ida = Vuelos.objects.annotate(
            asientos_disponibles=Count('asientos', filter=Q(asientos__reservado=False))
        ).filter(
            fecha__date=fecha_ida,
            origen__id=origen_id,
            destino__id=destino_id,
            asientos_disponibles__gte=personas
        )


        vuelos_vuelta = Vuelos.objects.annotate(
            asientos_disponibles=Count('asientos', filter=Q(asientos__reservado=False))
        ).filter(
            fecha__date=fecha_vuelta,
            origen__id=destino_id,
            destino__id=origen_id,
            asientos_disponibles__gte=personas
        )

        vuelos_ida_serialized = VueloListSerializer(vuelos_ida, many=True).data
        vuelos_vuelta_serialized = VueloListSerializer(vuelos_vuelta, many=True).data

        return Response({
            "vuelos_ida": vuelos_ida_serialized,
            "vuelos_vuelta": vuelos_vuelta_serialized
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_hotel_ciudad (request):
    ciudad_id = request.data.get('ciudad_id')
    personas = request.data.get('personas', 1)

    if not ciudad_id:
        return Response({"error": "Ciudad ID es requerido"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        ciudad = Ciudades.objects.get(id=ciudad_id)
        hoteles = Hoteles.objects.filter(ciudad=ciudad, personas__gte=personas)
        serializer = HotelSerializer(hoteles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Ciudades.DoesNotExist:
        return Response({"error": "Ciudad no encontrada"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_personas(request):
    if request.method == 'GET':
        personas = Personas.objects.all()
        serializer = PersonaSerializer(personas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_carrito(request):
    if request.method == 'GET':
        try:
            carrito = Carritos.objects.get(id_usuario=request.user)
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Carritos.DoesNotExist:
            return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reservas_usuario(request):
    if request.method == 'GET':
        reservas = Reservas_usuario.objects.filter(usuario=request.user)
        serializer = ReservaUsuarioSerializer(reservas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_paquetes_pendientes_usuario(request):
    if request.method == 'GET':
        paquetes = Paquetes.objects.filter(id_usuario=request.user, pagado=False)
        serializer = AdminPaqueteSerializer(paquetes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_autos(request):
    if request.method == 'GET':
        autos = Autos.objects.all()
        serializer = AutoSerializer(autos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hoteles(request):
    if request.method == 'GET':
        hoteles = Hoteles.objects.all()
        serializer = HotelSerializer(hoteles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_vuelos(request):
    if request.method == 'GET':
        vuelos = Vuelos.objects.all()
        serializer = VueloListSerializer(vuelos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_asientos_vuelo(request, vuelo_id):
    if request.method == 'GET':
        asientos = Asientos.objects.filter(vuelo_id=vuelo_id)
        serializer = AsientoSerializer(asientos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_aviones(request):
    if request.method == 'GET':
        aviones = Aviones.objects.all()
        serializer = AvionSerializer(aviones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_asientos(request):
    if request.method == 'GET':
        asientos = Asientos.objects.all()
        serializer = AsientoSerializer(asientos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_pagos(request):
    if request.method == 'GET':
        pagos = Pagos.objects.all()
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_paises(request):
    if request.method == 'GET':
        paises = Paises.objects.all()
        serializer = PaisSerializer(paises, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_ciudades(request):
    if request.method == 'GET':
        ciudades = Ciudades.objects.all()
        serializer = CiudadSerializer(ciudades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])  # Mejor usar autenticación
def get_paquetes_en_venta(request):
    if request.method == 'GET':
        paquetes = Paquetes.objects.filter(
            id_usuario__is_staff=True,
            descripcion__isnull=False
        ).exclude(descripcion='')
        serializer = AdminPaqueteSerializer(paquetes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def buscar_hoteles(request):
    search = request.GET.get('search', '').strip()

    ciudades = Ciudades.objects.filter(
        Q(nombre__icontains=search) | Q(pais__nombre__icontains=search)
    ).select_related('pais').distinct()

    resultado = []
    for ciudad in ciudades:
        resultado.append({
            'id_ciudad': ciudad.id,
            'ciudad_nombre': ciudad.nombre,
            'pais_nombre': ciudad.pais.nombre
        })

    return Response(resultado, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_paquetes_pendientes(request):
    if request.method == 'GET':
        if not request.user.is_staff:
            return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)
        paquetes = Paquetes.objects.filter(pagado=False)
        serializer = AdminPaqueteSerializer(paquetes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ver_facturas_a_cobrar(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    ordenar_por = request.GET.get('ordenar_por', '').lower()

    # 1. Facturas pagadas (facturas reales)
    facturas_pagadas = Facturas.objects.select_related('pago__paquete__id_usuario')

    facturas_a_cobrar = Paquetes.objects.filter(
        pagado=False,
        id_usuario__is_staff=False 
    )

    if ordenar_por == 'fecha':
        facturas_pagadas = facturas_pagadas.order_by('-fecha_factura')
        facturas_a_cobrar = facturas_a_cobrar.order_by('-id')
    elif ordenar_por == 'cliente':
        facturas_pagadas = facturas_pagadas.order_by('pago__paquete__id_usuario__nombre_usuario')
        facturas_a_cobrar = facturas_a_cobrar.order_by('id_usuario__nombre_usuario')

    # Serializar resultados
    serializer_pagadas = FacturaSerializer(facturas_pagadas, many=True)
    serializer_pendientes = FacturaPendienteSerializer(facturas_a_cobrar, many=True)

    return Response({
        "facturas_pagadas": serializer_pagadas.data,
        "facturas_a_cobrar": serializer_pendientes.data
    }, status=status.HTTP_200_OK)



#Puts
    



#Deletes
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_paquete(request, paquete_id):
    try:
        paquete = Paquetes.objects.get(id=paquete_id, id_usuario=request.user)
    except Paquetes.DoesNotExist:
        return Response({"error": "Paquete no encontrado o no te pertenece"}, status=status.HTTP_404_NOT_FOUND)

    if paquete.pagado:
        return Response({"error": "No se puede eliminar un paquete que ya fue pagado"}, status=status.HTTP_400_BAD_REQUEST)

    if not request.user.is_staff:
        try:
            carrito = Carritos.objects.get(id_usuario=request.user)
            total_carrito = Decimal(carrito.total)
            total_paquete = Decimal(paquete.total)
            
            if total_carrito >= total_paquete:
                carrito.total = total_carrito - total_paquete
            else:
                carrito.total = Decimal('0.00')
            carrito.save()
        except Carritos.DoesNotExist:
            pass 

    paquete.delete()
    return Response({"message": "Paquete eliminado correctamente"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conseguir_paquetes_en_venta(request):

    if request.method == 'GET':
        paquetes = Paquetes.objects.all()
        serializer = AdminPaqueteSerializer(paquetes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



def generar_mensaje_factura(usuario, paquete, factura):
    return f"""
                Hola {usuario.nombre_usuario},

                Gracias por tu compra. Te enviamos los detalles de tu factura:

                --- PAQUETE ---
                Descripción: {paquete.descripcion or 'Sin descripción'}
                Personas: {paquete.personas}
                Vuelo Ida: {paquete.vuelo_ida}
                Vuelo Vuelta: {paquete.vuelo_vuelta}
                Hotel: {paquete.hotel or 'Sin hotel'}
                Auto: {paquete.auto or 'Sin auto'}
                Total: ${paquete.total}

                --- FACTURA ---
                Razón social: {factura.razon_social}
                CUIL: {factura.cuil}
                Dirección: {factura.calle} {factura.numero_calle}, Piso {factura.piso or '-'}, Dpto {factura.departamento or '-'}
                Ciudad: {factura.ciudad}
                Provincia: {factura.provincia}
                Fecha: {factura.fecha_factura.strftime('%Y-%m-%d %H:%M')}

                Gracias por confiar en nosotros.

                Tu Agencia de Viajes
                """


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail

from decimal import Decimal

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def realizar_pago(request):
    usuario = request.user
    paquete_id = request.data.get('reserva_id')
    factura_data = {
        key: request.data.get(key)
        for key in ['razon_social', 'cuil', 'provincia', 'ciudad', 'calle', 'numero_calle', 'piso', 'departamento']
    }

    if not paquete_id:
        return Response({'error': 'Falta el ID del paquete'}, status=status.HTTP_400_BAD_REQUEST)

    if any(value is None for value in factura_data.values()):
        return Response({'error': 'Faltan datos de la factura'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        paquete = Paquetes.objects.get(id=paquete_id, id_usuario=usuario.id)
    except Paquetes.DoesNotExist:
        return Response({'error': 'Paquete no encontrado para este usuario'}, status=status.HTTP_404_NOT_FOUND)

    pago = Pagos.objects.create(
        paquete=paquete,
        monto=paquete.total,
        estado='COMPLETADO'
    )

    factura_serializer = FacturaSerializer(data={**factura_data, 'pago': pago.id})
    if not factura_serializer.is_valid():
        return Response(factura_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    factura = factura_serializer.save()

    for asiento in paquete.asiento_ida.all():
        asiento.reservado = True
        asiento.save()
    for asiento in paquete.asiento_vuelta.all():
        asiento.reservado = True
        asiento.save()

    paquete.pagado = True
    paquete.save()

    try:
        carrito = Carritos.objects.get(id_usuario=usuario)
        total_carrito = Decimal(carrito.total)
        total_paquete = Decimal(paquete.total)

        nuevo_total = total_carrito - total_paquete
        carrito.total = nuevo_total if nuevo_total >= 0 else Decimal('0.00')
        carrito.save()
    except Carritos.DoesNotExist:
        pass

    Historica.objects.create(
        paquete=paquete,
        pago=pago,
        factura=factura
    )

    try:
        mensaje = generar_mensaje_factura(usuario, paquete, factura)
        send_mail(
            subject='Factura de tu compra - Agencia de Viajes',
            message=mensaje,
            from_email=None,
            recipient_list=[usuario.correo],
            fail_silently=False
        )
    except Exception as e:
        return Response({'error': f'Error al enviar el email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'success': 'Pago realizado, factura emitida y correo enviado.'}, status=status.HTTP_200_OK)



#Ultimos detalles

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def admin_dashboard(request):
    total_usuarios = Usuarios.objects.filter(is_staff=False).count()
    total_paquetes = Paquetes.objects.count()
    paquetes_pagados = Paquetes.objects.filter(pagado=True).count()
    ingresos_totales = Pagos.objects.filter(estado='COMPLETADO').aggregate(total=Sum('monto'))['total'] or 0
    total_hoteles = Hoteles.objects.count()
    total_autos = Autos.objects.count()
    total_aviones = Aviones.objects.count()

    return Response({
        'total_usuarios': total_usuarios,
        'total_paquetes': total_paquetes,
        'paquetes_pagados': paquetes_pagados,
        'ingresos_totales': round(float(ingresos_totales), 2),
        'total_hoteles': total_hoteles,
        'total_autos': total_autos,
        'total_aviones': total_aviones,
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def busqueda_general(request):
    query = request.GET.get('q', '').strip()

    if not query:
        return Response({'error': 'Falta el parámetro de búsqueda'}, status=400)

    # Ciudades
    ciudades = Ciudades.objects.filter(
        Q(nombre__icontains=query) | Q(pais__nombre__icontains=query)
    ).select_related('pais')

    # Hoteles
    hoteles = Hoteles.objects.filter(
        Q(ciudad__in=ciudades) | Q(nombre__icontains=query)
    ).select_related('ciudad')

    # Vuelos 
    vuelos = Vuelos.objects.filter(
        Q(origen__in=ciudades) | Q(destino__in=ciudades)
    ).select_related('origen', 'destino', 'avion')

    # Aviones
    aviones = Aviones.objects.filter(
        Q(vuelos__in=vuelos) | Q(nombre__icontains=query)
    ).distinct()

    # Paises
    paises = Paises.objects.filter(id__in=ciudades.values_list('pais_id', flat=True)).distinct()

    return Response({
        'ciudades': CiudadSerializer(ciudades, many=True).data,
        'paises': PaisSerializer(paises, many=True).data,
        'hoteles': HotelSerializer(hoteles, many=True).data,
        'vuelos': VueloListSerializer(vuelos, many=True).data,
        'aviones': AvionSerializer(aviones, many=True).data,
    }, status=200)



#UPDATES
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_vuelo(request, vuelo_id):
    if not request.user.is_staff:
        return Response({"error": "No autorizado"}, status=403)
    try:
        vuelo = Vuelos.objects.get(id=vuelo_id)
    except Vuelos.DoesNotExist:
        return Response({"error": "Vuelo no encontrado"}, status=404)

    serializer = VueloListSerializer(vuelo, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Vuelo actualizado correctamente"})
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_paquete(request, paquete_id):
    try:
        paquete = Paquetes.objects.get(id=paquete_id)
        if not request.user.is_staff and paquete.id_usuario != request.user:
            return Response({"error": "No autorizado"}, status=403)
    except Paquetes.DoesNotExist:
        return Response({"error": "Paquete no encontrado"}, status=404)

    serializer = PaqueteSerializer(paquete, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Paquete actualizado correctamente"})
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_hotel(request, hotel_id):
    if not request.user.is_staff:
        return Response({"error": "No autorizado"}, status=403)
    try:
        hotel = Hoteles.objects.get(id=hotel_id)
    except Hoteles.DoesNotExist:
        return Response({"error": "Hotel no encontrado"}, status=404)

    serializer = HotelSerializer(hotel, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Hotel actualizado correctamente"})
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_auto(request, auto_id):
    if not request.user.is_staff:
        return Response({"error": "No autorizado"}, status=403)
    try:
        auto = Autos.objects.get(id=auto_id)
    except Autos.DoesNotExist:
        return Response({"error": "Auto no encontrado"}, status=404)

    serializer = AutoSerializer(auto, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Auto actualizado correctamente"})
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_avion(request, avion_id):
    if not request.user.is_staff:
        return Response({"error": "No autorizado"}, status=403)
    try:
        avion = Aviones.objects.get(id=avion_id)
    except Aviones.DoesNotExist:
        return Response({"error": "Avión no encontrado"}, status=404)

    serializer = AvionSerializer(avion, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Avión actualizado correctamente"})
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_pais(request, pais_id):
    if not request.user.is_staff:
        return Response({"error": "No autorizado"}, status=403)
    try:
        pais = Paises.objects.get(id=pais_id)
    except Paises.DoesNotExist:
        return Response({"error": "País no encontrado"}, status=404)

    serializer = PaisSerializer(pais, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "País actualizado correctamente"})
    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def actualizar_ciudad(request, ciudad_id):
    if not request.user.is_staff:
        return Response({"error": "No autorizado"}, status=403)
    try:
        ciudad = Ciudades.objects.get(id=ciudad_id)
    except Ciudades.DoesNotExist:
        return Response({"error": "Ciudad no encontrada"}, status=404)

    serializer = CiudadSerializer(ciudad, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Ciudad actualizada correctamente"})
    return Response(serializer.errors, status=400)
