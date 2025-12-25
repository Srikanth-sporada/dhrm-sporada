import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/home/api.service";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { environment } from "src/environments/environment.prod";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { Location } from "@angular/common";

@Component({
  selector: "app-trainee-test",
  templateUrl: "./trainee-test.component.html",
  styleUrls: ["./trainee-test.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class TraineeTestComponent implements OnInit {
  url: any = environment.path;
  form: FormGroup = new FormGroup({});
  formtest: FormGroup = new FormGroup({});
  ind: any;
  x: any;
  count: any = new Set();
  loading: any = false;
  modules: any;
  questions: any;
  answers: any = [
    {
      username: this.active.snapshot.paramMap.get("username"),
      apln_slno: "",
      module: "",
      pf: "",
      percent: "",
      priorityval: "",
    },
  ];
  test: any = ["pre-test", "post-test"];
  score: number[] = [0, 1];
  mark: any = 0;
  qualified: any = "you are qualified";

  username = { username: this.active.snapshot.paramMap.get("username") };

  choices = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
  ];
  flag: boolean = true;
  offline: string = "";
  imgUrl: any;
  selectedAnswers: string[] = [];
  userDetails: any;
  constructor(
    private fb: UntypedFormBuilder,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    public loader: LoaderserviceService,
    private modal: NgbModal,
    private messageService: MessageService,
    private location: Location
  ) {
    this.form = fb.group({
      module: [""],
      test: [""],
      username: [this.active.snapshot.paramMap.get("username")],
    });
    this.formtest = fb.group({
      answers: [""],
    });
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/first"]);
  }

  open(content: any, img: any) {
    this.modal.open(content, { centered: true });
    this.imgUrl = this.url + "/qbank/" + img;
    console.log(this.imgUrl);
  }

  ngOnInit(): void {
    var a: any = sessionStorage.getItem("token");
    // conveting token into js object
    var x = atob(a.split(".")[1]);
    this.x = JSON.parse(x);
    console.log(this.x);
    // user information
    this.userDetails =
      this.x?.fullname.toUpperCase() +
      `(${this.x?.gen_id})` +
      "-" +
      this.x?.trainee_idno;

    this.answers[0].apln_slno = this.x.apln_slno;
    console.log(this.answers, this.x.apln_slno);

    console.log(this.form.value);
    console.log(this.username);
    this.service.getModules(this.username).subscribe({
      next: (response) => {
        console.log(response);
        this.modules = response;
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({ severity: "error", summary: "error.messa" });
      },
    });
  }

  signOut() {
    this.location.back();
    sessionStorage.clear();
  }

  Qualified(event: any) {
    this.loading = true;

    this.service.getTest(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);
        /** set test value pre post */
        this.form.controls["test"].setValue(response.test);
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
    console.log("qualified event", event.value);

    this.answers[0].module = this.form.controls["module"].value.module_name.trim();
    this.ind = this.modules.findIndex(
      (module: any) => module.module_name == event.value.module_name
    );
    console.log("MODULE INDEX:", this.ind);
    this.answers[0].priorityval = event.value.priorityval;
    var category = event.value.category;
    console.log("QUAlIFIED DATA:", this.answers[0], category);
    console.log(this.form.value);

    this.service.Qualified(this.form.value).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response.message == "passed") {
          this.qualified = "Already This Module Qualifed";
          this.getQuestions(false, category);
        } else if (response.message == "failed") {
          this.qualified = "Attend Re-Test";
          this.getQuestions(true, category);
        } else if (response.message == "not qualified") {
          this.qualified = "Previous module not completed";
          this.getQuestions(false, category);
        } else if (response.message == "qualified") {
          this.qualified = "Attend Pre-Test";
          this.getQuestions(true, category);
        } else if (response.message == "post-test") {
          this.qualified = "Attend Post-Test";
          this.getQuestions(true, category);
        } else if (response.message == "failure") {
          this.qualified = "This module has no questions";
          this.loading = false;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getQuestions(message: any, category: any) {
    console.log("searching for question");
    console.log("cate", category);
    if (message == true && category == "ONLINE") {
      this.offline = "";
      this.service.getQuestions(this.form.value).subscribe({
        next: (response: any) => {
          console.log(response);
          this.questions = response;
          this.loading = false;
          this.flag = false;
        },
      });
    } else if (message == true && category == "OFFLINE") {
      this.offline = "THIS IS AN OFFLINE EXAM. CONTACT YOUR TRAINER";
      this.loading = false;
    } else {
      this.loading = false;
      this.questions = [];
      this.offline = "";
    }
  }

  submit() {
    this.answers[0].curr_total = this.mark;
    /** pf training */
    this.answers[0].pf = this.modules[this.ind].pass_criteria <= this.mark ? "p" : "f";
    this.answers[0].percent = Math.round(
      (this.mark / this.modules[this.ind].total_marks) * 100
    );
    this.answers[0].min_percent = this.modules[this.ind].pass_percent;
    console.log("all asnwers", this.answers);
    console.log("mark", this.mark);
    console.log("module", this.modules[this.ind].total_marks);
    console.log(this.count.size == this.questions.length);

    if (this.count.size == this.questions.length) {
      if (this.form.controls["test"].value == "pre-test") {
        console.log(this.answers);
        // setting 1. for module split in backend
        this.answers[0].module = `1.${this.answers[0].module}`;
        console.log("module:", this.answers);
        /** pre test API call */
        this.service.pretest(this.answers).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.message == "success") {
              /** reload trainee test page */
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              /** ng router reload */
              this.router.onSameUrlNavigation = "reload";
              /** navigate to trainee test page */
              this.router.navigate(["/trainee-test", this.username.username], {
                relativeTo: this.active,
              });
            } else if (response.message == "failure") {
              console.log(response.message);
              this.messageService.add({
                severity: "warn",
                summary: "Something Went Wrong!",
              });
            }
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: "error",
              summary: error.message,
            });
          },
        });
      } else if (this.form.controls["test"].value == "post-test") {
        console.log(this.answers);
        // setting 1. for module split in backend
        this.answers[0].module = `1.${this.answers[0].module}`;
        /** post test API call */
        this.service.posttest(this.answers).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.message == "success") {
              /** reload trainee test page */
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              /** ng router reload */
              this.router.onSameUrlNavigation = "reload";
              /** navigate to trainee test page */
              this.router.navigate(["/trainee-test", this.username.username], {
                relativeTo: this.active,
              });
            } else if (response.message == "failure") {
              console.log("something went wrong");
              this.messageService.add({
                severity: "warn",
                summary: "Something Went wrong!",
              });
            }
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: "error",
              summary: error.message,
            });
          },
        });
      }
    }
    // alert('Please answer all the questions above.');
    else
      this.messageService.add({
        severity: "warn",
        summary: "Please Answer All the Questions Above!",
      });
  }

  load_answers(event: any, i: any, qslno: any, correct_answer: any) {
    this.count.add(i);
    console.log(event.value, ":", correct_answer);

    if (correct_answer == event.value) this.mark = this.mark + 1;
    else if (correct_answer != event.value && this.answers[i]?.score == 1)
      this.mark = this.mark - 1;

    var temp_obj = {
      slno: qslno,
      result: event.value,
      score: correct_answer == event.value ? this.score[1] : this.score[0],
    };
    this.answers[i] = temp_obj;
  }
}
