import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;
  

  constructor( public modalImagenService: ModalImagenService,
               public fileUploadService: FileUploadService,) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;                   // Cuando se cierra el modal reseteamos la imagen previamente seleccionada 
    this.modalImagenService.cerrarModal(); // Pone _ocultarModal en true
  }

  cambiarImagen(file: File) {  // Recibe el archivo seleccionado desde el html y lo muestra 
    this.imagenSubir = file;   // La prop imagenSubir toma ese valor. 

    if (!file) {                                        // Si no hay imagen
      return this.imgTemp = null;                       // imgTemp será null -> ngIf
    };                                                  // Pero si si hay imagen a subir procederemos a leerla

    const reader = new FileReader()                     // El objeto FileReader permite que las aplicaciones web lean ficheros File/blob
    reader.readAsDataURL(file);                         // readAsDataURL es usado para leer el contenido del especificado Blob o File
    reader.onloadend = () => {                          // Cuando termine de leer el file
      this.imgTemp = reader.result;                     // lo almacenamos en una variable temporal -> ngIf
    }
  }

  subirImagen() {                                                          // Subida de imagen al backend desde el modal
    
    const id = this.modalImagenService.id;                                 // Si subimos la imagen es que previamente abrimos el modal (abrirModal())
    const tipo = this.modalImagenService.tipo;                             // y se cargaron la id y el tipo con el modalImagenService 

    console.log(id, tipo)
    
    this.fileUploadService                                                 // hacemos la petición con el servicio 
      .actualizarFoto(this.imagenSubir, tipo, id)                          // que usa su método y le pasamos lo que necesita: archivo, tipo y el id
      .then(img => {                                                       // la respuesta del servicio es el nombre del archivo subido a la bd
        
        this.modalImagenService.nuevaImagen.emit(img);                     // Emitimos la url de la nueva imagen
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        this.cerrarModal()
      }).catch(err => {
        Swal.fire('Error', err.error.msg, 'error')
      })
  }
}
