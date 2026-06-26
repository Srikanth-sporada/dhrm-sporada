import {Component,OnInit,ViewEncapsulation,} from "@angular/core";
import {CalendarEvent,CalendarMonthViewBeforeRenderEvent,CalendarView,} from "angular-calendar";
import { setDefaultOptions } from "date-fns";
import { DatePipe } from "@angular/common";
import { ApiService } from "src/app/home/api.service";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment.prod";
import { Utility } from "src/app/utils/utils";
import { LoaderserviceService } from "src/app/loaderservice.service";
import { ActivatedRoute } from "@angular/router";

interface MyEvent extends CalendarEvent {
  in_time: string;
  out_time: string;
}

setDefaultOptions({ weekStartsOn: 1 }); 

@Component({
  selector: 'app-cal',
  templateUrl: './cal.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cal.component.css']
})

export class CalComponent implements OnInit {
 /** shift & present full width */
  shiftFullWidth:boolean = environment.shiftFullWidth;
  plantCode:any = sessionStorage.getItem('plantcode')
  firstDayOfWeek: number;
  today: any = new Date();
  month: any = new Date();
  title: any[];
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  lockdate:any;
  genid:any;
  showcal:any;
  user:any;
  all:any;
  userDetails:any;
  /** route parama gen id */
  routeGenID:any;
  evnt: CalendarEvent[] = [];
  _exceptLC_EG_values = ['Holiday',"Factory Holiday","Comp_Off_Holiday","weekoff","Comp Off"];
  events: any[] = [
    {
      title: "title",
      start: new Date("2023-02-12"),
      in_time: "1",
      out_time: "2",
    },
    {
      title: "title",
      start: new Date("2023-02-13"),
      in_time: "3",
      out_time: "4",
    },
  ];

  in_time = "10:00am";
  out_time = "5:00pm";
  a: any = "IN_OUT_TIME";
  date: string | null;
  
  constructor(
    private service: ApiService,
    private messageService:MessageService,
    public utils:Utility,
    public loader:LoaderserviceService,
    private route:ActivatedRoute,
  ) {}

  ngOnInit(): void {
    /** loged in used details */
    this.routeGenID = this.route.snapshot.params['genId'];
    console.log('ROUTE GEN ID:',this.routeGenID);
    let details = sessionStorage.getItem("all");
    if (details != null) {
      this.all = JSON.parse(details);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name
    }
    this.firstDayOfWeek = 1; 

    // this.service.getlockDate().subscribe((res:any)=>{
    //   this.lockdate = res.date;
    //   if(res?.status == 'failed'){
    //     this.messageService.add({severity:'error',summary:res?.message});
    //   } 
    // }, (error) => {
    //   console.error('ERROR:',error);
    //   this.messageService.add({severity:'error',summary:error?.error?.message})
    // });

    /** get attedance data when route is not null */
    if(this.routeGenID){
      /** set gen id to route gen id */
      this.genid = this.routeGenID;
      this.getData();
    }
  }

  setView(view: CalendarView) {
    this.view = view;
    console.log(view);
  }

  dayClicked({ date, events }: { date: Date; events: any }): void {
    if (events.length == 0 ) {
      return;
    }
   
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() - (adjustedDate.getDay() - this.firstDayOfWeek + 7) % 7);
  
    // if((events[0].in_time==null || events[0].out_time==null)){
    //   const today_date = new Date()
    //   today_date.setDate(today_date.getDate()-1)
    //   const min_date=new Date()
    //   min_date.setDate(min_date.getDate()-10)
    //   console.log(min_date,today_date)

    //   if(date<today_date && date > new Date(min_date)){
    //     const dailogRef = this.dailog.open(ForgottopunchpopupComponent, {
    //       data: events[0],
    //     });
    //   }
      
      
    // }
      
  }

  attData: any[] = [];

  /**
   * get attedance data for trainee
   */
  getDates() {
    this.month = this.viewDate;
    this.date = new DatePipe("en-US").transform(this.viewDate, "yyyy/MM");
    console.log(this.date);
    /** trim gen id */
    this.service
      .cal({ id: String(this.genid).trim(), date: this.date })
      .subscribe({
        next: (response: any) => {
          if(response.status=='failed'){
            // alert(response.message)
            this.messageService.add({severity:'warn',summary:response.message})
          }else{
            console.log(response)
            this.user = response.user
            this.attData = response.data;
            console.log(response.data);
            
            this.events = [];
            for (var i = 0; i < this.attData.length; i++) {
              var form = {
                title: "title",
                start: new Date(this.attData[i].att_date),
                in_time: this.parseDateTime(this.attData[i].in_time),
                out_time: this.parseDateTime(this.attData[i].out_time),
                shift_desc:this.attData[i].shift_desc,
                regular:this.attData[i].regular,
                present_type:this.attData[i].present_type,
                excess_hrs:this.attData[i].expect_othr,
                late_comeing:this.attData[i].late_comeing,
                early_going:this.attData[i].early_going
                
              };
              this.events.push(form);
            }
            this.showcal=true
            console.log( 'events',this.events)
            var date: Date = new Date();
            var events: CalendarEvent<any>[] = this.evnt;
            this.dayClicked({ date, events });
  
            const element = document.getElementById("yes");
  
            if (element) {
              element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
          }
         
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({severity:'error',summary:error.message});
        }
      });
  }

  private parseDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const [datePart, timePart] = dateTimeString.split(' ');
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      const dayOfWeek = day.date.getDay();
      const dayOfMonth = day.date.getDate();
      const monthofYear = day.date.getMonth();
      /** changing today bg */
      if(day.isToday){
        day.cssClass = '!bg-white';
      }
      for (var i = 0; i < this.attData.length; i++) {
        var x = new Date(this.attData[i].att_date);
        var date = x.getDate();
        var month = x.getMonth();
         /** checking if present day lop applied */
       if((this.attData[i]?.late_comeing > 0 || this.attData[i]?.early_going > 0) 
          && this._exceptLC_EG_values.indexOf(this.attData[i].present) == -1 && this.attData[i].present_type == 0){
          if (month == monthofYear && date == dayOfMonth && this.attData[i].present_type == 0) {
                day.cssClass = "!bg-red-400 shadow-md m-1 rounded-md";
          }
        }
         /** 
         * checking if trainee is EC LG in week off & holiday 
         * set same clor fr holiday
         * @property {*} _exceptLC_EG_values
         * */
        else if((this.attData[i]?.late_comeing > 0 || this.attData[i]?.early_going > 0) 
          && this._exceptLC_EG_values.indexOf(this.attData[i].present) == -1){
          if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-yellow-300 shadow-md m-1 rounded-md";
          }
          else if (month == monthofYear && date == dayOfMonth && this.attData[i].present_type == 0) {
                day.cssClass = "!bg-red-400 shadow-md m-1 rounded-md";
          }
        }
        else {
          /** calendara day cell color code based on response present */
          switch (this.attData[i].present) {
            case "Present": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-green-400 shadow-md m-1 rounded-md";
              }
              break;
            } 
            case "Absent": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-red-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "Comp Off": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-orange-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "Holiday": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-blue-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "Factory Holiday": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-blue-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "Leave": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-orange-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "half": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-orange-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "weekoff": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-gray-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "onduty": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-purple-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "permision": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-purple-400 shadow-md m-1 rounded-md";
              }
              break;
            }
            case "Comp_Off_Holiday": {
              if (month == monthofYear && date == dayOfMonth) {
                day.cssClass = "!bg-blue-400 shadow-md m-1 rounded-md";
              }
              break;
            }
          }
        }
       
      }
    });
  }

  /** 
   * get attedance data
   */
  getData(){
    if(this.genid==''){
      // alert('Pleas Enter the Gen ID');
      this.messageService.add({severity:'warn',summary:'Please Enter Gen ID'})
    }
    else{
      /** throttle function */
      this.utils.throttledClick();
      this.getDates()
    }
  }

  exoprtToExcell(){
    this.utils.jsonToExcellExport(this.attData,this.plantCode,`attendance_record_${this.genid}`)
  }

}
