import { Component, OnInit, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import {powerBiLink} from '../../../../../environments/environment.prod'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Utility } from 'src/app/utils/utils';

@Component({
  selector: 'app-canteen-bi-rpt',
  templateUrl: './canteen-bi-rpt.component.html',
  styleUrls: ['./canteen-bi-rpt.component.css']
})
export class CanteenBiRptComponent implements OnInit,AfterViewInit {
  cnt_link: SafeResourceUrl;
  all:any;
  userDetails:any;
  selectedDate:any = new Date();
  canteenReportData:any;
  chartOptions:any;
  reportData:any = [{
     "Supper":540,
     "Break Fast":325,
     "Lunch":702,
     "Mini Tiffin":900,
     "Dinner": 200
  }];
  dataLabels:any;
  chartHeight:any;
  chartWidth:any;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  constructor(private sanitizer: DomSanitizer , private utils:Utility) {

    this.dataLabels = this.utils.extractKeysForReports(this.reportData);
    console.log(this.dataLabels)
  }

  ngAfterViewInit() {
  const rect = this.chartContainer.nativeElement.getBoundingClientRect();
  this.chartWidth = `${rect.width}px`;
  this.chartHeight = `${rect.height}px`;
  console.log(this.chartHeight,this.chartWidth);
}

  ngOnInit(): void {
    /** logged user information */
    let detail = sessionStorage.getItem("all");
    if (detail != null) {
      this.all = JSON.parse(detail);
      this.userDetails = this.all.Emp_Name.toUpperCase()+`(${this.all.User_Name})`+'-'+ this.all.dept_name+'-'+this.all.plant_name;
    }
    // Sanitize the Power BI link
    this.cnt_link = this.sanitizer.bypassSecurityTrustResourceUrl(powerBiLink.Canteen_Report);

    /** Chart Basic config */
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.canteenReportData = {
            labels: this.dataLabels,
            datasets: [
                {
                    data: this.utils.extractValues(this.reportData), //'rgba(255, 159, 64, 0.2)'
                    backgroundColor: [
                       documentStyle.getPropertyValue('--blue-200'),
                       documentStyle.getPropertyValue('--blue-300'), 
                       documentStyle.getPropertyValue('--blue-400'),
                       documentStyle.getPropertyValue('--blue-500'),
                       documentStyle.getPropertyValue('--blue-600'),
                      ],
                    borderColor: [
                      documentStyle.getPropertyValue('--blue-200'), 
                      documentStyle.getPropertyValue('--blue-300'),
                      documentStyle.getPropertyValue('--blue-400'),
                      documentStyle.getPropertyValue('--blue-500'),
                      documentStyle.getPropertyValue('--blue-600')
                    ],
                    borderWidth: 1
                }
            ]
        };

        /** doughtnut chart options */
        //  this.chartOptions = {
        //   responsive:true,
        //   maintainAspectRatio:false,
        //     plugins: {
        //         legend: {
        //             labels: {
        //                 usePointStyle: true,
        //                 color: textColor
        //             }
        //         }
        //     }
        // };

         this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
  }

  /** get row indices to display in a row only two cards
   * @var indices
   * @returns {number[]} indices
   */
  getRowIndices(): number[] {
  const indices = [];
  for (let i = 0; i < this.dataLabels.length; i += 2) {
    indices.push(i);
  }
  return indices;
}

}
