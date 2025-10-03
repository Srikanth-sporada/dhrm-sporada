import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'GenFilter',
})
export class genIDFilterPipe implements PipeTransform {
  transform(data: any[], genId: any): any[] {
    if (!data || !Array.isArray(data)) {
      return []; // Return an empty array if data is null, undefined, or not an array.
    }

    if (genId && genId.trim() !== '') {
      const searchTerm = genId.trim().toLowerCase();
      data = data.filter(item => {
        if (item && item.gen_id) {
          return item.gen_id.toLowerCase().includes(searchTerm);
        }
        return false;
      });
    }
    return data;
  }
}