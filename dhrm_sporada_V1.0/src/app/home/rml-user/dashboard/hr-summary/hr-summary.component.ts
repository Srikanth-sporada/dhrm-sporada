
import { Component, OnInit } from '@angular/core';
import {powerBiLink} from '../../../../../environments/environment.prod'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-hr-summary',
  templateUrl: './hr-summary.component.html',
  styleUrls: ['./hr-summary.component.css']
})
export class HrSummaryComponent implements OnInit {

  HR_link: SafeResourceUrl;
  basicData:any;
  basicOptions:any;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Sanitize the Power BI link
    this.HR_link = this.sanitizer.bypassSecurityTrustResourceUrl(powerBiLink.HR_link);
        const documentStyle = getComputedStyle(document.documentElement);
        console.log('DOC STYLE:',documentStyle);
        const textColor = documentStyle.getPropertyValue('--text-color');
        console.log('Color',textColor);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        console.log('Sec color',textColorSecondary)
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        console.log(surfaceBorder);
        this.basicData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                }
            ]
        };

        this.basicOptions = {
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

    onDataSelect(value:any){
      console.log(value)
    }
}



