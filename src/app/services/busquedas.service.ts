import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

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

  buscar(                                                     // petición de busqueda al backend
    tipo:'usuarios'|'medicos'|'hospitales',                   // recibe el tipo
    termino: string = ''                                      // recibe el término de la busqueda
  ){

    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`        // http://localhost:3005/api/todo/coleccion/tipo
    return this.http.get<any[]>( url, this.headers )                         // petición al backend
              .pipe( 
                map((resp: any) => {  // Esta respuesta es un [] de objetos pero no es una instancia de Usuario que podamos manjear en el html
                  switch (tipo) {
                    case 'usuarios':
                      return this.transformarUsuarios(resp.resultados)  // Este array es ahora de instancias de Usuario
                  
                    default:
                      return[];
                  }
                } ))                       
  }
}
