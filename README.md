<h1>
Proyecto final curso-taller de 
<a href="http://sailsjs.com"><img alt="Sails.js logo" src="http://balderdashy.github.io/sails/images/logo.png" title="Sails.js" height="50"/></a>
</h1>

## Objetivo 

Se busca una plataforma web donde alumnos se registren voluntariamente en el sistema para dar asesorías
sobre una o más asignaturas del Plan de Estudios de la Escuela Nacional Preparatoria. Un alumno puede ingresar
y solicitar una asesoría, agendando cita en un salón o laboratorio del plantel.

## Requerimientos
* NodeJS >= 8.11
* SailsJS >= 1.0.2

## Instalación
**Con [node](http://nodejs.org) [instalado](http://nodejs.org/en/download):**
```sh
# Descargar ultima version estable de sails 
$ npm install sails -g
```
* Si ocurre un error durante la instlación es probable que se deba a falta de permisos, se puede corregir corriendo el siguiente comando:
```sh
# Descargar ultima version estable de sails con permisos de superusuario
$ sudo npm install sails -g
```

## Iniciar plataforma web
* **Descargar proyecto**

    * Con SSH
    ```sh
    git clone git@github.com:adrianrdz9/tutorias.git 
    ```
    * Con HTTPS
    ```sh
    git clone https://github.com/adrianrdz9/tutorias.git
    ```
* **Entrar al directorio del proyecto**
    ```sh
    cd ruta/a/carpeta/tutorias/
    ```
* **Instalar dependecias del proyecto**
    ```sh
    npm install
    ```
* **Iniciar servidor**
    ```sh
    sails lift
    ```

## Uso
La cuenta de administrador se crea automaticamente con las siguientes credenciales (pueden ser cambiadas despues de iniciar sesión):
* Numero de cuenta: 312000000
* Contraseña: admin

El administrador es el encargado de crear las materias para que los tutores ofrezcan tutorias.
Cualquier usuario se puede convertir en tutor, para ello deben de iniciar sesion y en el menu desplegable con su nombre deben de dar clic en "Hacerme tutor".

Los tutores pueden ofrecer tutorias en cualquier materia que este disponible y pueden elegir su o sus horarios de disponibilidad asi como cupo para alumnos y lugar donde será la tutoria. También pueden elegir a que alumnos aceptar y a quienes no y pueden ver a quienes han aceptado y a quienes han rechazado.

Los usuarios que deseen tomar alguna tutoria deberan estar registrados y buscar entre las tutorias disponibles, elegir un horario y esperar a ser aceptados, el tutor sera notificado en cuanto la solicitud sea realizada y el usuario sera notificado con la eleccion que haga el tutor. Para consultar las tutorias en las que el usuario esta inscrito, puede ir al calendario en el menu desplegable con su nombre y la opcion calendario. En el calendario podra consultar tutorias pasadas y futuras y ver detalles al dar clic en el dia.

Los usuarios registrados (incluidos tutores y administrador) puden actualizar algunos de sus datos, para ello deberan ir al menu desplegable con su nombre y dar clic en actualizar mi cuenta. 








## License

[GNU General Public License v3.0](https://opensource.org/licenses/GPL-3.0) 
