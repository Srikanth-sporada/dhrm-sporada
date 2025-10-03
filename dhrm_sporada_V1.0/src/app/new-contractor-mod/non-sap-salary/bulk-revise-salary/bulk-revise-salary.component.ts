import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {ClamAPIService} from '../../clam-api.service'
import { MatDialog } from '@angular/material/dialog';
import { ToastComponent } from '../../toast/toast.component';
import { Location } from '@angular/common';
import * as XLSX from'xlsx'
import * as moment from 'moment';
import {LoaderserviceService} from '../../../loaderservice.service'
@Component({
  selector: 'app-bulk-revise-salary',
  templateUrl: './bulk-revise-salary.component.html',
  styleUrls: ['./bulk-revise-salary.component.css']
})
export class BulkReviseSalaryComponent implements OnInit {
  updateList: any;
  uploadedFile:any
  nonVerifiedData: any[];
  parsedData: any[];
  verifiedData: any[];
  selectedFile:any
  plant_Code: any = sessionStorage.getItem('plantcode');
  userEmpcode:string |null = sessionStorage.getItem('user_name');
  viewtable=false
  constructor(
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
     private api:ClamAPIService,
     public loader: LoaderserviceService,
     public router: Router) {}

  ngOnInit(): void {
  }

  downloadList(): void {
    this.api.get_wageList_For_Revise(this.plant_Code).subscribe(
      (res: any) => {
        this.updateList = res;
        console.log(this.updateList);

        if (Array.isArray(this.updateList) && this.updateList.length > 0) {
          const transformedArray = this.transformData(this.updateList);
          this.exportToExcel(transformedArray);
        } else {
          console.error('Received an empty or invalid response from the API');
        }
      },
      (error: any) => {
        console.error('Error fetching data from the API:', error);
      }
    );
  }
  formatDateWithHr(inputDate: Date): String {
    const parsedDate = moment(inputDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
    return formattedDate;
  }

   transformData(data: any[]): any[] {
    const newKeys: Record<string, string> = {
      Sal_Id:'Sal_Id',
      Plant_code: 'Plant_code',
          Cont_Id: 'Cont_Id',
          Cont_company_name: 'Contractor_Company',
          Apln_Slno:'Apln_Slno',
          Gen_Id:'Gen_Id',
          fullname: 'Employee_Name',
          dept_name: 'Department',
          apprentice_type:'Category',
          Payscale_SlNo:'Payscale_SlNo',
          Basic_amt: 'Basic',
          DA_amt:'DA',
          Conveyance_amt:'Conveyance',
          
          Stipend:'Stipend',
          Leave_Sal_allow_amt:'Leave_Salary_Allowannce',
          Food_Allow_amt:'Food_Allowannce',
          Medi_Allow_amt:'Medical_Allowannce',
          Attnd_Allow_amt:'Attendance_Allowannce',
          Spcl_Allow_amt:'Special_Allowannce',
          Night_Shift_Allow_amt:'Night_Shift_Allowannce',
          Skilled_Allow_amt:'Skilled_Allowannce',
          Unskilled_Allow_amt:'Unskilled_Allowannce',
          Transport_Allow_amt:'Transport_Allowannce',
          Washing_allow_amt:'Washing_Allowannce',
          Attendance_Bonus_amt:'Attendance_Bonus',
          Oth_Allow1_Name:'Other_Allowance_1_Name',
          Oth_Allow1_amt:'Other_Allowance_1_Amount',
          Oth_Allow2_Name:'Other_Allowance_2_Name',
          Oth_Allow2_amt:'Other_Allowance_2_Amount',
          Oth_Allow3_Name:'Other_Allowance_3_Name',
          Oth_Allow3_amt:'Other_Allowance_3_Amount',
          Oth_Allow4_Name:'Other_Allowance_4_Name',
          Oth_Allow4_amt:'Other_Allowance_4_Amount',
          Insurance_deduct_amt:'Insurance_Deduction',
          Canteen_deduct: 'Canteen_deduction',
          Oth_Deduct1_Name:'Other_Deduction_1_Name',
          Oth_Deduct1_amt:'Other_Deduction_1_Amount',
          Oth_Deduct2_Name:'Other_Deduction_2_Name',
          Oth_Deduct2_amt:'Other_Deduction_2_Amount',
          Oth_Deduct3_Name:'Other_Deduction_3_Name',
          Oth_Deduct3_amt:'Other_Deduction_3_Amount',
          Oth_Deduct4_Name:'Other_Deduction_4_Name',
          Oth_Deduct4_amt:'Other_Deduction_4_Amount',
          Bonus_Percent:'Bonus_Percent',
          Bonus_value:'Bonus_value',
          Ser_chrg_Percent:'Service_Charge_Percent',
          Ser_chrg_value:'Service_Charge_value',
          Ser_Tax_Percent:'Service_Tax_Percent',
          Ser_Tax_value:'Service_Tax_value',
          PF_Emp_Percent:'PF_Employee_Percent',
          PF_Emp_value:'PF_Employee_value',
          PF_Emplr_Percent:'PF_Employer_Percent',
          PF_Emplr_value:'PF_Employer_value',
          ESI_Emp_Percent:'ESI_Employee_Percent',
          ESI_Emp_value:'ESI_Employee_value',
          ESI_Emplr_Percent:'ESI_Employer_Percent',
          ESI_Emplr_value:'ESI_Employer_value',
          LWF_Emp_Percent:'LWF_Employee_Percent',
          LWF_Emp_value:'LWF_Employee_value',
          LWF_Emplr_Percent:'LWF_Employer_Percent',
          LWF_Emplr_value:'LWF_Employer_value',
          Effective_From: 'Current_Effective_From',
          New_effective_Date:'New_Effective_Date',
          Sal_Rev_No:'Sal_Rev_No',
          Total_Earn:'Total_Earning',
          Total_deduct:'Total_deduction',

          CTC_Value:'CTC_Value',
          NTH_Value:'NTH_Value',
    };

    return data.map((obj: any) => {
      const transformedObj: any = {};

      Object.keys(newKeys).forEach((key) => {
        const newKey = newKeys[key] || key;
        let value = obj[key];
     
        if (key === 'Effective_From' || key === 'Neweffective_Date') {
          if (typeof value === 'string') {
            value = new Date(value); 
          }
          if (value instanceof Date && !isNaN(value.getTime())) {
           
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const day = String(value.getDate()).padStart(2, '0');
            value = `${year}-${month}-${day}`;
          }
        }
        transformedObj[newKey] = value !== null ? value : null;
      });
      
     

      return transformedObj;
    });
  }



   exportToExcel(data: any[]): void {
    const wb = XLSX.utils.book_new();

  
    const ws = XLSX.utils.json_to_sheet(data);
  
  // Define cell styles for different header sections
  const styles = {
    blueHeader: {
      font: { color: { rgb: 'FFFFFF' } }, // White font
      fill: { fgColor: { rgb: '0000FF' } }, // Blue background
    },
    greenHeader: {
      font: { color: { rgb: 'FFFFFF' } }, // White font
      fill: { fgColor: { rgb: '00FF00' } }, // Green background
    },
    lightRedHeader: {
      font: { color: { rgb: 'FFFFFF' } }, // White font
      fill: { fgColor: { rgb: 'FF3333' } }, // Light Red background
    },
  };
  ws['A1'].s = { style: 'header' };


  // Apply styles to specific header ranges
  this.applyStyles(ws, 'A1:G1', styles.blueHeader);
  this.applyStyles(ws, 'H1:AD1', styles.greenHeader);
  this.applyStyles(ws, 'AE1:AN1', styles.lightRedHeader);

 

    // Apply styles here as needed

    XLSX.utils.book_append_sheet(wb, ws, 'wage List');
    XLSX.writeFile(wb, 'Wage_List.xlsx');
  }

  applyStyles(ws: XLSX.WorkSheet, range: string, style: any) {
    const rangeArray = XLSX.utils.decode_range(range);
    for (let row = rangeArray.s.r; row <= rangeArray.e.r; row++) {
      for (let col = rangeArray.s.c; col <= rangeArray.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) {
          ws[cellAddress] = {};
        }
        ws[cellAddress].s = style;
        
        // Debugging: Print cell address and style object
        console.log(`Applying style to cell ${cellAddress}:`, style);
      }
    }
  }
  
  // applyStyles(ws: XLSX.WorkSheet, range: string, style: any) {
  //   const rangeArray = XLSX.utils.decode_range(range);
  //   for (let row = rangeArray.s.r; row <= rangeArray.e.r; row++) {
  //     for (let col = rangeArray.s.c; col <= rangeArray.e.c; col++) {
  //       const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  //       if (!ws[cellAddress]) {
  //         ws[cellAddress] = {};
  //       }
  //       ws[cellAddress].s = style;
  //     }
  //   }
  // }
  
  handleFileInput(event: any): void {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
  
    fileReader.onload = (event: any) => {
      const binaryData = event.target.result;
      const workbook = XLSX.read(binaryData, {
        type: 'binary',
        cellDates: true, 
        dateNF: 'yyyy-mm-dd',
      });
      const sheetname = workbook.SheetNames[0];
       this.parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname], {
        raw: false, 
      });
      
      this.parsedData = this.convertDataTypes(this.parsedData);

      console.log(this.parsedData);
      // console.log(this.parsedData.length);
    };
  
    fileReader.readAsBinaryString(selectedFile);
  }
  

  convertDataTypes(data: any[]): any[] {
    return data.map((row) => {
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const value = row[key];
          if (value === 'null') {
            row[key] = null;
          } else if (!isNaN(value)) {
            row[key] = parseFloat(value);
          }
        }
      }
      return row;
    });
  }
  
  
  
  
  
  

verifyData(){
this.api.verify_Revise_salary(this.parsedData).subscribe(res=>{
 
  this.verifiedData= res.verifiedData
  this.nonVerifiedData= res.nonVerifiedData


  console.log('nonVerifiedData data' ,this.nonVerifiedData , typeof(this.nonVerifiedData))
  console.log('verifiedData data' ,this.verifiedData, typeof(this.verifiedData))
  this.viewtable =true
},(error)=>{
  console.log(error)
})


}

SubmitVerifiedData(data:any){
  const dataToSend = {
    verifiedData: data,
    userEmpcode: this.userEmpcode,
    currentDate: this.formatDateWithHr(new Date())
  };
  console.log(dataToSend)
this.api.bulk_Revise_Insert(dataToSend).subscribe((res)=>{
  console.log(res.message)
  alert(res.message)
  this.viewtable=false
  this.selectedFile = null;
},(error)=>{
  console.log(error)
  this.viewtable=true
})




}


  

}
