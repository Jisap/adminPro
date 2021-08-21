import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

declare const gapi: any;  // Libreria de google para el sign In cargada en el index.html

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit {

  public auth2:any;                                        // Propiedad que recoge la información del login de google para un usuario

  public loginForm = this.fb.group({                       // Definimos como es el formulario de registro
    
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [ false ]
    
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone) { }

  ngOnInit(): void {                                       // Al arrancar la app renderizamos el boton de google
    this.renderButton();
  }

  login() {                                                // Función que recoge el contenido del formulario de login y nos loguea en el backend
    
    this.usuarioService.login( this.loginForm.value )      // Usamos el usuarioService.login para hacer la petición de login al backend 
      .subscribe( resp => {                                // La respuesta viene como un observable al cual nos subscribimos para porder leerlo
        console.log(resp)
        if( this.loginForm.get('remember').value){                           // Si el check de remember existe   
          localStorage.setItem('email', this.loginForm.get('email').value)   // guardamos en el localStorage el email 
        }else{
          localStorage.removeItem('email')                                   // Caso contrario borramos el email del localStorage
        }

        //Mover al dashboard
        this.router.navigateByUrl('/');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error')
      })
  }

  renderButton() {                                // Renderización del boton de google en el div con id='my-signin2'
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();                             // Se invoca el método de google de autenticación
  }

  async startApp() {
    
    await this.usuarioService.googleInit();                   // La api de google carga la información del usuario 
    this.auth2 = this.usuarioService.auth2;                   // y la almacena en la instancia de auth2 de LoginComponent

    this.attachSignin(document.getElementById('my-signin2')); // Se envia toda la info de auth2 a attachSignin
                                                              // para autenticarla y mostrarla
  };

  attachSignin(element) {

    this.auth2.attachClickHandler(element, {},  
      (googleUser) => {                                        // Google nos genera un googleUser que contiene información del usuario -> token
        const id_token = googleUser.getAuthResponse().id_token;// Este token ...
        console.log('Logueado con google');
        this.usuarioService.loginGoogle(id_token)              // se envía al backend para su validación y almacenamiento en localStorage
          .subscribe( resp => {                                // Con la respuesta exitosa 
            this.ngZone.run(() => {                                    // (la resp viene de una libreria de google -> ngZone)
              this.router.navigateByUrl('/');                  // nos movemos al dashboard
            })
          })
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
}
}
