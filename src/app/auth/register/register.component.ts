import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'
//npm install sweetalert2


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmitted = false;                                              // Antes de enviar el formulario formsubmitted = false;

  public registerForm = this.fb.group({                                      // Definimos como es el formulario de registro
    nombre: ['', [ Validators.required, Validators.minLength(3) ]],
    email: ['', [ Validators.required, Validators.email  ]],
    password: ['', [ Validators.required ] ],
    password2: ['', [ Validators.required ]],
    terminos: [ false , [ Validators.requiredTrue ] ],
  },{
    validators: this.passwordsIguales( 'password', 'password2' )
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) { }

  crearUsuario(){                                                        // Función que recoge el contenido del formulario
    this.formSubmitted = true                                            // Despues de enviar el formulario formSubmitted pasa a true
    console.log( this.registerForm.value )
  
    if( this.registerForm.invalid ){                                     // Si el formulario es invalido 
      return;                                                            // return y finaliza la creación
    }

    this.usuarioService.crearUsuario( this.registerForm.value )          // Pero si si es válido usamos el service crearUsuario y le enviamos la data del formulario
                          .subscribe( resp => {                          // el servicio devuelve un observable al que hay que subscribirse
                            this.router.navigateByUrl('/');              // Si exite la respuesta exitosa nos movemos al dashboard
                          }, (err) => {
                            Swal.fire('Error', err.error.msg, 'error')   // Sino o hay algún error mensaje de swal 
                          });
  }

   campoNoValido( campo:string ): boolean{
      if( this.registerForm.get(campo).invalid && this.formSubmitted){      // Si el nombre del campo no es valido y ha sido enviado
        return true;                                                        // esta función devolverá true. 
      }else{
        return false;
      }
   }

   contrasenasNoValidas(){
     const pass1 = this.registerForm.get('password').value;
     const pass2 = this.registerForm.get('password2').value;

     if( (pass1 !== pass2) && this.formSubmitted ){
       return true;
     }else{
       return false
     }

   }

   passwordsIguales( pass1Name: string, pass2Name: string){

      return ( formGroup: FormGroup ) => {
        const pass1Control = formGroup.get( pass1Name );
        const pass2Control = formGroup.get( pass2Name );

        if( pass1Control.value === pass2Control.value ){  // Si las pass son iguales errores = null
          pass2Control.setErrors(null)
        }else {
          pass2Control.setErrors({ noEsIgual: true })    // Si las pass son diferentes errores = objeto que define el error
        }
      }
    }


   aceptaTerminos(){
      return !this.registerForm.get('terminos').value && this.formSubmitted   // Si no hay check en aceptar los términos y envia el formulario
    }                                                                         // esta función devolverá true y mostrará en el html el msg de error 

}
