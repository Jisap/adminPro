import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router ){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

      return this.usuarioService.validarToken()      // El guard devolverá un true si existe respuesta positiva del backend                                             
        .pipe(                                       // transformamos la respuesta    
          tap( estaAutenticado => {                  // con un efecto secundario que será generar estaAutenticado = true  
            if( !estaAutenticado ){                  // Sino existe estaAutenticado ( validarToken = false) 
              this.router.navigateByUrl('/login')    // redirección a login
            }
          })
        );// Si estaAutenticado = true continua con la carga de las rutas hijas de dashboard
    }
  
}
