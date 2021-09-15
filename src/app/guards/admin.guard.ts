import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router){

}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {

      if( this.usuarioService.role === 'ADMIN_ROLE'){  // Si el role del usuarioService es admin_role el guard devuelve true
        return true
      }else{
        this.router.navigateByUrl('/dashboard');      // Redirección al dashboard
        return false                                  // y respuesta false
      }

    //return (this.usuarioService.role === 'ADMIN_ROLE' ) ? true : false;
  }
  
}
