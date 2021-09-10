import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http:HttpClient) { }

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

  cargarHospitales() {                         // Función que nos devuelve un [] de hospitales

    const url = `${base_url}/hospitales`       //http://localhost:3005/api/hospitales

    return this.http.get(url, this.headers)    // Petición al backend para obtener los hospitales
              .pipe(
                map( ( resp:{ ok: boolean, hospitales: Hospital[] }) => resp.hospitales ) // El tipado de la respuesta se define así
              )

  }

  crearHospital( nombre: string ) {                         // Función para crear un hospital

    const url = `${base_url}/hospitales`                    //http://localhost:3005/api/hospitales

    return this.http.post(url, { nombre }, this.headers)    // Petición al backend para crear un hospital, necesita el nombre en el body.
      

  }

  actualizarHospital(nombre: string, _id:string ) {         // Función para actualizar un hospital

    const url = `${base_url}/hospitales/${ _id }`           //http://localhost:3005/api/hospitales/ksjfkdhk2032kh2kh

    return this.http.put(url, { nombre }, this.headers)    // Petición al backend para actualizar un hospital, necesita el id en los args del url.


  }

  borrarHospital( _id: string ) {                  // Función para actualizar un hospital

    const url = `${base_url}/hospitales/${_id}`    //http://localhost:3005/api/hospitales/ksjfkdhk2032kh2kh

    return this.http.delete(url, this.headers)     // Petición al backend para borrar un hospital, necesita el _id en los args del url


  }
}
