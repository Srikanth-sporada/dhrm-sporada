import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent implements OnInit {
  loaderLogoPath:any = environment?.loaderLogoPath
  constructor() { }

  ngOnInit(): void {
  }

}
