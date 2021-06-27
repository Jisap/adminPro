import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';



@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {
  
  constructor( private settingsService:SettingsService) { }

  ngOnInit(): void {
    
    this.settingsService.checkCurrentTheme();
  }

  changeTheme( theme: string ){                      // Esta función esta en cada link de los themes
    
    this.settingsService.changeTheme( theme );       // Cambiamos el theme según el link pulsado y lo guardamos en localStorage 
    
  }

}
