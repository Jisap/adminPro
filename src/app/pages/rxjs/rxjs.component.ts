import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription;

  constructor() {
    
  // this.retornaObservable().pipe(                // Pipe transforma el flujo de información del observable
  //   retry(1)                                    // retry continuará el flujo de emisión del observable donde i no se reinicio 
  // ).
  // subscribe(                                    // Para poder ver que emite el observable hay que subscribirse a el
  //   valor => console.log('Subs', valor),
  //   error => console.warn('Error:', error),
  //   () => console.info('Obs terminado')
  // );

    this.intervalSubs = this.retornaIntervalo()
                          .subscribe(
                            (valor) => console.log(valor)
                          )
  }

  ngOnDestroy(): void {                            // Mientras estemos en la página donde se activa el componente el observable funcionará
    this.intervalSubs.unsubscribe();               // Cuando salgamos del componente este se destruirá. 
  }

  retornaIntervalo(): Observable<number>{

    return interval( 500 )                                    // Devuelve un observable cara 1/2 segundo
      .pipe(                                                  // Pipe transforma el flujo de información del observable
        map( valor => valor+1 ),                              // map transforma el valor de cada observable según una función                   
        filter( valor => ( valor % 2 === 0 ) ? true: false),  // Se mostrarán los valores cuya division entre 2 de como rdo 0, osea pares.
        take(10),                                             // Take solo tomará 4 observables
      );

  }

  retornaObservable(): Observable<number>{  // Función que crea un observable

    let i = -1;

    return new Observable<number>(observer => { // Objeto observable que contiene una función que queremos ver su flujo de emisión de datos 

      const intervalo = setInterval(() => {     // queremos ver como varia intervalo

        i++;                                    // A cada vuelta de bucle i se incrementará en 1
        observer.next(i);                       // emitimos el valor

        if (i === 4) {                          // Si el valor de intervalo es = 4 finalizamos la función setInterval
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          observer.error('i llego al valor de 2');
        }

      }, 1000)

    });

  }

}
