import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Route } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment.prod";
import { LoaderserviceService } from "src/app/loaderservice.service";
import {
  UntypedFormBuilder,
} from "@angular/forms";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-supervisor-question",
  templateUrl: "./supervisor-question.component.html",
  styleUrls: ["./supervisor-question.component.css"],
})
export class SupervisorQuestionComponent implements OnInit {
  /** question form */
  form: FormGroup = new FormGroup({});
  offline_flag: boolean = true;
  flag: any = true;
  qsize: any;
  questions: any = [{}];
  inserted: any = 1;
  modules: any;
  all: any;
  userDetails: any;
  username = { username: sessionStorage.getItem("plantcode") };
  plantcode = sessionStorage.getItem("plantcode");

  constructor(
    private fb: UntypedFormBuilder,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    public loader: LoaderserviceService,
    private messageService: MessageService
  ) {
    /** question form */
    this.form = fb.group({
      module: [""],
      username: [sessionStorage.getItem("user_name")],
      plantcode: [this.plantcode],
      ActSts: [""],
    });
  }

  ngOnInit(): void {
    /** logged in user data */
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
    /** get supervisor dept */
    this.getSupervisorDept();
  }

  /** 
   * get supervisor dept
   * @property {*} plantcode
   */
  getSupervisorDept(){
    this.service.getSupDept(this.plantcode).subscribe({
      next: (response) => {
        console.log('DEPT:',response);
        this.modules = response;
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }
  /** 
   * add row on click event 
   * @param i index
   * @property {*} questions
   * */
  addrow(i: any) {
    if (this.form.controls["module"].value == "") {
      // alert('Please select a Department');
      this.messageService.add({
        severity: "warn",
        summary: "Please Select Department",
      });
    } else {
      if (i == this.questions.length - 1) {
        this.questions.push({
          question: "",
          ActSts: true,
        });
        this.inserted += 1;
        // console.log(this.inserted);
      }
    }
  }

  /** 
   * add user input to question
   * @param event
   * @param i index
   * */ 
  question(event: any, i: any) {
    this.questions[i].question = event.target.value;
    console.log('QUESTION:',this.questions[i]);
    console.log("question index:", i);
    console.log("event:", event);
  }

  /** 
   * get depratment based questions
   * @param event
   * @var selectedDept // user selected dept
   * @property {*} qsize // question array size
   */
  getquestion(event: any) {
    const selectedDept = this.form.controls["module"].value;

    if (selectedDept) {
      this.flag = false;

      this.service
        .getSupQuestion({
          Department: selectedDept,
          Plant: sessionStorage.getItem("plantcode"),
        })
        .subscribe({
          next: (response: any) => {
            console.log("questions from backend", response);
            this.questions = response;
            this.qsize = this.questions.length;
            /** add default empty question */
            this.questions.push({
              question: "",
              ActSts: true,
            });
          },
          error: (error) => {
            console.error("Error fetching questions:", error);
            this.messageService.add({severity:'error',summary:error?.message})
          },
        });
    }
  }

  /** 
   * handle btn toggle
   * @param q question
   * @param event
   *  */
  handleToggle(q: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(
      `Before toggle - ActSts for question ID ${q.Abserv_id}:`,
      q.ActSts
    );

    q.ActSts = input.checked ? true : false;

    console.log(
      `After toggle - ActSts for question ID ${q.Abserv_id}:`,
      q.ActSts
    );
  }

  /** 
   * submit supervisor abservant question
   * @property {*} form-
   * @property {*} questions
   * @var payloadToSend
   */
  submit() {
    const selectedDept = this.form.controls["module"].value;

    if (!selectedDept) {
      // alert("Please select a Department.");
      this.messageService.add({
        severity: "warn",
        summary: "Please Select Department",
      });
      return;
    }
    // last question index
    const lastValidIndex = this.questions.length - 2;
    // last question question
    const lastQuestionText = this.questions[lastValidIndex]?.question;

    if (!lastQuestionText || lastQuestionText.trim() === "") {
      this.messageService.add({
        severity: "warn",
        summary: "Last question should not be empty",
      });
      return;
    }

    const filteredQuestions = this.questions
      .slice(0, this.questions.length - 1)
      .filter((q: any) => q.question && q.question.trim() !== "")
      .map((q: any) => ({
        Abserv_id: q.Abserv_id || null,
        question: q.question.trim(),
        module: selectedDept,
        plantcode: this.plantcode,
        ActSts: q.ActSts,
      }));

    const payloadToSend = [...filteredQuestions, { inserted: this.inserted }];
    console.log("payload", payloadToSend);

    this.service.SupAbserPoint(payloadToSend).subscribe({
      next: (res: any) => {
        console.log("sup", res);
        if (res.message === "success") {
          this.messageService.add({
            severity: "info",
            summary: "The Questions have been successfully saved.",
          });
          // location.reload();
          this.getquestion('event');
        } else {
          this.messageService.add({
            severity: "warn",
            summary:
              "There was an issue saving the questions. Please try again.",
          });
        }
      },
      error: (err) => {
        console.error("Error saving questions:", err);
        this.messageService.add({
          severity: "error",
          summary: "There was an error while saving the questions.",
        });
      },
    });

    console.log("Saving questions:", filteredQuestions);
  }

  clearForm(): void {
    this.form.controls["module"].setValue("");
    this.offline_flag = true;
    this.questions = [{}];
    this.inserted = 1;
    console.log("Form cleared");
  }
}
