import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from "@angular/forms";
import { FormService } from "../../form.service";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { ApiService } from "src/app/home/api.service";

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
  payscale_id = new FormControl("", Validators.required); //new
  line_data:any
  Bodhi_training = new FormControl("YES", Validators.required); // new
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
  // new
  payscales: any[] = [];
  payscale_Data: any;
  selectedPayscale: any;
  plant: any = sessionStorage.getItem("plantcode");
  payscaleForm = false;
  cont_id: any;

  NewPayScaleFormGroup: FormGroup;
  constructor(
    private fromservice: FormService, 
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService:MessageService,
    private service: ApiService,
  ) {
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
    /** get categories */
    this.fromservice.getCategories().subscribe({
      next: (data: any) => {
       this.categories = data; 
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
    });
    /** get contractors list */
    this.fromservice.getContracts(this.mob).subscribe({
      next: (data: any) => {
        console.log(data.data);
        this.contractors = data.data;
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
    /** get basics */
    this.fromservice
      .getdatabasic({ mobile: this.mob, company: this.company })
      .subscribe({
        next: (data: any) => {
        // category
        if (
          data[0].apprentice_type == "null" ||
          data[0].apprentice_type == null
        ) {
          this.category.setValue("");
        } else {
          this.category.setValue(data[0].apprentice_type);
          this.onchange();
        }
        // contractor
        if (data[0].cont_id == null || data[0].cont_id == "null") {
          this.contractor_id.setValue("");
        } else {
          this.is_contract = true;
          this.contractor_id.setValue(data[0].cont_id);
          this.onchange();
        }
        // role
        if (data[0].Role_Id == null || data[0].Role_Id == "null") {
          this.Role_id.setValue("");
        } else {
       
          this.Role_id.setValue(data[0].Role_Id);
          this.onchange();
        }
        if (data[0].dept_slno == null || data[0].dept_slno == "null") {
          this.dept_Id.setValue("");
        } 
	
      //Department
        if (data[0].dept_slno && data[0].dept_slno != "null") {
            this.dept_Id.setValue(data[0].dept_slno);
        }
        // line
        if (data[0].line_id == null || data[0].line_id == "null") 
          {
          this.line_Id.setValue("");
          }
          else
          {
           this.line_Id.setValue(data[0].line_id);
           this.onchange();
          }
        // Bodhi Training
        this.Bodhi_training.setValue(data[0].skip_training || "YES");
	
	// Payscale #new
	    if (data[0]?.payScaleInfo && data[0]?.payScaleInfo.PayScale_ID) {
	      this.payscale_id.setValue(data[0]?.payScaleInfo.PayScale_ID);
	      this.selectedPayscale = data[0].payScaleInfo.PayScale_ID;
	      this.payscaleForm = true;

	      // load payscale details first
	      this.get_Payscale(data[0]?.payScaleInfo.PayScale_ID);
	    }
	
	 // ✅ Now load dependent dropdowns & then emit #new
    	const tasks: Promise<any>[] = [];
	if (this.dept_Id.value) {
	   tasks.push(this.get_Line_Name());
	   tasks.push(this.getRoleData());
	}
	// #new
	if (this.is_contract && this.contractor_id.value) {
	    const contId = Number(this.contractor_id.value); // convert string to number
	    if (!isNaN(contId)) {
	      tasks.push(this.getPayScales(contId));
	    }
        }
	// #NEW
	 // Wait for all async dropdowns to finish, then emit
	    Promise.all(tasks).finally(() => {
	      this.emitFormData(false);
	    });
      },
      error: (error) => {
         console.error("ERROR:",error);
         this.messageService.add({severity:'error',summary:error?.message});
      }
      });
  // #NEW PAYSCALE FORM
    this.NewPayScaleFormGroup = this.fb.group({
      PayScale_ID: [null],
      Plant_Code: [null],
      Cont_ID: [null],
      PayScale_Name: [null],
      Stipend: [null],
      Basic: [null],
      DA: [null],
      HRA: [null],
      Leave_Salary: [null],
      Washing_allow: [null],
      Monthly_Bonus: [null],
      Sat_and_Mon_Incentive: [null],
      Monthly_Attn_Incentive: [null],
      Retention_Incentive: [null],
      Spl_allow: [null],
      Night_shift_allowance: [null],
      Skilled_allow_P3: [null],
      Amenities_Allow: [null],
      Other_allowance_1: [null],
      Other_allowance_2: [null],
      Other_allowance_3: [null],
      Other_allowance_4: [null],
      Gross_Earning: [null],
      Canteen: [null],
      Transport: [null],
      Professional_Tax: [null],
      WC_Policy: [null],
      Insurance: [null],
      Shoe_FirstTime: [null],
      Glass_FirstTime: [null],
      Uniform_FirstTime: [null],
      Coat_FirstTime: [null],
      Other_deduction_1: [null],
      Other_deduction_2: [null],
      Other_deduction_3: [null],
      Other_deduction_4: [null],
      Gross_Deduction: [null],
      Service_Charge_Fixed: [null],
      Service_charges_Percentage: [null],
      SC_Base: [null],
      NSDC_Contribution: [null],
      Uniform_Charges: [null],
      Labour_Welfare_Fund: [null],
      Insurance_Premium: [null],
      Learning_Fees: [null],
      Workmen_Compensation: [null],
      Emp_Comp_Ins: [null],
      Higher_Education_Fee: [null],
      EM_ESI_Cal_Val: [null],
      EM_PF_Cal_Val: [null],
      EMP_PF_Cal_Val: [null],
      EMP_ESI_Cal_Val: [null],
      EM_PF_Percent: [null],
      EM_ESI_Percent: [null],
      EMP_PF_Percent: [null],
      EMP_ESI_Percent: [null],
      Service_Tax_Val: [null],
      Servive_Charge_Val: [null],
      Effective_Date: [null],
      Effective_Date1: [null],
      CTC: [null],
      ToTal_Base_Value: [null],
      Net_Take_Home: [null],
    })
  }

  // save() {
  //   if (this.Bodhi_training.value !== "" &&
  //       this.dept_Id.value !== "" &&
  //       this.Role_id.value !== "" &&
  //     this.line_Id.value!=="" ) {
  //     this.fromservice.submitCategory2(this.Bodhi_training.value, this.dept_Id.value, this.Role_id.value,this.line_Id.value)
  //     .subscribe((res:any)=>{
  //       console.log('Data saved successfully');
  //           // this.resetForms();
  //           this.messageService.add({severity:'info',summary:'Application has been Saved successfully.'})
  //           // alert('Application has been Saved successfully.');
  //     }, (error:any) => {
  //       console.error('Error saving data', error);
  //       if (error.status === 400) {
  //         console.log(error);
  //         this.messageService.add({severity:'info',summary:error.error.message})
  //         // alert(error.error.message);
  //       } else {
  //         this.messageService.add({severity:'info',summary:`An unexpected error occurred. Status code: ${error.status}`})
  //         // alert(`An unexpected error occurred. Status code: ${error.status}`);
  //       }
  //     })
  //     // this.fromservice.submitCategory(this.Bodhi_training.value, this.dept_Id.value, this.Role_id.value);  
  //   } else {
  //         this.messageService.add({severity:'info',summary:"Please fill all required fields before saving."})
  //     // alert("Please fill all required fields before saving.");
  //   }
  // }

 // 🔹 Load initial data for category, contractor, role, dept, line #NEW
  loadInitialData() {
    this.fromservice
      .getdatabasic({ mobile: this.mob, company: this.company })
      .subscribe((data: any) => {
        const record = data[0];

        // Set category
        if (record.apprentice_type && record.apprentice_type != "null") {
          this.category.setValue(record.apprentice_type);
        }

        // Set contractor
        if (record.cont_id && record.cont_id != "null") {
          this.is_contract = true;
          this.contractor_id.setValue(record.cont_id);

          // ✅ Load payscales automatically
          this.getPayScales(record.cont_id);
        }

        // Set Role
        if (record.Role_Id && record.Role_Id != "null") {
          this.Role_id.setValue(record.Role_Id);
        }

        // Set dept
        if (record.dept_slno && record.dept_slno != "null") {
          this.dept_Id.setValue(record.dept_slno);

          // ✅ Load lines & roles automatically
          this.get_Line_Name();
          this.getRoleData();
        }

        // Set line
        if (record.line_id && record.line_id != "null") {
          this.line_Id.setValue(record.line_id);
        }
      });
  }


  // 🔹 Fetch categories #NEW
  getCategories() {
    this.fromservice.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

 // 🔹 Fetch contractors #NEW
  getContracts() {
    this.fromservice.getContracts(this.mob).subscribe((data: any) => {
      this.contractors = data.data;
    });
  }

  get_Dept(){
    this.fromservice.getDepList(this.plant_Code).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.dept_data = resp;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
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


  // get_Line_Name() {
  //   var dept = { dept_slno: this.dept_Id }

  //   this.fromservice.getLineName(this.dept_Id.value).subscribe({
  //     next: (response: any) => {
  //       console.log(response);
  //       this.line_data = response[0];
  //     },
  //     error: (error) => {
  //       console.error('ERROR', error);
  //       this.messageService.add({severity:'error',summary:error?.message})
  //     }
  //   });
  // }

  // getRoleData() {
  //   console.log('dept',this.dept_Id.value);
    
  //   this.fromservice.get_Indirect_dtls(this.plant_Code ,this.dept_Id.value).subscribe({
  //     next: (response: any) => {
  //       console.log(response);
  //       this.Role_data = response;
  //       //.filter((data: any) => data.dept_slno === this.selectedDept);
  //     },
  //     error: (error) => {
  //       console.error('ERROR:',error);
  //       this.messageService.add({severity:'error',summary:error?.message});
  //     }
  //   });
  // }


  /** get line name #new */
get_Line_Name(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.fromservice.getLineName(this.dept_Id.value).subscribe({
      next: (response: any) => {
        this.line_data = response[0];
        resolve(response);
      },
      error: (err) => {
        console.error('error in getting line:',err);
        this.messageService.add({severity:'error',summary:err?.message});
        reject(err);
      }
    });
  });
}


  // #new
  getRoleData(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.fromservice
      .get_Indirect_dtls(this.plant_Code, this.dept_Id.value)
      .subscribe({
        next: (response: any) => {
          this.Role_data = response;
          resolve(response);
        },
        error: (err) => {
        console.error('ERROR:',err);
        this.messageService.add({severity:'error',summary:err?.message});
        reject(err);
      },
      });
  });
  }
  

   // 🔹 Get payscales for contractor #new
  getPayScales(selectedConId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // need FE and API file
      this.fromservice.getContPayscale(selectedConId).subscribe({
        next: (res: any) => {
          this.payscales = res;
          resolve(res);
        },
        error: (err:any) => {
          console.log('ERROR:',err);
          this.messageService.add({severity:'error',summary:err?.message});
          reject(err);
        },
      });
    });
  }

    // 🔹 Get single payscale details #new
  get_Payscale(payId: any) {
    const data = {
      plant_Code: this.plant_Code,
      con_id: this.contractor_id.value,
      PayScale_ID: payId,
    };
    /** need FE and API */
    this.fromservice.getSinglePayscale(data).subscribe({
      next: (res: any) => {
        this.payscale_Data = res;
        if (Array.isArray(res) && res.length > 0) {
          this.payscaleForm = true;
          this.NewPayScaleFormGroup.patchValue(res[0]);
        }
      },
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      }
    });
  }

  // #new
  emitFormData(isInvalidCategory: boolean = false) {
      // Update service properties
      this.fromservice.category = this.category.value;
      this.fromservice.mobile = this.mob;
      if (this.is_contract) {
        this.fromservice.cont_id = this.contractor_id.value;
      }

      // Emit the event
      this.emit.emit({
        category: isInvalidCategory,
        Bodhi_training: this.Bodhi_training.value,
        dept_Id: this.dept_Id.value,
        Role_id: this.Role_id.value,
        Line_id: this.line_Id.value,
        payscale: this.selectedPayscale,
      });

      // Recheck validity
      this.isvalid();
   }

  //  #new
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
      error: (error:any) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      }
    });
  }

  // isvalid() {
  //   console.log('inside valid');
  //   console.log('this.is_contract',this.is_contract);
  //   console.log('this.category.status',this.category.status);
  //   console.log('this.contractor_id.value',this.contractor_id.value);
  //   console.log('this.Bodhi_training.value',this.Bodhi_training.value);
  //   console.log('this.dept_Id.value',!this.dept_Id.value);
  //   console.log('this.Role_id.value',!this.Role_id.value);
  //   console.log('this.line_id.value',!this.line_Id.value);
    
  //   console.log(this.is_contract , this.category.status == "VALID" , this.contractor_id.value!="" , this.Bodhi_training.value , this.dept_Id.value  , this.Role_id.value);
  //   console.log(this.is_contract && this.category.status == "VALID" && this.contractor_id.value!="" && this.Bodhi_training.value && this.dept_Id.value  && this.Role_id.value);
    
    
  //   // if (this.category.errors?.["invalidCategory"]) {
  //   //   this.disbale = true;
  //   // } else 
  //   if (this.is_contract && this.category.status == "VALID" && this.contractor_id.value!="" && this.Bodhi_training.value && this.dept_Id.value  && this.Role_id.value) {
  //       this.disbale = false;
  //       console.log('1');
        
  //   } 
  //   else if (this.category.status == "VALID" && !this.is_contract && this.Bodhi_training.value && this.dept_Id.value  && this.Role_id.value) {
  //     this.disbale = false;
  //     console.log('2');
      
  //   }
  //    else {
  //     this.disbale = true;
  //   }
  // }



   // 🔹 Separate change handlers
  
  // #new
   onCategoryChange() {
    this.fromservice.checkcategory(this.category.value, this.mob).subscribe({
      next: (response: any) => {
        const cat_details = this.categories.find(
          (el: any) => el.categorynm == this.category.value
        );
        this.is_contract = !cat_details?.file_drop;

        if (response.isInvalid) {
          this.category.setErrors({ invalidCategory: true });
          this.emitFormData(true);
        } else {
          this.category.setErrors(null);
          if (this.is_contract && this.contractor_id.value) {
            this.fromservice.cont_id = this.contractor_id.value;
            this.getPayScales(this.fromservice.cont_id);
          } else if (!this.is_contract) {
            this.fromservice.cont_id = undefined;
            this.contractor_id.setValue("");
            this.selectedPayscale = null;
            this.payscales = [];
          }

          this.emitFormData(false);
        }

        this.requiredAge = response.requiredAge;
        this.currentAge = response.currentAge;
      },
      error: (error) => {
        console.error("Error in checkcategory", error);
        this.messageService.add({severity:'error',summary:error?.message});
      },
    });
  }

/** on dojo change #new */
  onBodhiChange() {
   this.emitFormData();
  }

  /** on contractor change #new */
  onContractorChange() {
    if (this.contractor_id.value) {
      this.fromservice.cont_id = this.contractor_id.value;
      this.getPayScales(this.fromservice.cont_id);
    } else {
      this.fromservice.cont_id = undefined;
      this.payscales = [];
      this.selectedPayscale = null;
    }
    this.emitFormData();
  }
  /** on payscale change #bew  */
  onPayscaleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedPayscale = selectedValue;
    this.payscaleForm = true;
    this.get_Payscale(selectedValue);
    this.emitFormData();
  }

    /** dept change #new */
    onDeptChange() {
    this.get_Line_Name();
    this.getRoleData();
    this.emitFormData();
  }

  // #new
   onRoleChange() {
    this.emitFormData();
   }
 
   // #new
  onLineChange() {
    this.emitFormData();
  }

  // 🔹 Validation logic #new
  isvalid() {
    if (
      (this.is_contract &&
        this.category.status == "VALID" &&
        this.contractor_id.value &&
        this.Bodhi_training.value &&
        this.dept_Id.value &&
        this.Role_id.value &&
        this.selectedPayscale) ||
      (!this.is_contract &&
        this.category.status == "VALID" &&
        this.Bodhi_training.value &&
        this.dept_Id.value &&
        this.Role_id.value)
    ) {
      this.disbale = false;
    } else {
      this.disbale = true;
    }
  }

  // #new
  onInputChanged(event: any, controlName: string) {
    const newValue = event.target.value;
    const numericValue = parseFloat(newValue);
    this.NewPayScaleFormGroup.get(controlName)?.patchValue(numericValue);
  }

   // 🔹 Save form #new
  save() {
    if (
      this.Bodhi_training.value &&
      this.dept_Id.value &&
      this.Role_id.value &&
      this.line_Id.value
    ) {
      // need api & FE file
      this.fromservice
        .submitCategory2(
          this.Bodhi_training.value,
          this.dept_Id.value,
          this.Role_id.value,
          this.line_Id.value,
          this.selectedPayscale
        )
        .subscribe({
          next:  (res: any) => {
            console.log('category sumbit response:',res);
            this.messageService.add({severity:'info',summary:'Application has been Saved successfully.'})
          },
          error: (error: any) => {
            if (error.status === 400) {
              console.error('ERROR:',error);
              this.messageService.add({severity:'error',summary:error?.error?.message});
            } else {
              console.error('category form sumbit error:',error);
              this.messageService.add({severity:'error',summary:`An unexpected error occurred. Status code: ${error.status}`});
            }
          }
        });
    } else {
      this.messageService.add({severity:'warn',summary:'Please fill all required fields before saving.'})
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
