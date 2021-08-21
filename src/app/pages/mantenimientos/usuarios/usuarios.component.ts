import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario [] = [];
  public usuariosTemp: Usuario[] = [];
  public desde:number = 0;
  public cargando: boolean = false;
  public imgSubs: Subscription;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService ) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();                        // Si actualizó la imagen se cancela la subcripción al observable
  }

  ngOnInit(): void {

    this.cargarUsuarios();                              // Cargamos los usuarios de bd por primera vez al iniciar este componente
    this.imgSubs = this.modalImagenService.nuevaImagen  // Nos subscribimos al observable de nuevaImagen por si cambio, y si lo hace recargamos
      .pipe(                                            // el estado de los usuarios.
        delay(100)
      )
      .subscribe( img => {this.cargarUsuarios()} )   
  }                                                  

  cargarUsuarios(){                                 // No pasa nada si ponemos el mismo nombre en el servicio y el componente
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)  // Cargamos los usuarios existentes en bd al cambiar de página
      .subscribe(({ total, usuarios }) => {         // El backend nos devuelve el total de usuarios y un array con los usuarios registrados a visualizar según el desde
        this.totalUsuarios = total;                 // En la var totalUsuarios le asignamos el valor dado por el backend
        this.usuarios = usuarios;                   // en la var usuarios le asignamos el valor dado por el backend
        this.usuariosTemp=usuarios;
        this.cargando = false;
        this.longitudBusqueda = 0;
      })
  }

  cambiarPagina ( valor:number ){                   // Suma a "desde" el "valor" dado por el argumento
    this.desde += valor

    if( this.desde < 0){                            // El argumento "desde" no puede ser inferior a 0
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ){ // No se puede acceder a una página superior al numero total de usuarios
      this.desde -= valor;                          // En ese caso a "desde"(21) se le restará el valor para cumplir la condición.
    }

    this.cargarUsuarios();                          // Establecido el "desde" cargamos los usuarios que vamos a visualizar
  }

  public longitudBusqueda:number ;

  buscar( termino:any ){                                               // El evento que recibe esta función son los strings del input

    this.longitudBusqueda = (termino.target.value).length;             // Identificamos la longitud del string generado por el evento click

    if(((termino.target.value).length) === 0 ){                        // Si la caja de busqueda esta vacia
      return this.usuarios = this.usuariosTemp;                        // devolvemos los últimos usuarios cargados
    }

    this.busquedasService.buscar( 'usuarios', termino.target.value )   // Si no esta vacia, se envíael valor del evento al busquedasService
      .subscribe(resultados => {                                       // La respuesta sera un array de usuarios que cumplen el término de la busqueda
        this.usuarios = resultados                                     // igualamos a la prop usuarios: Usuario [] y esto redibuja el html
      })              
  } 

  eliminarUsuario( usuario: Usuario ){
    
    if( usuario.uid === this.usuarioService.uid){                                // Si el usuario generado por el html (logeado) = al de la bd
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');        // y quiere borrarse así mismo, mensaje de error
    }

    Swal.fire({
      title: '¿ Borrar usuario ?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,            // Mensaje de confirmación de borrado de un usuario
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {                                        // Si se pulso afirmativamente
        this.usuarioService.eliminarUsuario( usuario )                 // llamamos a eliminarUsuario que hace la petición al backend 
          .subscribe( resp => {                                        // Si hubo resp exitosa
            this.cargarUsuarios();                                     // recargamos los usuarios para que se redibuje el html
            Swal.fire(                                                 //  y mensaje de borrado definitivo
              'Deleted!',
              `${ usuario.nombre } fue eliminado correctamente.`,
              'success'
            )
          })
      }
    })
  }

  cambiarRole( usuario:Usuario){                      // Esta función activa guardarUsuario que actualiza el usuario en el backend
    this.usuarioService.guardarUsuario( usuario )
    .subscribe( resp => { 
      console.log(resp)
    })
  }

  abrirModal(usuario: Usuario) {                       // Llama al servicio del modal y pone en false _ocultarModal
    this.modalImagenService.abrirModal(                // También recupera la imagen del backend 
      'usuarios',                                      // Para ello obtenemos de Usuario el uid y la img y el tipo
       usuario.uid,                                     
       usuario.img
    );  
  }
}
