import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
  })

export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) {
          return [];
        }
        if (!searchText) {
          return items;
        }
        searchText = searchText.trim().toLowerCase();
        return items.filter(item => {    
          // console.log(item)      
          return item.fullname.toLowerCase().includes(searchText) || item?.gen_id?.toLowerCase().includes(searchText)
    });
    }
  }
  