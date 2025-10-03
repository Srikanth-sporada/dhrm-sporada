import { Component, OnInit,ViewChild,Input ,OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { ApiService } from "../../../api.service";
import * as moment from 'moment'

@Component({
  selector: 'app-directandindirect',
  templateUrl: './directandindirect.component.html',
  styleUrls: ['./directandindirect.component.css']
})
export class DirectandindirectComponent implements OnInit {

  @Input() date:any;
  @Input() plant:any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  barChartOptions: ChartConfiguration["options"] = {
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
        position:'bottom'
      },
      datalabels: {
        anchor: "end",
        align: "end",
      },
      // title: {
      //   display: true,
      //   text: "Direct and Indirect Report",
      //   padding:20,
      //   font:{
      //     size:30
      //   }
      // },
    },
  };
  barChartType: ChartType = "bar";
  barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<"bar">;
  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
   this.getDirectAndIndirect()
    
    // this.barChartData.datasets[0].borderColor ='green'
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['date'] || changes['plant']){
      this.getDirectAndIndirect()
    }
    
  }

  getDirectAndIndirect(){
    
    this.apiService.directandindirect({date:this.date,plant:this.plant}).subscribe((response:any)=>{
      if(response.staus=='success'){
        response.data.datasets[0].backgroundColor='#6499E9'
        response.data.datasets[1].backgroundColor='#00DFA2'
        this.barChartData=response.data
      }
    })
    
  }

}


