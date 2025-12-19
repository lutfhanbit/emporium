import {Component, ViewEncapsulation, ViewChild, HostListener, ElementRef, inject} from '@angular/core';
import { DomHandlerService } from 'src/app/dom-handler.service'; 

@Component({
  selector: 'app-fullscreen',
  encapsulation: ViewEncapsulation.None,
  template: `
    <button mat-icon-button class="full-screen">
        <mat-icon *ngIf="!toggle" #expand>fullscreen</mat-icon>
        <mat-icon *ngIf="toggle" #compress>fullscreen_exit</mat-icon>
    </button> 
  `
})
export class FullScreenComponent { 
    toggle:boolean = false;
    @ViewChild('expand') private expand:ElementRef;
    @ViewChild('compress') private compress:ElementRef; 
    domHandlerService = inject(DomHandlerService);
    document: any = this.domHandlerService.window?.document;
   
    requestFullscreen(elem: any) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else {
            console.log('Fullscreen API is not supported.');
        }
    };

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else {
            console.log('Fullscreen API is not supported.');
        }
    };

    @HostListener('click') getFullscreen(){
        if(this.expand){
            this.requestFullscreen(document.documentElement);
        }
        if(this.compress){
            this.exitFullscreen();
        }
    }

    @HostListener('window:resize') onFullScreenChange(){
        let fullscreenElement = document.fullscreenElement;
        if (fullscreenElement != null) {
            this.toggle = true;
        } else {
            this.toggle = false;          
        }
    }   

}