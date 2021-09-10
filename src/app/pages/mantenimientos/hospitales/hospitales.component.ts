import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;


  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService, ) { }
  
  ngOnDestroy(): void {
      this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();                            // Cargamos los hospitales de bd por primera vez al iniciar este componente
    this.imgSubs = this.modalImagenService.nuevaImagen  // Nos subscribimos al observable de nuevaImagen por si cambio, y si lo hace recargamos
      .pipe(delay(100))                                 // el estado de los hospitales
      .subscribe( img => this.cargarHospitales())
  }

  buscar( termino: string) {                              // Función de busqueda de hospitales
    if( termino.length === 0 ) {                          // Si el input=0 devuelve todos los hospitales
      return this.cargarHospitales();
    }
    this.busquedasService.buscar( 'hospitales', termino )  // Si el termino tiene contenido usamos el servicio enviando el tipo y lo que se busca
      .subscribe( (resp:Hospital[]) => {                   // La respuesta son los hospitales que coinciden con el criterio de busqueda
        this.hospitales = resp                             // Igualamos la resp con la prop hospitales que redibuja el html 
      })                                                   // La resp viene como Usuario[] | Hospital[] asi que la definimos como de Hospital[]  
  }  

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales()  // Se utiliza el servicio para obtener el [] hospitales 
      .subscribe(hospitales => {           
        this.cargando = false;
        this.hospitales = hospitales;
      })
  }

  guardarCambios( hospital:Hospital){
    this.hospitalService.actualizarHospital( hospital.nombre, hospital._id )
      .subscribe( resp => {
        Swal.fire( 'Actualizado', hospital.nombre, 'success' );
      })
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital( hospital._id )
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      })
  }

  async abrirSweetAlert(){                                        // Creación de un nuevo hospital
    const { value = "" } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })
    
    if( value.trim().length > 0){                                // Si el input tiene contenido
      this.hospitalService.crearHospital(value)                  // Petición al backend para crear un hospital, necesita el nombre en el body
        .subscribe( ( resp:any ) => {                            // Nos subscribimos a la respuesta
          this.hospitales.push( resp.hospital )                  // Introducimos en hospitales[] el nuevo hospital creado
        })
    }

    console.log(value);
  }
  
  abrirModal( hospital:Hospital ){

    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img )
  }

}
