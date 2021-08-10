import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url; //localhost:3005/api/

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo:File,
    tipo: 'usuarios' | 'medicos' | 'hospitals',
    id: string){

    try {
        
      const url = `${ base_url }/upload/${ tipo }/${ id }`;   // url de la petición al backend 
      const formData = new FormData();                        // La interfaz FormData proporciona una manera sencilla de construir un conjunto de parejas clave/valor 
      formData.append('imagen', archivo);                     // que representan los campos de un formulario y sus valores, que pueden ser enviados fácilmente

      const resp = await fetch(url, {                         // Petición put de subida de un archivo
        method: 'PUT',
        headers:{
          'x-token': localStorage.getItem('token') || ''
        },
        body:formData
      });

      const data = await resp.json();                          // Respuesta en forma json
      
      if ( data.ok ){
        return data.nombreArchivo;
      }else{
        console.log(data);
        return false;
      }


    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
