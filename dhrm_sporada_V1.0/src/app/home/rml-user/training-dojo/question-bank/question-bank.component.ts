import { Component, OnInit } from "@angular/core";
import { FormGroup, UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Route } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-trainee-test",
  templateUrl: "./question-bank.component.html",
  styleUrls: ["./question-bank.component.css"],
})
export class QuestionBankComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formtest: FormGroup = new FormGroup({});
  flag: any = true;
  loading: any = false;
  modules: any;
  filename: any = [];
  url = environment.path + "/qbank/";
  plant: any;
  all: any;
  userDetails: any;
  sheight: any;
  height: any;
  // answer:any = ['']
  questions: any = [{}];
  inserted: any = 1;
  // username = {'username': sessionStorage.getItem('plantcode')}
  username: any;
  sno: any = -1;
  offline_flag: boolean = true;
  qsize: any;

  constructor(
    private fb: UntypedFormBuilder,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    public loader: LoaderserviceService,
    private messageService: MessageService
  ) {
    /** question bank form */
    this.form = fb.group({
      module: [""],
      username: [sessionStorage.getItem("user_name")],
      plantcode: [sessionStorage.getItem("plantcode")],
    });
  }

  ngOnInit(): void {
    /** loged in user data */
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails =
        this.all.Emp_Name.toUpperCase() +
        `(${this.all.User_Name})` +
        "-" +
        this.all.dept_name +
        "-" +
        this.all.plant_name;
    }

    this.plant = sessionStorage.getItem("plantcode");
    this.username = sessionStorage.getItem("user_name");
    console.log("user & plant", this.username, this.plant);
    /** get training modules */
    this.getTrainingModules();
  }

  /**
   * get training modules 
   * @property {*} modules
   * @property {*} username 
   * @property {*} plant
   * */
  getTrainingModules() {
  try{
     this.service.getModulesQa(this.username, this.plant).subscribe({
      next: (response) => {
        console.log('MODULES RES:',response);
        this.modules = response;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  } catch(error:any){
    console.error('ERROR:',error);
    this.messageService.add({severity:'warn',summary:'Oops! something went wrong.'});
  }
  }

  /**
   * get training module question
   * @param event 
   * @property {boolean} offline_flag
   * @property {*} questions
   * @property {*} qsize
   * @property {*}
   */
  getquestions(event: any) {
    try{
      this.flag = false;
    /** offline module flag */
    if (event.value.category == "OFFLINE") {
      this.offline_flag = false;
    } else {
      this.offline_flag = true;
    }
    console.log('SELECETED MODULE:',event.value);
    /** get module question API */
    this.service
      .getQuestions_tnr({
        module: event.value.module_name,
        plant_code: this.plant,
      })
      .subscribe({
        next: (response: any) => {
          console.log('MODULE QUESTION:',response);
          this.questions = response;
          this.qsize = this.questions.length;
          /** insert new question.index + 1 */
          this.questions.push({});
        },
        error: (error:any) => {
          console.error('ERROR:',error);
           this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        }
      });
    } catch(error){
      console.error('ERROR:',error);
      this.messageService.add({severity:'warn',summary:'Oops! something went wrong.'});
    }
  }

  /** 
   * add new question table row
   * @property {*} question
   * @property {*} inserted // to find 
   */
  addrow(i: any) {
    if (this.form.controls["module"].value == "") {
      this.messageService.add({
        severity: "warn",
        summary: "Please Select A Module!",
      });
      // alert('please select a module')
    } else {
      /** based on index add new row */
      if (i == this.questions.length - 1) {
        this.questions.push({});
        this.inserted += 1;
        console.log('INSERTED NEW ROW INDEX:',this.inserted);
      }
    }
  }

  /** reset form */
  clearForm(): void {
    this.form.controls["module"].setValue("");
    this.offline_flag = true;
    this.questions = [{}];
    this.inserted = 1;
    console.log("Form cleared");
  }

  /** 
   * set user entered question value into question[index].question
   * @param event
   * @param i // question array index
   */
  question(event: any, i: any) {
    this.questions[i].question = event.target.value;
    console.log('QUESTION:',this.questions[i]);
  }

  /**
   * set user entered question answer value into question[index].correct_answer
   * @param event
   * @param i
   */
  answers(event: any, i: any) {
    console.log('ANSWER:',event.target.value);
    this.questions[i].correct_answer = event.target.value.toUpperCase();
    console.log('QUESTION:',this.questions[i]);
  }

  /** 
   * handle question file upload
   * @var exten // file extension
   * @var formData
   * @param event
   * @param i
  */
  file(event: any, i: any) {
    try{
       var exten = event.target.files[0].name.split(".");
    exten = exten.pop();
    var formData = new FormData();

    /** rename file name */
    formData.append(
      "file",
      event.target.files[0],
      this.form.controls["module"].value.module_name +
        "_" +
        (i + 1) +
        "_picture." +
        exten
    );
    /** set question file path */
    this.questions[i].image_filename =
      this.form.controls["module"].value.module_name +
      "_" +
      (i + 1) +
      "_picture." +
      exten;
  /** question bank image file upload API call */
    this.service.questionbankupload(formData).subscribe({
      next: (res: any) => {
        console.log('FILE UPLOAD RES:',res);
        if (res.message == "success") {
          this.messageService.add({
            severity: "info",
            summary: "Question Uploaded Successfully.",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Oops Error Occured!",
          });
        }
      },
      error: (err) => {
        console.error('ERROR:',err);
        this.messageService.add({ severity: "error", summary: err.message });
      },
    });
    } catch(error:any) {
      console.error('ERROR:',error);
      this.messageService.add({severity:'warn',summary:'Oops! something went wrong.'});
    }
  }

  /** 
   * submit question
   * @property {*} questions
   *  */
  submit() {
    try{
      // console.log(this.questions);
    console.log(this.form.value);

    this.questions[this.questions.length - 1] = {
      module: this.form.controls["module"].value.module_name,
      plantcode: sessionStorage.getItem("plantcode"),
      inserted: this.inserted,
    };
   console.log('QUESTION OBJ:',this.questions);

    // this.service.questionbank(this.questions).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     if (res.message == "success") {
    //       this.messageService.add({
    //         severity: "info",
    //         summary: "Question Updated Successfully.",
    //       });
    //       // alert("The questions have been updated.");
    //       location.reload();
    //     }
    //   },
    //   error: (err) => {
    //     console.error('ERROR:',err);
    //     this.messageService.add({ severity: "error", summary: err.message });
    //   },
    // });
    } catch(error:any){
      console.error('ERROR:',error);
      this.messageService.add({severity:'warn',summary:'Oops! something went wrong.'});
    }
  }

  /**
   * delete questions
   * @param i 
   */
  delete(i: any) {
    try{
       console.log(this.questions[i].question);
    if (this.questions.length != 1 && this.questions.length != i + 1) {
      this.service
        .questionBankDelete({ qslno: this.questions[i].qslno })
        .subscribe({
          next: (res: any) => {
            console.log("qdel", res);
            if (i + 1 >= this.qsize) {
              this.inserted -= 1;
              console.log(this.inserted, this.qsize);
            }
          },
          error: (error) =>
            this.messageService.add({
              severity: "error",
              summary: error.message,
            }),
        });
      this.questions.splice(i, 1);
    }
    console.log(this.questions);
    } catch(error:any){
      console.log('ERROR:',error);
    }
  }
}
