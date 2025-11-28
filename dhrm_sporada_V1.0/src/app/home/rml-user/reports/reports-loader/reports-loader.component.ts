import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-reports-loader',
  templateUrl: './reports-loader.component.html',
  styleUrls: ['./reports-loader.component.css']
})
export class ReportsLoaderComponent implements OnInit {
  loaderLogoPath:any = environment?.loaderLogoPath
  constructor() { }

  ngOnInit(): void {
  }

}
