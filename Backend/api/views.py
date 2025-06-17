from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import Usuarios, Personas, Carritos, Reservas_usuario
import random
from django.core.mail import send_mail
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import math
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Q, F
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

@csrf_exempt  # Mercado Pago no enviará CSRF token
@api_view(['POST'])
def mercado_pago_webhook(request):
    if request.method == 'POST':
        payment_id = request.data.get('data', {}).get('id', None)
        payment_type = request.data.get('type', None)

        if payment_type == "payment" and payment_id:
            payment_info = sdk.payment().get(payment_id)
            status_mp = payment_info["response"]["status"]
            paquete_id = payment_info["response"]["metadata"].get("paquete_id")

            # Validar si el pago fue aprobado
            if status_mp == "approved" and paquete_id:
                # Acá llamás a tu función directamente o replicás la lógica
                return pago_paquete_aprobado_directo(paquete_id)

    return Response({"message": "Evento recibido"}, status=status.HTTP_200_OK)


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
@permission_classes([IsAuthenticated])
def crear_paquete(request):
    serializer = PaqueteSerializer(data=request.data)

    if serializer.is_valid():
        ciudad_salida = serializer.validated_data['ciudad_salida']
        ciudad_destino = serializer.validated_data['ciudad_destino']

        lat1 = float(ciudad_salida.latitud)
        lon1 = float(ciudad_salida.longitud)
        lat2 = float(ciudad_destino.latitud)
        lon2 = float(ciudad_destino.longitud)

        distancia_km = calcular_distancia_km(lat1, lon1, lat2, lon2)
        precio_por_km = 2000
        costo_total = distancia_km * precio_por_km

        auto = serializer.validated_data.get('auto')
        hotel = serializer.validated_data.get('hotel')

        dias = (serializer.validated_data['fecha_regreso'] - serializer.validated_data['fecha_salida']).days
        if auto:
            costo_total += auto.precio_dia * dias
        costo_total += hotel.precio_noche * dias

        serializer.save(total=costo_total, id_usuario=request.user)

        # Si no es staff, guardás la reserva y actualizás el carrito
        if not request.user.is_staff:
            carrito = Carritos.objects.get(id_usuario=request.user)
            carrito.total += Decimal(str(costo_total))
            carrito.save()

            Reservas_usuario.objects.create(
                usuario=request.user,
                paquete=serializer.instance
            )

        return Response({
            "message": "Paquete creado exitosamente",
            "costo_total": round(costo_total, 2)
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


def pago_paquete_aprobado_directo(paquete_id):
    try:
        paquete = Paquetes.objects.get(id=paquete_id)
    except Paquetes.DoesNotExist:
        return Response({"error": "Paquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    if paquete.pagado:
        return Response({"error": "El paquete ya ha sido pagado"}, status=status.HTTP_400_BAD_REQUEST)

    paquete.pagado = True
    paquete.save()

    carrito = Carritos.objects.get(id_usuario=paquete.id_usuario)
    carrito.total -= Decimal(str(paquete.total))
    carrito.save()

    factura_pago = Pagos.objects.create(
        paquete=paquete,
        monto=paquete.total,
        estado='COMPLETADO'
    )

    Historica.objects.create(
        paquete=paquete,
        pago=factura_pago
    )

    return Response({"message": "Pago procesado correctamente"}, status=status.HTTP_200_OK)

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
        serializer = PaqueteSerializer(paquetes, many=True)
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
@permission_classes([AllowAny])
def get_paquetes_en_venta(request):
    if request.method == 'GET':
        paquetes = Paquetes.objects.filter(id_usuario__is_staff=True)
        serializer = PaqueteSerializer(paquetes, many=True)
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
        serializer = PaqueteSerializer(paquetes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Método no permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ver_facturas_a_cobrar(request):
    if not request.user.is_staff:
        return Response({"error": "No tenés permisos para realizar esta acción."}, status=status.HTTP_403_FORBIDDEN)

    ordenar_por = request.GET.get('ordenar_por', '').lower()

    facturas = Facturas.objects.filter(pago__estado='PENDIENTE')

    if ordenar_por == 'fecha':
        facturas = facturas.order_by('-fecha_factura')
    elif ordenar_por == 'cliente':
        facturas = facturas.order_by('pago__paquete__id_usuario__nombre_usuario')

    serializer = FacturaSerializer(facturas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


#Puts

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def modificar_paquete(request, paquete_id):
    try:
        paquete = Paquetes.objects.get(id=paquete_id, id_usuario=request.user)
    except Paquetes.DoesNotExist:
        return Response({"error": "Paquete no encontrado o no te pertenece"}, status=status.HTTP_404_NOT_FOUND)

    if paquete.pagado:
        return Response({"error": "No se puede modificar un paquete ya pagado"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = PaqueteSerializer(paquete, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Paquete actualizado correctamente", "paquete": serializer.data}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



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

    paquete.delete()
    return Response({"message": "Paquete eliminado correctamente"}, status=status.HTTP_200_OK)