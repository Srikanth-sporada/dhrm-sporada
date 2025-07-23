import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deptfilter',
  pure:false
})
export class DeptfilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {          
      return item.dept_name.toLowerCase().includes(searchText)
});
}

}
