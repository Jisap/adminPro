import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {  // El pipe puesto en el html transforma la información del hospitales.component
                                                    // Básicamente dado un string de la img y su tipo nos devuelve una url

  transform( img: string, tipo: 'usuarios'|'medicos'|'hospitales'): string {  // Recibe la img y el tipo
   
    if (!img) {                                        // Sino existe la imagen la url será la de no-image
      return `${base_url}/upload/usuarios/NoImage`
    } else if (img.includes('https')) {                // Si la imagen es de google  la img será la proporcionada por google
      return img;
    } else if (img) {                                  // Si la imagen no es de google la url será la proporcionada por el tipo
      return `${base_url}/upload/${tipo}/${img}`
    } else {                                           // Sino es cualquiera de las anteriores url = no-image 
      return `${base_url}/upload/usuarios/NoImage`
    }
  }

}
