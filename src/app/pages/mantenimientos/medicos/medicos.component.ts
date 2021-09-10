import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';

import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }

  ngOnInit(): void {
  this.cargarMedicos()

    this.imgSubs = this.modalImagenService.nuevaImagen  // Nos subscribimos al observable de nuevaImagen por si cambio, y si lo hace recargamos
      .pipe(delay(100))                                 // el estado de los hospitales
      .subscribe(img => this.cargarMedicos())
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true
    this.medicoService.cargarMedicos()    // El servicio hace una petición get y nos devuelve un [] de medicos
      .subscribe( medicos => {            // La respuesta medicos se iguala con la prop definida como vacia 
        this.cargando = false;
        this.medicos = medicos;
      });
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal( 'medicos', medico.img, medico._id )
  }

  buscar( termino: string ){
    if (termino.length === 0) {                            // Si el input=0 devuelve todos los hospitales
      return this.cargarMedicos();
    }
    this.busquedasService.buscar('medicos', termino)       // Si el termino tiene contenido usamos el servicio enviando el tipo y lo que se busca
      .subscribe((resp: Medico[]) => {                     // La respuesta son los medicos que coinciden con el criterio de busqueda
        this.medicos = resp                                // Igualamos la resp con la prop medicos que redibuja el html 
      })                                                   // La resp viene como Usuario[] | Hospital[] asi que la definimos como de Medico[] 
  }

  borrarMedico( medico: Medico ){
    Swal.fire({
      title: '¿ Borrar usuario ?',
      text: `Esta a punto de borrar a ${medico.nombre}`,            // Mensaje de confirmación de borrado de un usuario
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {                                        // Si se pulso afirmativamente
        this.medicoService.borrarMedico( medico._id )                  // llamamos a eliminarUsuario que hace la petición al backend 
          .subscribe(resp => {                                         // Si hubo resp exitosa
            this.cargarMedicos();                                      // recargamos los usuarios para que se redibuje el html
            Swal.fire(                                                 //  y mensaje de borrado definitivo
              'Deleted!',
              `${medico.nombre} fue eliminado correctamente.`,
              'success'
            )
          })
      }
    })
  }
}
