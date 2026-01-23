import * as XLSX from "xlsx";
import { MessageService } from "primeng/api";
import { Injectable, OnInit } from "@angular/core";
import { ApiService } from "../home/api.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
@Injectable({
  providedIn: "root", // Makes the service available globally
})
export class Utility {
  throttleBtnState: any = false;
  constructor(
    private messageService: MessageService,
    private apiService: ApiService
  ) {}

  /** Export HTML data to excel sheet
   * Table {HTMLTableElement} ID  #table
   * @param tableId ID of table to convert excel sheet
   * @param fileName name to save excel file
   */
  exportexcel(tableId: string, fileName: string, plant: any) {
    const x = document.querySelector(`#${tableId}`);
    const ws = XLSX.utils.table_to_sheet(x);
    // console.log('SHEET DATA:',ws)
    /** Post-process: reformat date-like strings */ 
    Object.keys(ws).forEach(cell => {
      /** skip sheet meta data */
      if (cell[0] === '!') return; 
      const value = ws[cell].v;

      /** Check if it's a valid date string */ 
      if (typeof value === 'string') {
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          const day = String(parsed.getDate()).padStart(2, '0');
          const month = String(parsed.getMonth() + 1).padStart(2, '0');
          const year = parsed.getFullYear();
          /** final formated date */
          ws[cell].v = `${day}-${month}-${year}`;
        }
      }
    });

    const wb = XLSX.utils.book_new();
    /** checking if the plant code is empty */
    if (plant == "") {
      XLSX.utils.book_append_sheet(wb, ws, fileName + "_" + "all");
      XLSX.writeFile(wb, `${fileName}_${"all"}.xlsx`);
    } else {
      XLSX.utils.book_append_sheet(wb, ws, fileName + "_" + plant);
      XLSX.writeFile(wb, `${fileName}_${plant}.xlsx`);
    }
    this.messageService.add({ severity: "info", summary: "Data Exported!" });
  }

  /** extract response data object keys
   * @param dataArray data array to extract object keys
   */
  extractKeys(dataArray: any) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
    return Object.keys(dataArray[0]);
  }
  /** extract response data object keys
   * @param dataArray data array to extract object keys
   */
  extractKeysForReports(dataArray: any) {
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
  getPayrollAreaByPlant(plantCode: any): Observable<any> {
    return new Observable((observer) => {
      try {
        this.apiService.getPayrollAreaByPlantcode(plantCode).subscribe({
          next: (response) => {
            observer.next(response);
            observer.complete();
          },
          error: (error: any) =>
            this.messageService.add({
              severity: "error",
              summary: error.message,
            }),
        });
      } catch (err: any) {
        this.messageService.add({ severity: "error", summary: err.message });
      }
    });
  }

  /**
   * function to check white space
   * @return {boolean}
   */

  containsWhitespace(str: any): boolean {
    return /\s/.test(str);
  }

  /**
   * Throttling handle function
   * @property {*} milliSeconds
   */

  throttledClick() {
    if (this.throttleBtnState) return;
    this.throttleBtnState = true;
    console.log("Clicked!");
    // re-enable after 2s
    setTimeout(() => (this.throttleBtnState = false), environment.milliSeconds);
  }
  /**
   * export json data to excell sheet
   * @param data
   * @param plantCode
   * @param sheetName
   */
  jsonToExcellExport(data: any, plantCode: any, sheetName: any) {
    try {
      var ws = XLSX.utils.json_to_sheet(data);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${sheetName}_${plantCode}`);
      XLSX.writeFile(wb, `${sheetName}_${plantCode}.xlsx`);
      this.messageService.add({ severity: "info", summary: "Data Exported!" });
    } catch (error) {
      console.error("ERROR:", error);
      this.messageService.add({ severity: "error", summary: "Error Occured!" });
    }
  }

  /**
   * remove duplicate object
   * @param array 
   * @returns {[]}
   */
  removeDuplicateObjects(array: any):any {
    const uniqueArray = Array.from(
      new Set(array.map((item:any) => JSON.stringify(item)))
    ).map((item:any) => JSON.parse(item));
     return uniqueArray;
  }

   /**
   * remove duplicate object
   * @param array 
   * @returns {[]}
   */
  removeDuplicateObjectsInArray(array: any):any {
    const uniqueArray = Array.from(
      new Set(array.map((item:any) => item))
    ).map((item:any) => item);
     return uniqueArray;
  }
 
}
