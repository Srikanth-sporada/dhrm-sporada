import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors,
  AbstractControl,
  AsyncValidatorFn,
} from "@angular/forms";
import { FormService } from "../../form.service";
import { ActivatedRoute } from "@angular/router";
import { get } from "http";
import { ApiService } from "src/app/home/api.service";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})

export class CategoryComponent implements OnInit {
  @Output() emit = new EventEmitter<any>();
  category = new FormControl("", Validators.required);
  contractor_id = new FormControl("", Validators.required);
  dept_Id = new FormControl("", Validators.required);
  Role_id = new FormControl("", Validators.required);
  line_Id = new FormControl("",Validators.required);
  line_data:any
  Bodhi_training = new FormControl("", Validators.required);
  plant_Code: any = sessionStorage.getItem('plantcode');
  categories: any[];
  mob: any;
  dept_data: any;
  requiredAge: any;
  currentAge: any;
  isHR: any;
  company: any;
  Role_data:any
  contractors: any[];
  is_contract: any = 0;
  disbale: boolean = true;
  //constructor(private fromservice: FormService) {}
  constructor(private fromservice: FormService, 
    private route: ActivatedRoute,
    private service: ApiService,
    private messageService:MessageService) {
    this.isHR = sessionStorage.getItem("ishr");
  }

  ngOnInit() {
    console.log(this.category);
    this.get_Dept()
    this.route.params.subscribe((params) => {
      this.mob = params["mobile_no1"];
      this.company = params["company"];
      line_id: ['', Validators.required]
    });

    this.fromservice.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
    this.fromservice.getContracts(this.mob).subscribe((data: any) => {
      console.log(data.data);
      this.contractors = data.data;
    });
    this.fromservice
      .getdatabasic({ mobile: this.mob, company: this.company })
      .subscribe((data: any) => {
        if (
          data[0].apprentice_type == "null" ||
          data[0].apprentice_type == null
        ) {
          this.category.setValue("");
        } else {
          this.category.setValue(data[0].apprentice_type);
          this.onchange();
        }

        if (data[0].cont_id == null || data[0].cont_id == "null") {
          this.contractor_id.setValue("");
        } else {
          this.is_contract = true;
          this.contractor_id.setValue(data[0].cont_id);
          this.onchange();
        }
        if (data[0].Role_Id == null || data[0].Role_Id == "null") {
          this.Role_id.setValue("");
        } else {
       
          this.Role_id.setValue(data[0].Role_Id);
          this.onchange();
        }
        if (data[0].dept_slno == null || data[0].dept_slno == "null") {
          this.dept_Id.setValue("");
        } 
        else 
        {
          this.dept_Id.setValue(data[0].dept_slno);
          this.onchange();
        }
        if (data[0].line_id == null || data[0].line_id == "null") 
          {
          this.line_Id.setValue("");
          }
          else
          {
           this.line_Id.setValue(data[0].line_id);
           this.onchange();

          }
      }, (error) => {
        console.log(error)
      });
  }

  save() {
    if (this.Bodhi_training.value !== "" &&
        this.dept_Id.value !== "" &&
        this.Role_id.value !== "" &&
      this.line_Id.value!=="" ) {
      this.fromservice.submitCategory2(this.Bodhi_training.value, this.dept_Id.value, this.Role_id.value,this.line_Id.value)
      .subscribe((res:any)=>{
        console.log('Data saved successfully');
            // this.resetForms();
            this.messageService.add({severity:'info',summary:'Application has been Saved successfully.'})
            // alert('Application has been Saved successfully.');
      }, (error:any) => {
        console.error('Error saving data', error);
        if (error.status === 400) {
          console.log(error);
          this.messageService.add({severity:'info',summary:error.error.message})
          // alert(error.error.message);
        } else {
          this.messageService.add({severity:'info',summary:`An unexpected error occurred. Status code: ${error.status}`})
          // alert(`An unexpected error occurred. Status code: ${error.status}`);
        }
      })
      // this.fromservice.submitCategory(this.Bodhi_training.value, this.dept_Id.value, this.Role_id.value);  
    } else {
          this.messageService.add({severity:'info',summary:"Please fill all required fields before saving."})
      // alert("Please fill all required fields before saving.");
    }
  }
  get_Dept(){
    this.fromservice.getDepList(this.plant_Code).subscribe({
      next: (resp: any) => {
        console.log(resp);
        
        this.dept_data = resp;
      },
      error: (error) => console.log(error)
    });
  }
  onchange_Dept(event:any){
    console.log(this.dept_Id.value);
    this.isvalid()
   this.onchange()
   this.get_Line_Name();
    this.getRoleData();

    //this.getLineName(event)
  }
  get_Line_Name() {
    var dept = { dept_slno: this.dept_Id }

    this.fromservice.getLineName(this.dept_Id.value).subscribe({
      next: (response: any) => {
        console.log(response);
        
        this.line_data = response[0];
  
    // this.service.getLineName(dept).subscribe({
    //   next: (resp: any) => {
    //     this.line_data = resp[0];  
    //     console.log(this.line_data);
    //             // Line list
    //      // Optional
      },
      error: (err) => {
        console.error('Failed to fetch line data', err);
      }
    });
  }
  getRoleData() {
    console.log('dept',this.dept_Id.value);
    
    this.fromservice.get_Indirect_dtls(this.plant_Code ,this.dept_Id.value).subscribe({
      next: (response: any) => {
        console.log(response);
        
        this.Role_data = response
     
        //.filter((data: any) => data.dept_slno === this.selectedDept);
      },
      error: (error) => console.log(error)
    });
  }
  onchange() {
    console.log('Role_id value:', this.Role_id.value);
    console.log('dept_id value:', this.dept_Id.value);
    console.log('line_id value:', this.line_Id.value);
    this.fromservice.checkcategory(this.category.value, this.mob).subscribe({
      next: (response: any) => {
        let cat_details = this.categories.filter((element: any) => {
          return element.categorynm == this.category.value;
        });
        this.is_contract = !cat_details[0].file_drop;
        if (response.isInvalid == true) {
          this.category.setErrors({ invalidCategory: true });
          this.emit.emit({ category: true,Bodhi_training: this.Bodhi_training.value,dept_Id:this.dept_Id.value,Role_id:this.Role_id.value,Line_id:this.line_Id.value });
        } else {
          this.category.setErrors(null);
          if (this.is_contract && this.contractor_id.value == "") {
            this.emit.emit({ category: true ,Bodhi_training: this.Bodhi_training.value,dept_Id:this.dept_Id.value,Role_id:this.Role_id.value,Line_id:this.line_Id.value });
          } else {
            if (this.is_contract) {
              this.fromservice.cont_id = this.contractor_id.value;
            } else {
              this.fromservice.cont_id = undefined;
              this.contractor_id.setValue("");
            }
            this.fromservice.category = this.category.value;
            this.fromservice.mobile = this.mob;

            this.emit.emit({ category: false ,Bodhi_training: this.Bodhi_training.value,dept_Id:this.dept_Id.value,Role_id:this.Role_id.value });
          }
        }
        this.isvalid();
        this.requiredAge = response.requiredAge;
        this.currentAge = response.currentAge;
      },
    });
  }
  isvalid() {
    console.log('inside valid');
    console.log('this.is_contract',this.is_contract);
    console.log('this.category.status',this.category.status);
    console.log('this.contractor_id.value',this.contractor_id.value);
    console.log('this.Bodhi_training.value',this.Bodhi_training.value);
    console.log('this.dept_Id.value',!this.dept_Id.value);
    console.log('this.Role_id.value',!this.Role_id.value);
    console.log('this.line_id.value',!this.line_Id.value);
    
    console.log(this.is_contract , this.category.status == "VALID" , this.contractor_id.value!="" , this.Bodhi_training.value , this.dept_Id.value  , this.Role_id.value);
    console.log(this.is_contract && this.category.status == "VALID" && this.contractor_id.value!="" && this.Bodhi_training.value && this.dept_Id.value  && this.Role_id.value);
    
    
    // if (this.category.errors?.["invalidCategory"]) {
    //   this.disbale = true;
    // } else 
    if (this.is_contract && this.category.status == "VALID" && this.contractor_id.value!="" && this.Bodhi_training.value && this.dept_Id.value  && this.Role_id.value) {
        this.disbale = false;
        console.log('1');
        
    } 
    else if (this.category.status == "VALID" && !this.is_contract && this.Bodhi_training.value && this.dept_Id.value  && this.Role_id.value) {
      this.disbale = false;
      console.log('2');
      
    }
    // else if (!this.Bodhi_training) {
    //   this.disbale = false;
    // }
    // else if (!this.dept_Id) {
    //   this.disbale = false;
    // }
    // else if (!this.Role_id) {
    //   this.disbale = false;
    // }
     else {
      this.disbale = true;
    }
  }
}

// function usernameTakenValidator(
//   fromservice: FormService,
//   route: ActivatedRoute
// ): AsyncValidatorFn {
//   return (control: AbstractControl): Observable<any> => {
//     const value:any = control.value;
//     let mobile:any;
//     route.params.subscribe((params) => {
//       mobile = params["mobile_1"];
//     });
//     return fromservice.checkcategory(value, mobile).pipe(map(res => {
//       if(res == true){
//         return {usernameTaken: true}
//       }

//     }),
//     catchError(() => {
//       return of({ customValidation: true });}
//     ))

//   };
// }
