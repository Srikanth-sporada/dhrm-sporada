import { Component,AfterViewInit, Renderer2, Inject,OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit,OnInit{
   constructor(private renderer: Renderer2,@Inject(DOCUMENT) private document: Document) {

   }

   ngAfterViewInit(): void {
    this.renderer.setStyle(this.document.body,'zoom','80%')
   }

   ngOnInit(): void {
       
   }
}