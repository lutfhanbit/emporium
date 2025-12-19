import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'brandSearchPipe', pure: false })
export class BrandSearchPipe implements PipeTransform {
  transform(brands: any[], args: string): any[] {
    if (!brands) {
      return [];
    } 
    if (!args) {
      return brands;
    } 
    const searchText = new RegExp(args, 'ig');
    return brands.filter(brand => brand.name && brand.name.search(searchText) !== -1);
  } 
}