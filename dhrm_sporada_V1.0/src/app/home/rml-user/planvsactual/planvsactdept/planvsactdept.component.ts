import { Component, OnInit,ViewChild,Input ,OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { ApiService } from "../../../api.service";

@Component({
  selector: 'app-planvsactdept',
  templateUrl: './planvsactdept.component.html',
  styleUrls: ['./planvsactdept.component.css']
})
export class PlanvsactdeptComponent implements OnInit {
  worktype: any='direct';
  dropdownMenu = [{name:'Direct',value:'direct'},{name:'In-Direct',value:'indirect'}]
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
      //   text: "Plan Vs Actual Department Wise Report",
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
   this.getPlanVsActDept()
    // this.barChartData.datasets[0].borderColor ='green'
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['date'] || changes['plant']){
      this.getPlanVsActDept()
    }
    
  }

getPlanVsActDept(){
    
    this.apiService.getetplanvsactdept({date:this.date,plant:this.plant,type:this.worktype}).subscribe((response:any)=>{
      if(response.staus=='success'){
        response.data.datasets[0].backgroundColor='#6499E9'
        response.data.datasets[1].backgroundColor='#00DFA2'
        this.barChartData=response.data
      }
    })
    
  }
}
