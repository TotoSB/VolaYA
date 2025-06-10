# Bienvenido a VolaYa!

Hola! Somos **VolaYa**. Una empresa ficticia creada por 4 alumnos de la Técnica 7 De Lomas De Zamora (E.E.S.T.N 7), creamos este proyecto para participar en las olimpiadas nacional de Programación.


# Ejecutar proyecto

Para ejecutar el proyecto vamos a seguir los siguientes pasos:

## Clonar en Local

Vamos a tener que descargar en nuestro equipo:
<ul>
	<li>Git <a href="https://git-scm.com/downloads">Instalar</a></li>
	<li>Node.JS <a href="https://nodejs.org/en/download">Instalar</a></li>
	<li>Python <a href="https://www.python.org/downloads/">Instalar</a>
	</li>
</ul> 

Una vez instalado esto debemos de clonar nuestro repositorio con el siguiente codigo en consola:
<br>
<code>git clone https://github.com/TotoSB/VolaYA.git</code>
> [!IMPORTANT] 
> Para correr el proyecto como tal se debe de tener las dos capas corriendo Cliente y Servidor

## Ejecutar (Cliente)
Debemos de dirigirnos a la carpeta "Frontend"
<br>
<code>cd frontend</code>
<br>
Luego debemos instalar los paquetes NPM con el siguiente comando:
<br>
<code>npm install</code>
<br>
y luego corremos el proyecto VITE con el siguiente comando
<br>
<code>npm run dev</code>

## Ejecutar (Servidor)
Debemos de dirigirnos a la carpeta "Backend"
<br>
<code>cd backend</code>
<br>
Luego creamos un entorno virtual para instalar las librerias del servidor:
<br>
<code>python -m venv venv</code>
<br>
Ejecutamos el entorno virtual:
<br>
<code>venv/scripts/activate</code>
<br>
y luego corremos instalamos las librerias del proyecto
<br>
<code>pip install -r requirements.txt</code>
<br>
Luego ya podemos correr nuestro proyecto servidor con los siguientes comandos
<br>
<code>py manage.py runserver</code>

> #### Credenciales del superusuario (Jefe de ventas)
>
> - correo: elmundodetoto2006@gmail.com
> - contraseña: Vuelaya123