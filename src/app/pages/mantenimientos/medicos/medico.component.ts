import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute) // Proporciona acceso a información (id) sobre una ruta asociada 
               { }                                     // con un componente que se carga

  ngOnInit(): void {
    
    this.activatedRoute.params                     // Al cargar el componente nos subscribios a los params que lleve en la ruta
      .subscribe( ({ id } )=> {                    // Obtenemos el id definido en pages.routing
      this.cargarMedico( id );                     // y llamamos al método cargarMedico con ese id
    })                                             // que llamará al medicoService para que obtenga la info del medico seleccionado

    
    this.medicoForm = this.fb.group({              // Al arrancar el componente medico configuramos el formulario
        nombre: [ '', Validators.required ],
        hospital:[ '', Validators.required ],
    })
    this.cargarHospitales()                        // Cargamos los hospitales de la bd

    this.medicoForm.get('hospital').valueChanges   // Nos subscribimos a los cambios en el valor del hospital seleccionado
      .subscribe( hospitalId => {                  // valor que en el html es el hospital._id
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );// Buscamos dentro de hospitales[]
      });                                                                             // un hospital(h) cuya id (h._id) = hospitalId
  }                                                                                   // Este hospitalSeleccionado se usará en el html 
  
  cargarMedico(id:string){

    if ( id === 'nuevo' ){                                   // Si cargamos el componente sin seleccionar un medico (boton crear medico)
      return                                                 // no hay que cargar nada
    }

    this.medicoService.obtenerMedicoPorId( id )              // Obtenemos el medico según id
      .pipe(
        delay(100))  
      .subscribe( medico => { 
        this.medicoSeleccionado = medico;                    // Damos valor a medicoSeleccionado con este medico --> ngIf
        const { nombre, hospital:{ _id } } = medico;         // Desestructuramos el nombre y el id del hospital del medico
        this.medicoForm.setValue({ nombre, hospital: _id})   // Establecemos los valores del formulario con el medico obtenido del backend
      }, error => {                                          // Si hay un error porque se escribio mal el id
        console.log(error)
        return this.router.navigateByUrl(`/dashboard/medicos`)  // redirección al componente medicos
      })
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {      // El servicio nos devuelve un ok y un [] de {} llamado hospitales
        this.hospitales = hospitales;
      })
  }

  guardarMedico() {                                            // Función para guardar un nuevo médico en bd
    
    const { nombre } = this.medicoForm.value;

    if( this.medicoSeleccionado){                              // Si existe un medicoSeleccionado actualizamos  
      //actualizar
      const data = {                                           // Datos a actualizar
        ...this.medicoForm.value,                              // nombre y hospital del formulario
        _id: this.medicoSeleccionado._id                       // id del medico
      }
      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {
          console.log(resp)
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        })
    }else{                                                        // Sino existe un medicoSeleccionado creamos
      //crear
      const { nombre } = this.medicoForm.value;
      this.medicoService.crearMedico( this.medicoForm.value )     // Usamos los valores dados por el formulario en el servicio 
        .subscribe( (resp:any) => {                               // La Resp contiene el ok y el médico creado con sus propiedades 
          Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');  // Mensaje de creación del médico
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`); // Redirección a la página del médico creado 
        })
    }
    
  }

  
}
