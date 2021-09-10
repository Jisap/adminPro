import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private http: HttpClient ) { }
  
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos() {                                                     // Función que nos devuelve un [] de Medicos

    const url = `${base_url}/medicos`                                   //http://localhost:3005/api/medicos

    return this.http.get(url, this.headers)                             // Petición al backend para obtener los medicos
      .pipe(
        map((resp: { ok: boolean, medicos: Medico[] }) => resp.medicos) // El tipado de la respuesta se define así
      )

  }

  obtenerMedicoPorId( id:string ){                                      // Función que nos devuelve un médico según su id

    const url = `${base_url}/medicos/${ id }`;                          //http://localhost:3005/api/medicos/ksjfkdhk2032kh2kh

    return this.http.get(url, this.headers)                             // Petición al backend para obtener el médico
      .pipe(
        map((resp: { ok: boolean, medico: Medico }) => resp.medico)     // El tipado de la respuesta se define así
      )
  }

  crearMedico( medico: {nombre:string, hospital:string}) { // Función para crear un medico que recibe un objeto tipo Medico que contiene
                                                           // el nombre y el hospital 
    const url = `${base_url}/medicos`                      //http://localhost:3005/api/medicos

    return this.http.post(url, medico, this.headers)       // Petición al backend para crear un medico, necesita el objeto medico en el body.


  }

  actualizarMedico( medico: Medico) {                 // Función para actualizar un medico que recibe un objeto tipo medico actualizado con su
                                                      // _id y su nombre
    const url = `${base_url}/medicos/${ medico._id }` //http://localhost:3005/api/medicos/ksjfkdhk2032kh2kh

    return this.http.put(url, medico, this.headers)   // Petición al backend para actualizar un medico, necesita el id en los args del url.


  }

  borrarMedico(_id: string) {                      // Función para borrar un medico

    const url = `${base_url}/medicos/${_id}`       //http://localhost:3005/api/medicos/ksjfkdhk2032kh2kh

    return this.http.delete(url, this.headers)     // Petición al backend para borrar un medico, necesita el _id en los args del url


  }
}
