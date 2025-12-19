import { Injectable, inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Injectable() 
export class CustomOverlayContainer extends OverlayContainer {
  domHandlerService = inject(DomHandlerService);

  override _createContainer(): void {
    let container = this.domHandlerService.winDocument.createElement('div');
    container.classList.add('cdk-overlay-container');
    const app = this.domHandlerService.winDocument.getElementById('app');
    if (!app) return;
    app.appendChild(container);
    this._containerElement = container;
  }
}