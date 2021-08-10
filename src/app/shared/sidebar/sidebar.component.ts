import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  public usuario:Usuario; // Declaramos un usuario según el modelo Usuario

  constructor(private sidebarService: SidebarService,     // Inyectamos el servicio del menu del sideBar
               private usuarioService: UsuarioService) {  // Inyectamos el usuarioService para las fotos del usuario logueado
              
    this.menuItems = sidebarService.menu;
    
    this.usuario = usuarioService.usuario; // Igualamos el usuario con la respuesta de usuarioService -> instancia del usuario logueado
  }

  ngOnInit(): void {
  }

}
