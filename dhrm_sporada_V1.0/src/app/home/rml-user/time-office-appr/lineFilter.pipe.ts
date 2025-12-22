import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineFilter'
})
export class LineFilterPipe implements PipeTransform {

  transform(items: any, line: any): any {
    console.log('LINE FLTR:', line, items);
    if (!items) {
      return [];
    }
    if (!line || line=='All') {
      return items;
    }
    return items.filter((item:any) => {
      return item.Line_Name == line
    });
  }

}


// @Pipe({
//   name: 'leaveFilte1'
// })
// export class LeaveFilterPipe1 implements PipeTransform {
//   transform(leaves: any[] | undefined | null, genId: string, a1_status: string ): any[] {
  
//     if (!genId && !a1_status) {
//       return leaves; // No filtering when both genId and status are empty
//     }
//     if (!leaves||genId=='' ||a1_status == ''  ) {
//       return leaves;
//     }
// console.log(leaves)
//     return leaves.filter(leave => {
//       const matchesGenId = leave.Gen_id.includes(genId);
//       const matchesA1Status =  leave.L1_Approval_Status === a1_status;
//       // const matchesA2Status = !a2_status || leave.L2_Approval_Status === a2_status;

//       return matchesGenId || matchesA1Status ;
//     });
//   }
// }
@Pipe({
  name: 'leaveFilte1'
})
export class LeaveFilterPipe1 implements PipeTransform {
  transform(leaves: any[] | undefined | null, genId: string, a1_status: string): any[] {
    leaves = leaves ?? []; 
    if (!genId && !a1_status) {
      return leaves; 
    }

    // console.log(leaves, genId, a1_status);

    return leaves.filter(leave => {
      const matchesGenId = leave.Gen_id?.toLowerCase().includes(genId);
      const matchesA1Status =  leave.L1_Approval_Status === a1_status;

     // console.log(matchesGenId || matchesA1Status);

      return matchesGenId || matchesA1Status;
    });
  }
}
@Pipe({
  name: 'leaveFilte2'
})
export class LeaveFilterPipe2 implements PipeTransform {
  transform(leaves: any[] | undefined | null, genId: string, a2_status: string): any[] {
    leaves = leaves ?? []; 
    if (!genId && !a2_status) {
      return leaves; 
    }

    // console.log(leaves, genId, a2_status);

    return leaves.filter(leave => {
      const matchesGenId = leave.Gen_id?.toLowerCase().includes(genId);
      const matchesA2Status =  leave.L2_Approval_Status === a2_status;

      //console.log(matchesGenId || matchesA2Status);

      return matchesGenId || matchesA2Status;
    });
  }
}
