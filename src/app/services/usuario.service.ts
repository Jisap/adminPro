import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, delay, map, tap } from 'rxjs/operators';//Se utiliza para realizar efectos secundarios para las notificaciones de la fuente observable.
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';





const base_url = environment.base_url

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {
    
      this.googleInit();  // Solo tendremos una instancia de este googleInit cada vez que se recarga la app
   }

   get token():string {
     return localStorage.getItem('token') || '';
   }

   get uid(): string{
     return this.usuario.uid || '';
   }

   get headers(){
      return {
        headers:{
          'x-token': this.token
        }
      }
   }

   get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
     return this.usuario.role
   }

   guardarLocalStorage( token:string, menu:any ){
     localStorage.setItem('token', token);                  
     localStorage.setItem('menu', JSON.stringify(menu));
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
    localStorage.removeItem('menu');         // Borramos el menú al que tenia acceso
    
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
    //const token = localStorage.getItem('token') || '';           // Recuperamos el token del localStorage --> usamos el getter (this.token)
     return this.http.get(`${base_url}/login/renew`, {             // Petición al backend para renovar ese token
      headers: {
        'x-token': this.token
      }
    }).pipe(                                                       // Obtenemos una respuesta del backend que es el nuevo token y el usuario y el menu que puede ver
      map((resp: any) => {                                         // Al Obtener esta respuesta la modificamos con map. 
        
        const { email, google,
                nombre, role,
                img='', uid } = resp.usuario;                      // 1º Obtenemos los valores que trae usuario

        this.usuario = new Usuario(                                // Instanciamos un modelo de Usuario con esos valores
          nombre, email,                                           // Con esto centralizamos la información del usuario conectado 
          '', img, google,                                         // que será usada en las rutas hijas del dashboard 
          role, uid
        ) 

        this.guardarLocalStorage( resp.token, resp.menu);          // y 2º guardararemos el token en localStorage
                                                                   // con su correspondiente menu
        return true;                                               // y el resultado final es un true si es que hubo respuesta
      }),
                                              
      catchError( error => of (false))                             // Sino hubo respuesta o hubo un error gestión del mismo devolviendo false 
    )            
  }

  crearUsuario ( formData: RegisterForm){
    
    return this.http.post(`${base_url}/usuarios`, formData)        // Petición al backend en 'http://localhost:3005/api/usuarios' que devuelve un observable
            .pipe(                                                 // Transformamos los datos mediante pipe
              tap((resp: any) => {                                 // La transformación solo será un efecto secundario 
                this.guardarLocalStorage(resp.token, resp.menu);   // que será guardar el token en localStorage
                                                                   // y su correspondiente menu que es parte de la respuesta
              })
            )
  }

  actualizarPerfil ( data: { email:string, nombre:string , role:string }){              // Recibe el nuevo email y nombre.

  data = {                                                                              // El role se mete en la petición en base al usuario que loguea que es el que actualizamos
    ...data,
    role: this.usuario.role
  }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {  // Petición put que actualiza el perfil en la bd
      headers: {
        'x-token': this.token
      }
    } )
  }

  login( formData: LoginForm ){
    
    return this.http.post(`${base_url}/login`, formData)             // Petición al backend en 'http://localhost:3005/api/login' que devuelve un observable
            .pipe(                                                   // Transformamos los datos mediante pipe
                tap( (resp: any) => {                                // La transformación solo será un efecto secundario                
                  this.guardarLocalStorage(resp.token, resp.menu);   // que será guardar el token en localStorage
                                                                     // y su correspondiente menu que es parte de la respuesta
                })
              )
  }

  loginGoogle( token ) {

    return this.http.post(`${base_url}/login/google`, { token }) // Petición al backend en 'http://localhost:3005/api/login/google' que devuelve un observable
      .pipe(                                                     // Transformamos los datos mediante pipe
        tap((resp: any) => {                                     // La transformación solo será un efecto secundario                
          this.guardarLocalStorage(resp.token, resp.menu);       // que será guardar el token en localStorage
                                                                 // y su correspondiente menu que es parte de la respuesta
        })
      )
  }


  cargarUsuarios( desde: number = 0){
    
    const url = `${ base_url }/usuarios?desde=${ desde }`       //http://localhost:3005/api/usuarios?desde=5
    
    return this.http.get<CargarUsuario>( url, this.headers )   // Esta función nos devuelve todos los usuarios registrados y el total de estos
              .pipe(                                           // Esta respuesta es un [] de objetos pero no es una instancia de Usuario que podamos manjear en el html 
               delay(1000),  
                map( resp => {                                 // Transformamos con pipe y map 
                  const usuarios = resp.usuarios.map(          // Crearemos una instancia de Usuario por cada elemento del []
                    user => new Usuario( user.nombre, 
                                         user.email,
                                         '',
                                         user.img,
                                         user.google,
                                         user.role,
                                         user.uid
                    )
                  )
                  return {
                    total: resp.total,
                    usuarios            // Este array es ahora de instancias de Usuario
                  };
                })
              )
  }

  eliminarUsuario( usuario:Usuario ){                                // Recibe un usuario a borrar
    console.log('eliminando')
    const url = `${base_url}/usuarios/${ usuario.uid }`              // Ruta de borrado en el backend
    return this.http.delete<CargarUsuario>( url, this.headers )      // Petición de borrado al backend 
  }

  guardarUsuario( usuario: Usuario ){                                                         // Al cambiar el role en el html disparamos esta función
    return this.http.put( `${ base_url }/usuarios/${ usuario.uid}`,usuario, this.headers )    // hacemos la petición con el usuario gnerado en el html
  }                                                                                           // y mandamos el cambio con ese usuario modificado
}