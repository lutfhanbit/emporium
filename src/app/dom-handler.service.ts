import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomHandlerService {

  isBrowser: any; 

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object) { 
    this.isBrowser = isPlatformBrowser(platformId); 
  }

  get winDocument() {
    return this.document;
  }

  get window(): any {
    if (this.isBrowser) { 
      return window;
    } 
  }

  winScroll(y: number, x: number) {
    if (this.isBrowser) { 
      setTimeout(() => {
        window.scroll({
          top: y,
          left: x,
          behavior: "smooth",
        });
      });
    } 
  }

}
