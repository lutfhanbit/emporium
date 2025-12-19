import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { TranslateService } from '@ngx-translate/core';
import { DomHandlerService } from './dom-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  loading: boolean = false;
  public settings: Settings;
  isServer: boolean = true;

  constructor(public appSettings: AppSettings, 
              public router: Router, 
              public translate: TranslateService,
              public domHandlerService: DomHandlerService){
    this.settings = this.appSettings.settings;
    translate.addLangs(['en','de','fr','ru','tr']);
    translate.setDefaultLang('en'); 
    translate.use('en');
  }

  ngOnInit() {
   if (this.domHandlerService.isBrowser) {
      setTimeout(() => {
        this.isServer = false;
      })
    }  
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.domHandlerService.winScroll(0, 0); 
      }
    })  
  }
}
