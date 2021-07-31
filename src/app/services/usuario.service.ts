import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';//Se utiliza para realizar efectos secundarios para las notificaciones de la fuente observable.
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';





const base_url = environment.base_url

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  public auth2: any;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {
    
      this.googleInit();  // Solo tendremos una instancia de este googleInit cada vez que se recarga la app
   }

  googleInit(){

    return new Promise( ( resolve:any ) => { 

      gapi.load('auth2', () => {  // La api de google carga la información del usuario y la almacena en auth2
        this.auth2 = gapi.auth2.init({
          client_id: '170305983302-l9htc4ljl92krckui61nhfjg8368518o.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        
        resolve();// Devueve el auth2

      });                                                         
    })

  }


  logout(){
    localStorage.removeItem('token');        // Borramos el token de localStorage
    
    this.auth2.signOut()                     // Nos deslogueamos de google usando el auth2 del usuario -> promesa
        .then( () => {                       // Si fue bien 
          this.ngZone.run(() => {                  // (ngZone es un contexto de llamada de código que permite monitorear, controlar y reaccionar 
                                                   // a todos los eventos. La redirección a /login se hace con signOut de google y para no perder
                                                   // Angular el control, se usa el ngZone.)
            this.router.navigateByUrl('/login');// nos movemos a la pantalla de login 
          })
    });
  }


  validarToken(): Observable<boolean>  {
    const token = localStorage.getItem('token') || '';             // Recuperamos el token del localStorage
     return this.http.get(`${base_url}/login/renew`, {             // Petición al backend para renovar ese token
      headers: {
        'x-token': token
      }
    }).pipe(                                                       // Obtenemos una respuesta del backend que es el nuevo token 
      tap((resp: any) => {                                         // Obtener esta respues dispara une fecto secundario 
        localStorage.setItem('token', resp.token)                  // que es guardar ese token en localStorage
      }),
      map( resp =>  true ),                                        // y el resultado final es un true si es que hubo respuesta 
      catchError( error => of (false))                             // Gestión del error  
    )            
  }

  crearUsuario ( formData: RegisterForm){
    
    return this.http.post(`${base_url}/usuarios`, formData)   // Petición al backend en 'http://localhost:3005/api/usuarios' que devuelve un observable
            .pipe(                                            // Transformamos los datos mediante pipe
              tap((resp: any) => {                            // La transformación solo será un efecto secundario 
                localStorage.setItem('token', resp.token)     // que será guardar el token en localStorage
              })
            )
  }

  login( formData: LoginForm ){
    
    return this.http.post(`${base_url}/login`, formData)      // Petición al backend en 'http://localhost:3005/api/login' que devuelve un observable
            .pipe(                                            // Transformamos los datos mediante pipe
                tap( (resp: any) => {                         // La transformación solo será un efecto secundario                
                  localStorage.setItem('token', resp.token)   // que será guardar el token en localStorage
                })
              )
  }

  loginGoogle( token ) {

    return this.http.post(`${base_url}/login/google`, { token }) // Petición al backend en 'http://localhost:3005/api/login/google' que devuelve un observable
      .pipe(                                                     // Transformamos los datos mediante pipe
        tap((resp: any) => {                                     // La transformación solo será un efecto secundario                
          localStorage.setItem('token', resp.token)              // que será guardar el token en localStorage
        })
      )
  }
}


