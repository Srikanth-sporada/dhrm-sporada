import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'GenFilter',
})
export class GenFilterPipe implements PipeTransform {
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
@Pipe({
    name: 'lineFilter',
  })
  export class LineFilterPipe implements PipeTransform {
    transform(data: any[], selectedLine: string): any[] {
      if (!data) {
        return [];
      }
      if (!selectedLine || selectedLine == 'All') {
   
        return data;
      }
    return data.filter((data:any) => {
      return data.Line_Name == selectedLine
    });
    
    }
  }
@Pipe({
    name: 'DeptFilter',
  })
  export class DeptFilterPipe implements PipeTransform {
    transform(data: any[], selectedDept: string): any[] {
      if (!data) {
        return [];
      }
      if (!selectedDept || selectedDept == 'All') {
   
        return data;
      }
    return data.filter((data:any) => {
      return data.dept_slno == selectedDept
    });
    
    }
  }
@Pipe({
    name: 'plantFilter',
  })
  export class PlantFilterPipe implements PipeTransform {
    transform(data: any[], selectedPlant: string): any[] {
      if (!data) {
        return [];
      }

      // console.log(data,selectedPlant);
      
      if (!selectedPlant || selectedPlant == 'All') {
   
        return data;
      }
    return data.filter((data:any) => {
      return data.Plant_Code.toString() == selectedPlant
    });
    
    }
  }

  @Pipe({
    name: 'plantFilter_IN',
  })
  export class IN_PlantFilterPipe implements PipeTransform {
    transform(data: any[], selectedPlant: string): any[] {
      if (!data) {
        return [];
      }

      // console.log(data,selectedPlant);
      
      if (!selectedPlant || selectedPlant == 'All') {
   
        return data;
      }
    return data.filter((data:any) => {
      return data.Plant.toString() == selectedPlant
    });
    
    }
  }


@Pipe({
    name: 'CatFilter',
  })
  export class CatgFilterPipe implements PipeTransform {
    transform(data: any[], selectedCate: string): any[] {
      if (!data) {
        return [];
      }
      if (!selectedCate || selectedCate == 'All') {
   
        return data;
      }
    return data.filter((data:any) => {
      return data.apprentice_type == selectedCate
    });
    
    }
  }
@Pipe({
    name: 'StatusFilter',
  })
  export class StatusFilterPipe implements PipeTransform {
    transform(data: any[], selectedStatus: string): any[] {
      if (!data) {
        return [];
      }
      if (!selectedStatus || selectedStatus == 'All') {
   
        return data;
      }
    return data.filter((data:any) => {
      return data.Con_Id == selectedStatus
    });
    
    }
  }
  
@Pipe({
    name: 'SalGenFilter',
  })
  export class SalGenFilterPipe implements PipeTransform {
    transform(data: any[], selectedGenId: string): any[] {
      if (!data) {
        return [];
      }
      if (!selectedGenId || selectedGenId == '') {
        return data;
      }

      if (selectedGenId && selectedGenId.trim() !== '') {
        const searchTerm = selectedGenId.trim().toLowerCase();
        data = data.filter(item => {
          if (item && item.Gen_Id) {
            return item.Gen_Id.toLowerCase().includes(searchTerm);
          }
          return false;
        });
      }
      return data;
      // if(selectedGenId && selectedGenId.trim() !== ''){
      //   const searchTerm = selectedGenId.trim().toLowerCase();
      //   data = data.filter(item => {
      //     if (item && item.gen_id) {
      //       return item.gen_id.toLowerCase().includes(searchTerm);
      //     }
      //     return false;
      //   });
      // }
      // return data;
    
    }
  }
  

  


  @Pipe({
    name: 'shiftFilter'
  })
  export class ShiftFilterPipe implements PipeTransform {
    transform(data: any[], timeRange: { in_tm_min: string, in_tm_max: string }): any[] {
      if (!data) {
        return [];
      }
      if (!timeRange || !timeRange.in_tm_min || !timeRange.in_tm_max  ) {
        return data;
      }
      const minTime = timeRange.in_tm_min?.split('T')[1]?.substring(0, 8);
      const maxTime = timeRange.in_tm_max?.split('T')[1]?.substring(0, 8);
      return data.filter((item: any) => {
        const shiftMinTime = item.in_time
        return shiftMinTime >= minTime && shiftMinTime <= maxTime;
      });
    }
  }
  


  // @Pipe({
  //   name: 'monthFilter'
  // })
  // export class MonthFilterPipe implements PipeTransform {
  //   transform(items: any[], selectedMonth: string): any[] {
  //     if (!items || !selectedMonth) {
  //       return items;
  //     }
  //     const monthMap = {
  //       'january': 1,
  //       'february': 2,
  //       'march': 3,
  //       'april': 4,
  //       'may': 5,
  //       'june': 6,
  //       'july': 7,
  //       'august': 8,
  //       'september': 9,
  //       'october': 10,
  //       'november': 11,
  //       'december': 12
  //     };

  //     const selectedMonthNumber = monthMap[selectedMonth.toLowerCase()];

  //     if (!selectedMonthNumber) {
  //       return items;
  //     }
  //     return items.filter(item => {
  //       const lockMonth = new Date(item.lock_month).getMonth() + 1; 
  //       return lockMonth === selectedMonthNumber;
  //     });
  //   }
  // }


@Pipe({
  name: 'monthFilter'
})
export class MonthFilterPipe implements PipeTransform {
  transform(items: any[], filterValue: string): any[] {
    if (!items) return [];
    if (!filterValue) return items;

    const monthMap:any = {
      'january': 1,
      'february': 2,
      'march': 3,
      'april': 4,
      'may': 5,
      'june': 6,
      'july': 7,
      'august': 8,
      'september': 9,
      'october': 10,
      'november': 11,
      'december': 12
    };

    const filterLower = filterValue.toLowerCase().trim();

    // Try to get month number from input string (if input is a month)
    const selectedMonthNumber = monthMap[filterLower];

    return items.filter(item => {
      const itemMonth = new Date(item.lock_month).getMonth() + 1;
      const monthMatch = selectedMonthNumber ? itemMonth === selectedMonthNumber : false;

      // Check if plant_Code matches input (case-insensitive)
      const plantMatch = item.plant_Code?.toString().toLowerCase().includes(filterLower);

      // Return true if either month matches OR plant code matches
      return monthMatch || plantMatch;
    });
  }
}




  @Pipe({
    name: 'DateFilter',
  })
  export class DateFilterPipe implements PipeTransform {
    transform(data: any[], Date: any): any[] {
      if (!data || !Array.isArray(data)) {
        return []; 
      }

      if (Date && Date.trim() !== '') {
        const searchTerm = Date.trim().toLowerCase();
        data = data.filter(item => {
          if (item && item.gen_id) {
            return item.doj.toLowerCase().includes(searchTerm);
          }
          return false;
        });
      }
      return data;
    }
  }
  @Pipe({
    name: 'ConFilter',
  })
  export class ConFilterPipe implements PipeTransform {
    transform(data: any[], selectedContrator: string): any[] {
      if (!data) {
        return [];
      }

      if (selectedContrator && selectedContrator.trim() !== '') {
        const searchTerm = selectedContrator.trim().toLowerCase();
        data = data.filter(item => {
          if (item && item.Cont_company_name) {
            return item.Cont_company_name.toLowerCase().includes(searchTerm);
          }
          return false;
        });
      }
      // if (selectedContrator && selectedContrator.trim() !== '') {
      //   const search = selectedContrator.trim().toLowerCase();


      //   return data.filter(item => {
      //     return item.Cont_company_name.toLowerCase().includes(search);
      //   });
      // }
      return data;
    }
  }
  @Pipe({
    name: 'Con_Status_Filter'
  })
  export class Con_Status_FilterPipe implements PipeTransform {
    
    transform(data: any[], selectedStatus: any): any[] {
      if (!data || !selectedStatus) {
        return data;
      }
      // console.log(data,selectedStatus);
      
      return data.filter(item => {
        if (item && typeof item.Status === 'boolean') {
          if(selectedStatus ==='false'){
            return item.Status ===false;
          }else{
            return item.Status ===true;
          }
     
        }
        return false;
      });
    }
  }


  @Pipe({
    name: 'customFilter'
  })
  export class CustomSalFilterPipe implements PipeTransform {
    transform(data: any[], filterOptions: any): any[] {
      if (!data || !filterOptions) {
        return data;
      }

      return data.filter(item => {
        const salStatusMatch =  item.Sal_Status === filterOptions.Sal_Status;
        const deptNameMatch =  item.dept_name === filterOptions.dept_name;
        const genIdMatch =  item.Gen_Id.includes(filterOptions.Gen_Id);

        return salStatusMatch || deptNameMatch || genIdMatch;
      });
    }
  }


  

  @Pipe({
    name: 'customgenFilter',
  })
  export class CustomGenFilterPipe implements PipeTransform {
    transform(data: any[], gen_id: any): any[] {
      if (!data || !Array.isArray(data)) {
        return []; // Return an empty array if data is null, undefined, or not an array.
      }
 
      if (gen_id && gen_id.trim() !== '') {
        const searchTerm = gen_id.trim().toLowerCase();
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
  @Pipe({
    name: 'ApprGenFilter',
  })
  export class ApproveGenFilterPipe implements PipeTransform {
    transform(data: any[], Gen_id: any): any[] {
      if (!data || !Array.isArray(data)) {
        return []; // Return an empty array if data is null, undefined, or not an array.
      }
 
      if (Gen_id && Gen_id.trim() !== '') {
        const searchTerm = Gen_id.trim().toLowerCase();
        data = data.filter(item => {
          if (item && item.Gen_id) {
            return item.Gen_id.toLowerCase().includes(searchTerm);
          }
          return false;
        });
      }
      return data;
    }
  }


  
@Pipe({
  name: 'leaveFilte'
})
export class LeaveFilterPipe implements PipeTransform {
  transform(leaves: any[], genId: string, a1_status: string ,a2_status: string): any[] {
    if (!leaves || !leaves.length) {
      return [];
    }
console.log(leaves)
    return leaves.filter(leave => {
      const matchesGenId = leave.Gen_id.toLowerCase().includes(genId.toLowerCase());
      const matchesA1Status = !a1_status || leave.L1_Approval_Status.toLowerCase() === a1_status.toLowerCase();
      const matchesA2Status = !a2_status || leave.L2_Approval_Status.toLowerCase() === a2_status.toLowerCase();

      return matchesGenId && matchesA1Status && matchesA2Status;
    });
  }
}