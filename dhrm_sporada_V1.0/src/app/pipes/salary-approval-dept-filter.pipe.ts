import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salaryApprovalDeptFilter'
})
export class SalaryApprovalDeptFilterPipe implements PipeTransform {

   transform(data: any[], selectedDept: string): any[] {
      if (!data) {
        return [];
      }
      if (!selectedDept || selectedDept == 'All') {
        return data;
      }
    return data.filter((data:any) => {
      return data.dept_name == selectedDept
    });
    }

}
