import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent  {

  public usuario:Usuario;

  constructor( private usuarioService: UsuarioService) {  // Inyectamos el usuarioService para obtener la información del usuario conectado
    this.usuario = usuarioService.usuario;                // Obtenemos el perfil instanciado de usuario logueado con usuarioService
   }

  logout(){
    this.usuarioService.logout();
  }

}
