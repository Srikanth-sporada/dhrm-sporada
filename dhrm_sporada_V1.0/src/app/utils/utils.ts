import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';
import { Injectable,OnInit } from '@angular/core';
import { ApiService } from '../home/api.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root' // Makes the service available globally
})

export class Utility {
  
    constructor (private messageService:MessageService, private apiService:ApiService){

    }
   
    /** Export HTML data to excel sheet
      * Table {HTMLTableElement} ID  #table
      * @param tableId ID of table to convert excel sheet
      * @param fileName name to save excel file
    */
     exportexcel(tableId:string, fileName:string,plant:any) {
       const x = document.querySelector(`#${tableId}`)
       const ws = XLSX.utils.table_to_sheet(x);
       const wb = XLSX.utils.book_new();
      /** checking if the plant code is empty */
       if(plant == ''){
        XLSX.utils.book_append_sheet(wb, ws, fileName + '_' + 'all');
        XLSX.writeFile(wb, `${fileName}_${'all'}.xlsx`);
       }else{
        XLSX.utils.book_append_sheet(wb, ws, fileName + '_' + plant);
        XLSX.writeFile(wb, `${fileName}_${plant}.xlsx`);
       }
       this.messageService.add({severity:'info',summary:'Data Exported!'});
     }

    /** extract response data object keys 
     * @param dataArray data array to extract object keys
    */
    extractKeys(dataArray:any) {
      if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
      return Object.keys(dataArray[0]);
    }
    /** extract response data object keys 
     * @param dataArray data array to extract object keys
    */
    extractKeysForReports(dataArray:any) {
      if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
      return Object.keys(dataArray[0]);
    }
    /** extract response data object values 
     * @param dataArray
    */
    extractValues(dataArray: any[]) {
      if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
      return Object.values(dataArray[0]);
     }

    /** get payroll area by plant code
      * @property {UntypedForm} form.plantCode
      * @property {Observable} Observable handles async process
      * 
      */
     getPayrollAreaByPlant(plantCode:any):Observable<any>{
      return new Observable((observer) => {
          try{
                this.apiService.getPayrollAreaByPlantcode(plantCode).subscribe({
                  next: (response) => {
                    observer.next(response);
                    observer.complete();
                  },
                  error: (error:any) => this.messageService.add({severity:'error',summary:error.message})
                })
              }
            catch(err:any){
              this.messageService.add({severity:'error',summary:err.message})
            }
      })
    }
      

}
