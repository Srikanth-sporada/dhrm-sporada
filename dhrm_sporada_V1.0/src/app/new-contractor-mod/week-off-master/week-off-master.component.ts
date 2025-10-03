import { Component, OnInit } from '@angular/core'
import { FormBuilder,Validators,FormGroup} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/home/api.service';

@Component({
  selector: 'app-week-off-master',
  templateUrl: './week-off-master.component.html',
  styleUrls: ['./week-off-master.component.css']
})
export class WeekOffMasterComponent implements OnInit {

  plantname:any

  weekOff:any

  constructor(private fb: FormBuilder,private modalService: NgbModal,private service : ApiService) {


   }

  ngOnInit(): void {
    this.weekOff = this.fb.group({
      week:[''],
      dept:[''],
      empType:[''],
      non:['yes'],
      su:[''],
      mo:[''],
      we:[''],
      th:[''],
      fr:[''],
      sa:['']
    })
    
  }



}
