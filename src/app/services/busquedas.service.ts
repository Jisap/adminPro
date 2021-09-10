import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  private transformarUsuarios(resultados: any[]): Usuario[] {  // Transformamos con pipe y map la resp del backend [] de objetos
    return resultados.map(                                     // Crearemos una instancia de Usuario por cada elemento del []
      user => new Usuario( user.nombre,
                           user.email,
                           '',
                           user.img,
                           user.google,
                           user.role,
                           user.uid
      )
    )
  }

  private transformarHospitales(resultados: any[]): Hospital[] {  // Casteamos el resultado de la busqueda a tipo Hospital[]
    return resultados
  }

  private transformarMedicos ( resultados: any[]): Medico[]{  // Casteamos el resultado de la busqueda a tipo Medico[]
    return resultados
  }

  buscar(                                                     // petición de busqueda al backend
    tipo: 'usuarios' | 'medicos' | 'hospitales',              // recibe el tipo y el término de la busqueda
    termino: string = ''                                      
  ){

    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`        // http://localhost:3005/api/todo/coleccion/tipo
    return this.http.get<any[]>( url, this.headers )                         // petición al backend
              .pipe( 
                map((resp: any) => {  // Esta respuesta es un [] de objetos pero no es una instancia de Usuario que podamos manejear en el html
                  switch (tipo) {
                    case 'usuarios':
                      return this.transformarUsuarios(resp.resultados)    // Este array es ahora de instancias de Usuario
                    
                    case 'hospitales':
                      return this.transformarHospitales(resp.resultados)  // Aqui no es necesario transformar como en usuarios
                                                                          // porque no necesitamos cambiar el html 
                    case 'medicos':
                      return this.transformarMedicos(resp.resultados)     // Idem

                    default:
                      return[];
                  }
                } ))                       
  }
}
