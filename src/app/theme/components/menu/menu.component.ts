import { Component, OnInit } from '@angular/core';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  constructor(private domHandlerService: DomHandlerService) { }

  ngOnInit() { }

  openMegaMenu(){
    let pane = this.domHandlerService.winDocument.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el: any) {
        if(el.children.length > 0){
          if(el.children[0].classList.contains('mega-menu')){
            el.classList.add('mega-menu-pane');
          }
        }        
    });
  }

}
