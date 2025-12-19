import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Menu } from './menu.model';
import { menuItems } from './menu';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private location: Location,
              private router: Router,
              public domHandlerService: DomHandlerService){ } 
 

  public getMenuItems():Array<Menu> {
    return menuItems;
  }

  public expandActiveSubMenu(menu:Array<Menu>){
    let url = this.location.path();
    let routerLink = decodeURIComponent(url);
    let activeMenuItem = menu.find(item => item.routerLink === routerLink);
    if (activeMenuItem) {
      let menuItem = activeMenuItem;
      while (menuItem.parentId != 0){  
        let parentMenuItem = menu.find(item => item.id == menuItem.parentId);
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  public toggleMenuItem(menuId){
    let menuItem = this.domHandlerService.winDocument.getElementById('menu-item-'+menuId);
    let subMenu = this.domHandlerService.winDocument.getElementById('sub-menu-'+menuId);
    if(subMenu){
      if(subMenu.classList.contains('show')){
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else{
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }      
    }
  }

  public closeOtherSubMenus(menu:Array<Menu>, menuId){
    let currentMenuItem = menu.filter(item => item.id == menuId)[0];
    menu.forEach(item => {
      if((item.id != menuId && item.parentId == currentMenuItem.parentId) || (currentMenuItem.parentId == 0 && item.id != menuId) ){
        let subMenu = this.domHandlerService.winDocument.getElementById('sub-menu-'+item.id);
        let menuItem = this.domHandlerService.winDocument.getElementById('menu-item-'+item.id);
        if(subMenu){
          if(subMenu.classList.contains('show')){
            subMenu.classList.remove('show');
            menuItem.classList.remove('expanded');
          }              
        } 
      }
    });
  } 

  public closeAllSubMenus(){        
    menuItems.forEach(item => {
      let subMenu = this.domHandlerService.winDocument.getElementById('sub-menu-'+item.id);
      let menuItem = this.domHandlerService.winDocument.getElementById('menu-item-'+item.id);
      if(subMenu){
        if(subMenu.classList.contains('show')){
          subMenu.classList.remove('show');
          menuItem.classList.remove('expanded');
        }              
      } 
    });           
  }

}
