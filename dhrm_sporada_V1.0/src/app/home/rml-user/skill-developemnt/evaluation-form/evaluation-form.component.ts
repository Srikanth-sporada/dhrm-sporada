import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { environment } from "src/environments/environment.prod";
import { ApiService } from "src/app/home/api.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { of } from "rxjs";
import { isThisSecond } from "date-fns";
import { MessageService } from "primeng/api";
@Component({
  selector: "app-evaluation-form",
  templateUrl: "./evaluation-form.component.html",
  styleUrls: ["./evaluation-form.component.css"],
})
export class EvaluationFormComponent implements OnInit {
  pp: any;
  line: any;
  department: any;
  new_skill_lvl: any = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
  ];
  process_trained: any;
  uniqueId: any = { mobile: "" };
  form: any;
  status: any = { status: "" };
  formvalues: any;
  address: any = "hello";
  image: any;
  cat: any = "";
  ln: any;
  dept: any;
  skill: any;
  oprn: any;
  name: any;
  file: any;
  readable: any = false;
  appr: any = false;
  save: any = "Save";
  txt: any = "View Supervisor file";
  nav: any;
  curr_oprn: any;
  url: any = environment.path;
  obj: any;
  new: any;
  pt: any;
  trainee_idno: any;
  uploaded: any;
  uploaded2: any;
  id: any;
  department_: any;
  sup_file: any;
  fileDetails: any;
  filesup: any;
  all: any;
  userDetails: any;
  
  constructor(
    private fb: UntypedFormBuilder,
    private service: ApiService,
    private active: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      evaluation_date: ["", Validators.required],
      score_obtained: ["", Validators.required],
      score_for: ["", Validators.required],
      percentage: ["", Validators.required],
      upload_file_tra: ["", Validators.required],
      upload_file_sup: ["", Validators.required],
      line: ["", Validators.required],
      department: ["", Validators.required],
      new_skill: ["", Validators.required],
      process_trained: ["", Validators.required],
      curr_dept: [""],
      curr_line: [""],
      curr_skill_level: [""],
      apln_slno: [this.active.snapshot.paramMap.get("id")],
      eval_days: [this.active.snapshot.paramMap.get("eval")],
      emp_slno: [sessionStorage.getItem("emp_id")],
      emp_name: [sessionStorage.getItem("emp_name")],
      line_name: [""],
      plantcode: [sessionStorage.getItem("plantcode")],
      pe_slno: [""],
    });
  }

  ngOnInit(): void {
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
    console.log("ng on init");
    this.service
      .getoperations(this.active.snapshot.paramMap.get("id"))
      .subscribe(
        (response) => {
          console.log(response);
          this.curr_oprn = response;
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        }
      );
    this.service
      .getFileDetails(this.active.snapshot.paramMap.get("id"))
      .subscribe(
        (response: any) => {
          if ((response.status = "success")) {
            this.fileDetails = response.data;
            console.log(this.fileDetails);
          } else {
            // alert(response.status)
            this.messageService.add({
              severity: "warn",
              summary: response?.message,
            });
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: "error",
            summary: error.message,
          });
        }
      );
    this.appr = this.active.snapshot.paramMap.get("nav") == "3" ? true : false;

    if (this.active.snapshot.paramMap.get("nav") == "3") {
      this.nav = "/rhrm/skill-developement/supervisor-evaluation";
      this.readable = true;
      this.form.controls["new_skill"].disable();
      this.form.controls["department"].disable();
      this.form.controls["line"].disable();
      this.form.controls["process_trained"].disable();
    }

    if (
      this.active.snapshot.paramMap.get("nav") == "1" ||
      this.active.snapshot.paramMap.get("nav") == "3"
    ) {
      this.save = "Save";
      this.nav = "/rhrm/skill-developement/trainer-evaluation";
    } else if (this.active.snapshot.paramMap.get("nav") == "2") {
      this.save = "Approve";
      this.nav = "/rhrm/skill-developement/supervisor-evaluation";
      this.readable = true;
      // this.form.controls['new_skill'].disable()
      this.form.controls["department"].disable();
      this.form.controls["line"].disable();
      this.form.controls["process_trained"].disable();
    } else this.nav = "/rhrm/skill-developement/evaluation-due";

    this.service
      .get_eval_form({
        apln_slno: this.active.snapshot.paramMap.get("id"),
        skill: this.active.snapshot.paramMap.get("eval"),
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.obj = response;
          this.image = this.url + "/uploads/" + this.obj[0][0]?.other_files6;
          console.log(this.image);

          try {
            this.name = this.obj[0][0]?.fullname;
            this.id = this.obj[0][0]?.gen_id;
            this.cat = this.obj[0][0]?.apprentice_type;
            this.dept = this.obj[0][0]?.dept_name;
            this.ln = this.obj[0][0]?.line_name;
            this.skill = this.obj[0][0]?.new_level;
            this.trainee_idno = this.obj[0][0]?.apln_slno;
            this.pt = this.obj[1];
            this.pt = this.pt.map((a: any) => a.oprn_desc);
            this.department_ = this.obj[2];
            // this.line = this.obj[3]
            this.process_trained = this.obj[4];
            this.form.controls["department"].setValue(
              response[0][0]?.dept_name
            );
            this.form.controls["department"].disable();

            this.department = this.department_.map((a: any) => a.dept_name);
            // this.process_trained = this.process_trained.map(
            //   (a: any) => a.oprn_desc
            // );
            console.log(this.process_trained);
            this.form.controls["curr_dept"].setValue(this.obj[0][0]?.dept_slno);
            this.form.controls["curr_line"].setValue(this.obj[0][0]?.line_code);
            this.form.controls["curr_skill_level"].setValue(
              this.obj[0][0]?.curr_skill
            );
            this.form.controls["line_name"].setValue(this.obj[0][0]?.line_name);

            this.service
              .getLineName({ dept_slno: this.obj[0][0]?.dept_slno })
              .subscribe({
                next: (response: any) => {
                  console.log(response);
                  this.line = response[0];
                  this.line = this.line.map((a: any) => a.line_name);
                  this.form.controls["line"].setValue(
                    response[0][0]?.line_name
                  );
                  this.form.controls["line"].disable();
                },
                error: (error) => {
                  console.log(error);
                  this.messageService.add({
                    severity: "error",
                    summary: error.message,
                  });
                },
              });
          } catch (error) {
            console.log(error);
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

    if (
      this.active.snapshot.paramMap.get("nav") == "2" ||
      this.active.snapshot.paramMap.get("nav") == "3"
    ) {
      this.service
        .get_eval_sup({
          apln_slno: this.active.snapshot.paramMap.get("id"),
          skill: this.active.snapshot.paramMap.get("eval"),
        })
        .subscribe({
          next: (response: any) => {
            console.log(response);

            this.pt = response[3];

            this.pt = this.pt.map((a: any) => a.oprn_desc);

            this.form.controls["evaluation_date"].setValue("2023-02-02");
            this.form.controls["score_obtained"].setValue(
              response[0][0]?.tnr_numerator
            );
            this.form.controls["score_for"].setValue(
              response[0][0]?.tnr_denominator
            );
            this.form.controls["percentage"].setValue(
              response[0][0]?.tnr_percentage
            );
            this.form.controls["line"].setValue(response[1][0]?.line_name);
            this.form.controls["pe_slno"].setValue(response[1][0]?.pe_slno);
            this.form.controls["department"].setValue(
              response[2][0]?.dept_name
            );
            this.form.controls["process_trained"].setValue(this.pt);
            this.form.controls["new_skill"].setValue(response[4][0]?.new_level);
            this.uploaded =
              this.url + "/skill_dev/" + response[0][0]?.tnr_filename;
            this.uploaded2 =
              this.url + "/skill_dev/" + response[0][0]?.sup_filename;
            this.sup_file = response[0][0]?.sup_filename;
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

  getUrl(file_name: any) {
    return this.url + "/skill_dev/" + file_name;
  }
  submit() {
    this.form.get("department").enable();
    this.form.get("line").enable();
    if (this.active.snapshot.paramMap.get("nav") == "1") {
      this.form.controls["upload_file_tra"].setValue(
        this.trainee_idno +
          "_" +
          "tnr_eval_" +
          this.active.snapshot.paramMap.get("eval") +
          "." +
          this.new
      );
      this.form.controls["upload_file_sup"].setValue(
        this.trainee_idno +
          "_" +
          "sup_eval_" +
          this.active.snapshot.paramMap.get("eval") +
          "." +
          this.new
      );
      this.service.eval_form(this.form.value).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.message == "success") {
            this.service
              .evaluation_mail({
                plant_code: sessionStorage.getItem("plantcode"),
                idno: this.trainee_idno,
              })
              .subscribe({
                next: (response: any) => {
                  console.log(response);
                },
              });
            // alert("Trainee has been Evaluated");
            this.messageService.add({
              severity: "info",
              summary: "Trainee has been Evaluated",
            });
            this.router.navigate([
              "/rhrm/skill-developement/trainer-evaluation",
            ]);
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
    } else if (this.active.snapshot.paramMap.get("nav") == "2") {
      try {
        this.form.controls["upload_file_tra"].setValue(
          this.trainee_idno +
            "_" +
            "sup_eval_" +
            this.active.snapshot.paramMap.get("eval") +
            "." +
            this.new
        );
      } catch (err) {
        console.log(err);
      }
      this.service
        .eval_form_sup({
          ...this.form.value,
          skill: this.active.snapshot.paramMap.get("eval"),
          empid: sessionStorage.getItem("emp_id"),
        })
        .subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.message == "success") {
              // alert("Trainee has been Evaluated");
              this.messageService.add({
                severity: "info",
                summary: "Trainee has been Evaluated",
              });
              this.router.navigate([
                "/rhrm/skill-developement/supervisor-evaluation",
              ]);
            }
          },
        });
    }
    console.log(this.form.value);
  }
  files(event: any) {
    this.file = event.target.files[0];
    if (this.file?.size > 2000000) {
      this.form.get("upload_file_tra").setValue(null);
      // alert("FileSize Should be less Than 2MB");
      this.messageService.add({
        severity: "info",
        summary: "FileSize Should be less Than 2MB",
      });
      const file: any = document.getElementById("filetre");
      file.value = "";
      return;
    }
    var file_local = this.file?.name.split(".");
    this.new = file_local?.pop();
    console.log(this.new);
    var formData = new FormData();

    formData.append(
      "file",
      event.target.files[0],
      this.trainee_idno +
        "_" +
        "tnr_eval_" +
        this.active.snapshot.paramMap.get("eval") +
        "." +
        this.new
    );

    this.form.get("upload_file_tra").setValue("uploaded");

    this.service.skill_dev(formData).subscribe({
      next: (response) => {
        console.log(response);
        console.log("test");
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }

  filessup(event: any) {
    this.filesup = event.target.files[0];
    console.log(this.filesup.size);
    if (this.filesup.size > 2000000) {
      this.form.get("upload_file_sup").setValue(null);
      this.messageService.add({
        severity: "info",
        summary: "FileSize Should be less Than 2MB",
      });
      const file: any = document.getElementById("filesup");
      console.log(file);
      file.value = "";
      return;
    }
    var file_local = this.filesup?.name.split(".");
    this.new = file_local?.pop();

    var formData = new FormData();
    formData.append(
      "file",
      event.target.files[0],
      this.trainee_idno +
        "_" +
        "sup_eval_" +
        this.active.snapshot.paramMap.get("eval") +
        "." +
        this.new
    );

    this.form.get("upload_file_sup").setValue("uploaded");

    this.service.skill_dev(formData).subscribe({
      next: (response) => {
        console.log(response);
        console.log("test");
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({ severity: "error", summary: error.message });
      },
    });
  }
  cal() {
    var a = this.form.controls["score_for"].value;
    var b = this.form.controls["score_obtained"].value;
    var c = Math.round((b / a) * 100);
    this.form.controls["percentage"].setValue(c);
  }

  getLineName(event: any) {
    var x = event.target.value.split(":")[0] - 1;
    console.log(x);
    console.log(this.department_[x].dept_slno);
    this.service
      .getLineName({ dept_slno: this.department_[x].dept_slno })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.line = response[0];
          this.line = this.line.map((a: any) => a.line_name);
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
