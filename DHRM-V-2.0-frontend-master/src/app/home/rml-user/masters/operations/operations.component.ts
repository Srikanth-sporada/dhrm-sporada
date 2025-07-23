import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';
import { LoaderserviceService } from 'src/app/loaderservice.service';
import { environment } from 'src/environments/environment.prod';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OperationsComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  closeResult: string = '';
  form: any;
  sample: any = environment.path;

  plantname: any;
  type = ['YES', 'NO'];
  departments: any = [];
  Lines: any = [];
  selectedFile: File | null = null;
  selectedFileName: string = '';
  dummy: any = [];
  editing_flag: boolean = false;
  temp_a: any;
  array: any = [];
  index: number = -1;
  is_admin: any = sessionStorage.getItem('isadmin');
  plant: any;
  selectedPlantCode: string = '';
  selectedPlantName: string = '';

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private service: ApiService,
    public loader: LoaderserviceService
  ) {
    this.form = this.fb.group({
      oprn_slno: [''],
      plant_name: [''],
      oprn_desc: [''],
      critical_oprn: [''],
      skill_level: ['', [allowedSkillLevels()]],
      Active_Sts: [''],
      Line: [''],
      Department: ['']
    });
  }

  // ngOnInit(): void {

  //   this.plant = sessionStorage.getItem('plantcode');

  //   this.getplantcode();
  //   if (this.plant) {
  //     this.service.getoperation(this.plant).subscribe({
  //       next: (response: any) => {
  //         console.log('open response', response);
  //         this.dummy = response.operations;
  //       }
  //     });
  //   }

  // }

  ngOnInit(): void {
    this.plant = sessionStorage.getItem('plantcode');

    this.getplantcode();

    if (this.is_admin === 'false') {
      this.form.get('plant_name')?.disable();
    }

    if (this.plant) {
      this.service.getoperation(this.plant, this.is_admin).subscribe({
        next: (response: any) => {
          console.log('open response', response);
          this.dummy = response.operations;

          // ✅ Save the plant code and name
          this.selectedPlantCode = response.PlName.plant_code;
          this.selectedPlantName = response.PlName.plant_name;
        }
      });
    }
  }


  getplantcode() {
    const company = { company_name: sessionStorage.getItem('companycode') };
    this.service.plantcodelist(company).subscribe({
      next: (response) => {
        this.plantname = response;
        for (const o in this.plantname) {
          this.array.push(this.plantname[o].plant_name);
        }
      },
      error: (error) => console.log(error)
    });
  }

  // open(content: any) {
  //   this.form.reset();
  //   this.editing_flag = false;
  //   this.departments = [];
  //   this.modalService.open(content, { centered: true });
  // }

  open(content: any) {
    this.form.reset();
    this.editing_flag = false;
    this.departments = [];

    // ✅ Set and disable plant name field
    this.form.get('plant_name').setValue(this.selectedPlantCode);
    this.onPlantSelect(this.selectedPlantName);

    this.modalService.open(content, { centered: true });
  }


  openForEdit(index: number, slno: any, content: any) {
    this.edit(index, slno);
    this.opentoedit(content);
  }

  opentoedit(content: any) {
    this.modalService.open(content, { centered: true });
  }

  onPlantSelect(event: any) {
    const selectedPlantCode = event;
    if (selectedPlantCode) {
      this.service.getoprnDept(selectedPlantCode).subscribe({
        next: (response) => {

          console.log('Departments response:', response);
          console.log('Type:', typeof response);
          this.departments = response;
        },
        error: (error) => console.log(error)
      });
    } else {
      this.departments = [];
    }
  }

  onPlantChange(event: any) {
    const selectedPlantCode = event.target.value;

    // Find the selected plant object
    const selectedPlant = this.plantname.find((plant: any) => plant.plant_code === selectedPlantCode);

    // Set plant code and name
    this.selectedPlantCode = selectedPlantCode;
    this.selectedPlantName = selectedPlant?.plant_name || '';

    // Set the form value
    this.form.get('plant_name').setValue(selectedPlantCode);

    // ✅ Pass the plant_name to onPlantSelect
    this.onPlantSelect(this.selectedPlantName);
  }


  get_slno(event: any) {
    const fullValue = event.target.value;
    const selectedPlantCode = fullValue.split(':')[0];
    const selectedPlantName = fullValue.split(':')[1]?.trim();

    this.index = parseInt(selectedPlantCode) - 1;
    this.onPlantSelect(selectedPlantName);
  }

  get_dep_no(event: any) {
    const fulldep = event.target.value;
    const selectedDep = fulldep.split(':')[1]?.trim();

    this.service.getoprnLine(selectedDep).subscribe({
      next: (response) => {
        this.Lines = response;
      },
      error: (error) => console.log(error)
    });
  }

  edit(a: number, slno: any) {
    this.form.get('plant_name').disable();
    this.form.get('Department').disable();
    this.editing_flag = true;
    this.temp_a = a;

    // const selectedPlant = this.dummy[a].plant_name;
    const selectedDepartment = this.dummy[a].Department;

    this.onPlantSelect(this.selectedPlantName);

    setTimeout(() => {
      this.get_dep_no({ target: { value: `dummy: ${selectedDepartment}` } });
    }, 200);

    this.form.controls['plant_name'].setValue(this.selectedPlantCode);
    this.form.controls['oprn_slno'].setValue(slno);
    this.form.controls['oprn_desc'].setValue(this.dummy[a].oprn_desc);
    this.form.controls['skill_level'].setValue(this.dummy[a].skill_level);
    this.form.controls['Department'].setValue(this.dummy[a].Department);
    this.form.controls['Line'].setValue(this.dummy[a].Line_code);

    const fileName = this.dummy[a]?.oprn_file;
    this.selectedFileName = fileName ? `${this.sample}/oprn_file/${fileName}` : '';

    this.form.controls['critical_oprn'].setValue(this.dummy[a].critical_oprn ? 'YES' : 'NO');
    this.form.controls['Active_Sts'].setValue(this.dummy[a].del_status === 'Y' ? 'YES' : 'NO');
  }

  save(modal: any) {
    console.log('coming')
    const requiredFields = [
      'plant_name',
      'oprn_desc',
      'Department',
      'skill_level',
      'Line',
      'critical_oprn',
      'Active_Sts'
    ];

    for (const field of requiredFields) {
      if (!this.form.get(field).value) {
        alert(`Please fill the required field: ${field.replace(/_/g, ' ')}`);
        return;
      }
    }

    for (const field of requiredFields) {
      const control = this.form.get(field);

      if (!control?.value) {
        alert(`Please fill the required field: ${field.replace(/_/g, ' ')}`);
        return;
      }

      if (field === 'skill_level' && control.invalid) {
        alert('Skill level must be either 1, 2, 3, or 4.');
        return;
      }
    }

    // if (this.is_admin === 'true') {
    //   this.form.get('plant_name').setValue(this.plantname[this.index].plant_code);
    // } else {
    //   this.form.get('plant_name').setValue(sessionStorage.getItem('plantcode'));
    // }

    const formData = {
      ...this.form.value,
      file_name: this.selectedFileName || ''
    };

    this.service.addoperation(formData).subscribe({
      next: (response: any) => {
        if (response.message === 'inserted') {
          alert('Operation Added Successfully');
        } else {
          alert('Error While Adding Operation');
        }

        modal.close('Close click');
        this.refreshData();
      }
    });
  }

  editSave(modal: any) {
    this.form.get('plant_name').enable();
    const departmentValue = this.form.get('Department')?.value;
    const lineValue = this.form.get('Line')?.value;

    const requiredFields = [
      'plant_name',
      'oprn_desc',
      'Department',
      'skill_level',
      'Line',
      'critical_oprn',
      'Active_Sts'
    ];

    for (const field of requiredFields) {
      const control = this.form.get(field);

      if (!control?.value) {
        alert(`Please fill the required field: ${field.replace(/_/g, ' ')}`);
        return;
      }

      if (field === 'skill_level' && control.invalid) {
        alert('Skill level must be either 1, 2, 3, or 4.');
        return;
      }
    }

    const afterUpload = (fileName: string) => {
      const updatedFormData = {
        ...this.form.value,
        Department: departmentValue,
        Line: lineValue,
        file_name: fileName
      };

      this.service.updateoperation(updatedFormData).subscribe({
        next: (response: any) => {
          if (response.message === 'updated') {
            alert('Operation Updated Successfully');
            this.refreshData();
            modal.close('Close click');
            location.reload();
          }
        }
      });
    };

    // If file is selected, upload first
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.service.addoperationWithFile(formData).subscribe({
        next: (res) => {
          const uploadedFileName = this.selectedFile?.name || '';
          this.selectedFileName = uploadedFileName;
          afterUpload(uploadedFileName);  // Proceed after upload
        },
        error: (err) => {
          console.error('Upload error:', err);
          alert('File upload failed.');
        }
      });
    } else {
      afterUpload(this.selectedFileName); // Proceed without file upload
    }
  }


  refreshData() {
    this.service.getoperation(this.plant, this.is_admin).subscribe({
      next: (response: any) => {
        this.dummy = response.operations;
      }
    });
    this.form.reset();
    this.index = -1;
  }

  delete(a: any, slno: any) {
    this.service.deleteoperation({ slno }).subscribe({
      next: (response: any) => {
        if (response.message === 'success') {
          this.dummy.splice(a, 1);
        }
      }
    });
  }

  // exportexcel(): void {
  //   const newKeys: any = {

  //     plant_name: 'Plant Name',
  //     oprn_slno: 'Oprn ID',
  //     oprn_desc: 'Descriptions',
  //     skill_level: 'Skill Level',
  //     critical_oprn: 'Critical Operation',
  //     Line_Name: 'Line',
  //     dept_name: 'Department'
  //   };

  //   const allowedKeys = Object.keys(newKeys);

  //   const transformedArray: any = this.dummy.map((obj: any) => {
  //     const transformedObj: any = {};
  //     allowedKeys.forEach((key) => {
  //       transformedObj[newKeys[key]] = obj[key];
  //     });
  //     return transformedObj;
  //   });

  //   const ws = XLSX.utils.json_to_sheet(transformedArray);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'operations.xlsx');
  // }

  exportexcel(): void {
    const newKeys: any = {
      plant_name: 'Plant Name',
      oprn_slno: 'Oprn ID',
      oprn_desc: 'Descriptions',
      skill_level: 'Skill Level',
      critical_oprn: 'Critical Operation',
      dept_name: 'Department',
      Line_Name: 'Line'

    };

    const allowedKeys = Object.keys(newKeys);

    const transformedArray: any = this.dummy.map((obj: any, index: number) => {
      const transformedObj: any = {
        'Sl No': index + 1 // Add Serial Number
      };
      allowedKeys.forEach((key) => {
        transformedObj[newKeys[key]] = obj[key];
      });
      return transformedObj;
    });

    const ws = XLSX.utils.json_to_sheet(transformedArray);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'operations.xlsx');
  }



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      // DO NOT upload here
    }
  }


  triggerFileInput() {
    console.log("Button clicked!");  // Log button click event

    // Trigger file input click
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }


  reset() {
    this.form.reset();
  }
}

export function allowedSkillLevels(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const allowedValues = [1, 2, 3, 4];
    return allowedValues.includes(+control.value) ? null : { invalidSkillLevel: true };
  };
}
