import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private usuarioService: UsuarioService,  // Inyectamos el usuarioService para obtener la información del usuario conectado
                                                      
               private router: Router,) {              // Inyectamos el router para poder navegar al componente de busqueda global

    this.usuario = usuarioService.usuario;             // Obtenemos el perfil instanciado de usuario logueado con usuarioService
   }

  logout(){
    this.usuarioService.logout();
  }

  buscar( termino:string ) {
    if( termino.length === 0){
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);//Enviamos el término de busqueda al componente buscar
  }
}
