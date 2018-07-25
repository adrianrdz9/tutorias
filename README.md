<h1>
Proyecto final curso-taller de 
<a href="http://sailsjs.com"><img alt="Sails.js logo" src="http://balderdashy.github.io/sails/images/logo.png" title="Sails.js" height="50"/></a>
</h1>

## Objetivo 

Se busca una plataforma web donde alumnos se registren voluntariamente en el sistema para dar asesorías
sobre una o más asignaturas del Plan de Estudios de la Escuela Nacional Preparatoria. Un alumno puede ingresar
y solicitar una asesoría, agendando cita en un salón o laboratorio del plantel.

## Dependencias
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
## License

[GNU General Public License v3.0](https://opensource.org/licenses/GPL-3.0) 