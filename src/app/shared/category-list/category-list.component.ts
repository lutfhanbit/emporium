import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {

  @Input() categories;
  @Input() categoryParentId;
  @Output() change: EventEmitter<any> = new EventEmitter();
  mainCategories;

  constructor(public domHandlerService: DomHandlerService) { }

  public ngDoCheck() {
    if(this.categories && !this.mainCategories) {
      this.mainCategories = this.categories.filter(category => category.parentId == this.categoryParentId); 
    }
  }

  public stopClickPropagate(event: any){
    if(this.domHandlerService.window?.innerWidth < 960){
      event.stopPropagation();
      event.preventDefault();
    }    
  }

  public changeCategory(event){
    this.change.emit(event);
  }

}