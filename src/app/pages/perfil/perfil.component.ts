import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: []
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup; // Formulario del perfilForm
  public usuario: Usuario;      // Instancia de Usuario
  public imagenSubir: File;
  public imgTemp:any = null;      

  constructor(private fb: FormBuilder,                      // Inyectamos el servicio de construcción de formularios de Angular
              private usuarioService: UsuarioService,       // Inyectamos el servicio de usuarioService
              private fileUploadService: FileUploadService, // Inyectamos el servicio de subida de archivos
              ) {       
  
      this.usuario = usuarioService.usuario;                // Le damos valor a la instancia usuario con el valor del usuario logueado 
  } 

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required ],                        // Recordar que nombre es lo que se pone luego en el formControlName del html en el input
      email: [ this.usuario.email, [ Validators.required, Validators.email ]]      // Aquí rellenamos el formulario con la info del usuario logueado -> luego se cambiará
    });                                                                            // y establecemos las reglas de validación
  }

  actualizarPerfil(){
    
    this.usuarioService.actualizarPerfil( this.perfilForm.value )  // Se actualiza la bd con los valores del formulario
      .subscribe( resp => {
        const { nombre, email } = this.perfilForm.value;           // Actualizamos la información del usuario logueado en el usuarioService 
        this.usuario.nombre = nombre;                              // Así cambian los valores del html donde se use las referencias al usuario
        this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios fueron guardados', 'success')
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error')
        
      })
  }

  cambiarImagen( file:File ){  // Recibe el archivo seleccionado desde el html
    this.imagenSubir = file;   // La prop imagenSubir toma ese valor. 
  
    if ( !file ){                                       // Si no hay imagen
      return this.imgTemp = null;                       // imgTemp será null -> ngIf
    };                                                  // Pero si si hay imagen a subir procederemos a leerla

    const reader = new FileReader()                     // El objeto FileReader permite que las aplicaciones web lean ficheros File/blob
    reader.readAsDataURL(file);                         // readAsDataURL es usado para leer el contenido del especificado Blob o File
    reader.onloadend = () => {                          // Cuando termine de leer el file
      this.imgTemp = reader.result;                     // lo almacenamos en una variable temporal -> ngIf
    }
  }

  subirImagen(){                                                         // Subida de imagen al backend
    this.fileUploadService                                               // hacemos la petición con el servicio 
      .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )  // que usa su método y le pasamos lo que necesita: archivo, tipo y el id
      .then(img => {                                                     // la respuesta del servicio es el nombre del archivo subido a la bd
        this.usuario.img = img                                           // igualamos la instancia de la imagen del usuario logueado con dicha imagen subida
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      }).catch( err => {
        Swal.fire('Error', err.error.msg, 'error')
      })                            
    }                                                                    
}                                                                        // se actualiza así la imagen en todos los sitios del html donde aparezca
