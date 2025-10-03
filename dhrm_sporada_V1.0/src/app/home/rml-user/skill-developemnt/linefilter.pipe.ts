import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linefilter'
})
export class LinefilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {          
      return item.line_name.toLowerCase().includes(searchText)
});
}
}
