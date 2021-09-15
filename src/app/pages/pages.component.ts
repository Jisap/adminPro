import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';
declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  

  constructor(private SettingsService: SettingsService,          // Inyectamos los settings a pageComponents
               private sidebarService: SidebarService, )         // y el servicio para cargar el menu del sidebar
               { }

  ngOnInit(): void {
    customInitFunctions();              // Esto inicializa los plugins de jquery
    this.sidebarService.cargarMenu();   // Carga el menu del sidebar 
  }

}
