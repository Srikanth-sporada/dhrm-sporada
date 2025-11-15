import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trainee-plant-wise-head-count',
  templateUrl: './trainee-plant-wise-head-count.component.html',
  styleUrls: ['./trainee-plant-wise-head-count.component.css']
})
export class TraineePlantWiseHeadCountComponent implements OnInit {
   chartData = {
    labels: ['ACT APP', 'CAPS', 'CL', 'Dip.In.Scheme', 'GET', 'FT', 'NAFS', 'NEEM', 'QET', 'OPERATOR', 'VENDOR-APP', 'VENDOR-NAFS'],
    datasets: [
      { label: 'P1', backgroundColor: '#66BB6A', data: [984, 0, 0, 0, 321, 0, 0, 0, 0, 4189, 0, 4222] },
      { label: 'P2', backgroundColor: '#FFA726', data: [6448, 0, 0, 0, 466, 0, 0, 0, 0, 2185, 0, 4783] },
      { label: 'P3', backgroundColor: '#29B6F6', data: [0, 5048, 0, 0, 0, 0, 0, 0, 0, 2586, 0, 0] },
      { label: 'P4', backgroundColor: '#AB47BC', data: [0, 0, 1320, 0, 0, 0, 0, 0, 0, 1536, 0, 0] },
      { label: 'P5', backgroundColor: '#FF7043', data: [402, 0, 0, 6, 0, 138, 1, 1, 1, 1504, 1, 0] }
    ]
  };

  chartOptions = {
    indexAxis: 'y',
    plugins: { legend: { position: 'right' } },
    responsive: true
  };


  constructor() { }

  ngOnInit(): void {
  }

}
