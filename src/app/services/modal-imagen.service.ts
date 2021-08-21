import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url; //http://localhost:3005/api

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;               // El modal no se muestra en principio
  public tipo: 'usuarios' | 'medicos' | 'hospitales';
  public id: string;
  public img: string ;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>(); //Instancia a un observable tipo string = url de la nueva imagen

  get ocultarModal(){
    return this._ocultarModal   // Getter de ocultarModal
  }

  abrirModal(                                               // Esta función muestra el modal y recupera la imagen del backend
    tipo: 'usuarios'|'medicos'|'hospitales',                // Desde usuarios.components se le envían los arg necesarios
    id: string,
    img: string = "x"  
  ){
    this._ocultarModal = false; 
    this.tipo = tipo; 
    this.id = id;
    
    if( img.includes( 'https' )){                            // Si la imagen es de google será la que tenga ese usuario de google
      this.img = img;
    } else {
      this.img =`${ base_url }/upload/${ tipo }/${ img }`;  // Pero si no es de google petición al backend para recuperarla
    }
    
    
    //this.img = img;
  }

  cerrarModal(){
    this._ocultarModal = true;  // Esta función oculta el modal
  }

  constructor() { }
}
