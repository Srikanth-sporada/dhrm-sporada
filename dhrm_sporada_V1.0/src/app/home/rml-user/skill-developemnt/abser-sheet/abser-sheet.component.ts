import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/home/api.service';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-abser-sheet',
  templateUrl: './abser-sheet.component.html',
  styleUrls: ['./abser-sheet.component.css']
})
export class AbserSheetComponent implements OnInit {

  answers: any = [];
  genid: any;
  pevalno: any;
  aplnNo: any;
  username: any;
  ishr: any;
  istrainee: any;

  constructor(
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.ishr = sessionStorage.getItem('ishr');
    this.istrainee = sessionStorage.getItem('istrainee')

    this.route.paramMap.subscribe(params => {
      this.pevalno = params.get('id');
      console.log('pevalno:', this.pevalno);  // Should now log the correct value
    });

    if (this.pevalno) {
      this.service.abservforuser(this.pevalno).subscribe((res: any) => {
        this.answers = res
      });
    }
  }

  navigateBack() {
    this.router.navigate(['/rhrm/skill-developement/skill-test']);
  }

}
