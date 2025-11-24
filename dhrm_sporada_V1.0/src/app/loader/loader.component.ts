import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  loaderLogoPath:any = environment?.loaderLogoPath
  constructor() { }

  ngOnInit(): void {
  }

}
