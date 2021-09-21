import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private usuarioService: UsuarioService,
               private router: Router ){}

  canLoad(
    route: Route, // Conjunto de rutas hijas
    segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    return this.usuarioService.validarToken()      // El canLoad devolverá un true si existe respuesta positiva del backend                                             
      .pipe(                                       // transformamos la respuesta    
        tap(estaAutenticado => {                   // con un efecto secundario que será generar estaAutenticado = true  
          if (!estaAutenticado) {                  // Sino existe estaAutenticado ( validarToken = false) 
            this.router.navigateByUrl('/login')    // redirección a login
          }
        })
      );// Si estaAutenticado = true continua con la carga de las rutas hijas de dashboard
  }


  canActivate(
    route: ActivatedRouteSnapshot, // estado de la ruta de un componente en un momento dado (params, url, data)
    state: RouterStateSnapshot){   // estado del router

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
