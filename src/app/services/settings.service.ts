import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');  // Apuntamos al script del index ppal que contiene el id=theme

  constructor() {  
    const url = localStorage.getItem('theme') || './assets/css/colors/default-dark.css'; // Rescatamos del localStorage el theme
    this.linkTheme.setAttribute('href', url);                                            // Lo aplicamos al href al que apuntamos
   }

  changeTheme(theme: string) {                       // Esta función esta en cada link de los themes
    const url = `./assets/css/colors/${theme}.css`;  // Contruimos el url
    this.linkTheme.setAttribute('href', url);        // Aplicamos al atributo href del nodo al que apuntabamos con el url seleccionado
    localStorage.setItem('theme', url);              // Cuando se pinche en ese href provocará el cambio de theme, despues guardamos en localStorage
  
    this.checkCurrentTheme()
  }

  checkCurrentTheme() {                                         // Esta función pone el check al tema seleccionado

    const links = document.querySelectorAll('.selector');       // Apuntamos a todos los links que contienen la clase selector;

    links.forEach(element => {                                  // Barremos la lista de links
      element.classList.remove('working');                      // A cada link le borramos la clase working preexistente si existe
      const btnThem = element.getAttribute('data-theme');       // Identificamos el valor de la clase 'data-theme' coincidente con el theme de cada link
      const btnThemeUrl = `./assets/css/colors/${btnThem}.css`  // Obtenemos la url de ese link 
      const currentTheme = this.linkTheme.getAttribute('href'); // Obtenemos el valor del theme almacenado en el localStorage

      if (btnThemeUrl === currentTheme) {                       // Si el tema uno de los links coincide con el almacenado...

        element.classList.add('working');                       // Le colocamos la clase working y aparecerá el check en el theme seleccionado.
      }

    });
  }
}
