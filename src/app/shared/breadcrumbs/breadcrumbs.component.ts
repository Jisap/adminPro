import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})

export class BreadcrumbsComponent implements OnDestroy {

  public titulo: string;
  public tituloSubs$:Subscription;

  constructor( private router: Router ) { 

    this.tituloSubs$ = this.getArgumentosRuta()                        // tituloSubs$ guarda el rdo del observable (data)
                                    //data.titulo
                          .subscribe(({ titulo }) => {                 // de la data usamos solo el titulo 
                            this.titulo = titulo;                      // guardamos el titulo en una variable para el html
                            document.title = `Admin-Pro - ${titulo}`;  // y se lo ponemos también para el titulo de la pestaña
                          });
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();                                    // Cuando demos a logout el observable de la data de las rutas se destruye
  }

  getArgumentosRuta(){

    return this.router.events                                     // events es un observable que emite eventos, en este caso cuando cambiamos de ruta
      .pipe(                                                      // de todos los eventos generados al acceder a una ruta solo queremos
        filter(event => event instanceof ActivationEnd),          // el ActivationEnd que es el que contiene la data de cada ruta, pero hay 2
        filter((event: ActivationEnd) => event.snapshot.firstChild === null), // selecccionaremos aquel cuya prop firstchild = null
        map((event: ActivationEnd) => event.snapshot.data),       // Seleccionado el ActivationEnd que nos interesa obtenemos la data
      )          
      
  }

}
