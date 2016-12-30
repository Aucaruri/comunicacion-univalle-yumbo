Para instalar el proyecto es necesario tener los siguientes requerimientos:
-Node.Js que puede ser descargado de https://nodejs.org/es/download/ o puede usarse el instalador adjunto
-MySql que puede usarse la versión que viene instalada en XAMPP

Primero se deben modificar el archivo script.sql que viene adjunto para que la base de datos ya tenga un usuario administrador.
Para ello se debe ir a la ultima linea del archivo y cambiar los datos a ingresar para las columnas nombres, apellidos y correo,
la contraseña por defecto es 123456789, pero el usuario puede cambiarla despues en la opción de ¿Olvidó su contraseña?

Después se debe cargar este archivo a la base de datos.

Luego de tener lista la base de datos y de haber instalado Node.Js es necesario inicializar el proyecto, para ello se debe abrir
una terminal de consola (cmd) y ubicarse en la carpeta del proyecto de modo que quede:
.../intranet 17.12.2016-0040>
aqui se ejecutara el comando npm install, que instalara todas las dependencias de Node.Js que se necesitan.
Al final de haberse ejecutado el comando ya podemos encender el servidor, esto lo hacemos con el comando nodemon app.js
ahora en el navegador se coloca la dirección localhost:8080 y debera aparecer la pantalla de inicio.