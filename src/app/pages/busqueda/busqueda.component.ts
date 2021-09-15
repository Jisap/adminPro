import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from '../../services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params                // Nos subscribimos a los params que lleve la ruta de este componente
      .subscribe( ({ termino }) => {          // Obtenemos así el termino de la busqueda
        this.busquedaGlobal( termino )        // Lo enviamos al método local busquedaGlobal
      })
  }

  busquedaGlobal( termino: string ){                  // Este método local lo envía al servicio de busquedas
    this.busquedasService.busquedaGlobal( termino )
      .subscribe( ( resp:any ) => {                           // Obtenemos una respuesta del backend, un objeto { con [] por cada coincidencia }
        console.log(resp);
        this.usuarios = resp.usuarios;
        this.medicos = resp.medicos;
        this.hospitales = resp.hospitales;
      })
  }

  abrirMedico( medico: Medico){
    console.log(medico)
  }
}
