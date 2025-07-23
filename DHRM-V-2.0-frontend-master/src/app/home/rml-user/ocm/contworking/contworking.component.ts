import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { ApiService } from "../../../api.service";
import * as moment from "moment";

@Component({
  selector: 'app-contworking',
  templateUrl: './contworking.component.html',
  styleUrls: ['./contworking.component.css']
})
export class ContworkingComponent implements OnInit {
  date:any
  @Input() plant: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  barChartOptions: ChartConfiguration["options"] | any = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 1,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      datalabels: {
        anchor: "end",
        align: "end",
      },
      title: {
        display: true,
        text: "Continuously 11 Days Working",
        padding: 20,
        font: {
          size: 30,
        },
      },
    },
  };
  barChartType: ChartType = "line";
  barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<"bar">;
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.date=moment().format('yyyy-MM')
    console.log(this.date)
    this.getData()
    // this.barChartData.datasets[0].borderColor ='green'
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["date"] || changes["plant"]) {
      this.getData()
    }
  }

  getData(){
    let data={
      plant:this.plant,
      year:this.date.split('-')[0],
      month:this.date.split('-')[1]
    }
    console.log(data)
    this.apiService.getContWorking(data).subscribe((response:any)=>{
      if(response.staus=='success'){
        response.data.datasets[0].borderColor='#6499E9'
        response.data.datasets[0].backgroundColor='#6499E9'
        response.data.datasets[0].pointBackgroundColor='#6499E9'
        this.barChartData=response.data
      }
    })
  }

}
