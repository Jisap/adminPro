import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit{
  ngOnInit(){
    this.btnClass = `btn ${ this.btnClass }`; // Al arrancar el incrementador recibimos la prop btnClass y le ponemos delante 'btn' para que funcione bien
  }

  @Input('valor') progreso: number = 50;  // incrementador hijo recibirá  un valor = progreso desde el padre
  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();//incrementador hijo emite un valor hacia el padre

  @Input() btnClass: string = "btn-primary"; // Clase por defecto del boton

  cambiarValor(valor: number) {  // Recoge el valor del input tipo number a través de un boton

    if (this.progreso >= 100 && valor >= 0) {  // Si el progreso supera 100 solo se emitirá el valor de 100
      this.valorSalida.emit(100);
      this.progreso = 100;
      return
    }

    if (this.progreso <= 0 && valor < 0) {  // Si el progreso es inferior a 0 solo se emitirá 0
      this.valorSalida.emit(0);
      this.progreso = 0;
      return
    }

    this.progreso = this.progreso + valor;
    this.valorSalida.emit( this.progreso )  // Sino es uno de esos valores extremos el valor de salida = progreso
  }
  
  onChange( nuevoValor:number ){ // Recoge el valor del input tipo number atraves de una caja
    
    if( nuevoValor >= 100){                // Si el valor del input >= 100
      this.progreso = 100;                 // progreso = 100 
    }else if (nuevoValor <= 0){            // Si el valor del input <= 0
      this.progreso = 0;                   // progreso = 0 
    }else{                                 // Sino se dan las anteriores posibilidades          
      this.progreso = nuevoValor;          // progreso = nuevoValor
    }

    this.valorSalida.emit( this.progreso ) // emitimos como evento valorSalida el valor de progreso 
  }

}
