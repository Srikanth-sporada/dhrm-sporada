import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { ApiService } from 'src/app/home/api.service';
import {ToastComponent} from 'src/app/new-contractor-mod/toast/toast.component'
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-coffpopup',
  templateUrl: './coffpopup.component.html',
  styleUrls: ['./coffpopup.component.css']
})
export class CoffotpopupComponent implements OnInit {
  absentData:any
  selectAll:any=false
  sum:any=0;
  loading:any=false
  gen_id: any = sessionStorage.getItem("gen_id");
  user: any = sessionStorage.getItem("user");
  plant: any = sessionStorage.getItem("plantcode");

applyshow:boolean=false
agreed: boolean = false;

  constructor(private dailogRef:MatDialogRef<CoffotpopupComponent>,@Inject(MAT_DIALOG_DATA) public data:any,
  private apiService:ApiService,
  private dialog: MatDialog,
  private messageService:MessageService
  ) { }
  ngOnInit() {
    // console.log(this.data)
    // console.log(this.user)
    // console.log(this.data.apprentice_type ==="OPERATOR" && this.user ==="ars")
    

    this.showbutton()

    if (this.data.apprentice_type ==="OPERATOR" && this.user ==="ars"){
      this.apiService.getAbsentDays_Optr(this.data.emp_id).subscribe((response:any)=>{
        if(response.status=='failed'){
          this.messageService.add({severity:"warn",summary:response.message});
          // alert(response.message)
        }else{
          this.absentData=response.data.map((element:any)=>{
            return {...element,selected:false}
          })
          console.log(this.absentData)
        }
      }, (error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message});
      })
    }else{
      this.apiService.getAbsentDays(this.data.emp_id).subscribe((response:any)=>{
        if(response.status=='failed'){
          // alert(response.message)
          this.messageService.add({severity:"warn",summary:response.message});

        }else{
          this.absentData=response.data.map((element:any)=>{
            return {...element,selected:false}
          })
          console.log(this.absentData)
        }
      },(error) => {
        console.log(error);
        this.messageService.add({severity:'error',summary:error.message});
      })
    } 
  }




  checkItems(element:any) {
    let count = 0;
    for (let element of this.absentData) {
      if (element.selected == true) {
        count++;
      }
    }
    if (count == this.absentData.length) {
      this.selectAll = true;
    }
    if (count < this.absentData.length) {
      this.selectAll = false;
    }
    let selectedItems = this.absentData.filter((element:any)=>{
      return element.selected
    })
    this.sum= selectedItems.reduce((acc:any,element:any)=>{
      console.log('acc+element.hrs_req',acc+element.hrs_req);
      
        return acc+element.hrs_req
    },0)
  }

  handelSelectAll() {
    if (this.selectAll) {
      this.absentData = this.absentData.map((element: any) => {
        return { ...element, selected: true };
      });
    } else {
      this.absentData = this.absentData.map((element: any) => {
        return { ...element, selected: false };
      });
    }
  }



  approve(){
    
    let selectedItems = this.absentData.filter((element:any)=>{
      return element.selected
    })
    if(selectedItems.length==0){
      // alert("Please select atleast one item");
          this.messageService.add({severity:"warn",summary:'Please select atleast one item.'});
      return
    }
    let data={
      data:selectedItems,
      apln_slno:this.data.emp_id,
      gen_id:this.data.gen_id,
      sup_id:sessionStorage.getItem('user_name')
    }
    this.loading=true
    this.apiService.approveCoff(data).subscribe((response:any)=>{
      if(response.status=='success'){
        // alert(response.message);
          this.messageService.add({severity:"info",summary:response.message});
        this.dailogRef.close()
      }else{
        // alert(response.message);
         this.messageService.add({severity:"warn",summary:response.message});
        this.dailogRef.close()
      }
      this.loading=false
    }, (error) => {
      console.log(error);
      this.messageService.add({severity:'error',summary:error.message});
    })
  }




  // -----------operator Coff
  
showbutton(){
  if (this.data.apprentice_type ==="OPERATOR" && this.user ==="ars"){
this.applyshow= true
  }
  else{
    this.applyshow= false
  }
}
  
  openAlertDialog(message: string , icon:string): void {
    this.dialog.open(ToastComponent, {
      data: {
        icon: icon,
        message: message
      }
    });
  }
apply_Operator_Coff(){
  let selectedItems = this.absentData.filter((element:any)=>{
    return element.selected
  })
  if(selectedItems.length==0){
    this.openAlertDialog("Please select atleast one item",'error');
    // alert("Please select atleast one item")
    return
  }
  if(this.agreed== false){
    this.openAlertDialog("Select Electronic Form Consent",'error');
    // alert("Please select atleast one item")
    return
  }
  let data={
    data:selectedItems,
    plant:this.plant,
    apln_slno:this.data.emp_id,
    gen_id:this.data.gen_id,
    // sup_id:sessionStorage.getItem('user_name')
  }
  this.loading=true


  console.log(data);

this.apiService.applyCoffByOptr(data).subscribe((res:any)=>{
  this.openAlertDialog(res,'check')
  this.dailogRef.close()
},(error:any) => {
  if (error.status === 400) {
    this.openAlertDialog(`${error.error}`,'error');
  this.dailogRef.close()

  }
   else {
    this.openAlertDialog('Error in connection','error');
  this.dailogRef.close(); 
  }
});
}

}
