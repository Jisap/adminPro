import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // const promesa = new Promise( ( resolve, reject ) => {
    //   if(true){
    //     resolve(('Hola mundo'));  //mensaje
    //   }else{
    //     reject('Algo salio mal');
    //   }
    // });        

    // promesa
    //   .then( ( mensaje ) => {  // Cuando se resuelva la promesa 
    //     console.log( mensaje );       // Se mostrara el mensaje
    //   })
    //   .catch( error => console.log(('Error en mi promesa')))
  
    // console.log('Fin del init'); // esto se muestra primero

    this.getUsuarios()
      .then( usuarios => {
        console.log( usuarios );
      });
  }

  getUsuarios(){
    
    return new Promise( ( resolve ) => {                // Promesa cuya resolución es obtener datos de una petición http

      fetch('https://reqres.in/api/users')              // Petición que es de por si una promesa
        .then( resp => resp.json() )                    // Resolución de la promesa devuelve otra promesa
        .then( body => resolve( body.data ))            // Esa otra promesa devuelve los datos que queriamos y resuelve la promesa ppal
    })

    //return promesa;                                     // Aquí los datos 
  }
}
