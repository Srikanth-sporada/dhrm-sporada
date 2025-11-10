import { Component, Input, OnInit,ViewChild,TemplateRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
 
})
export class ConfirmationComponent implements OnInit {
  /** 
   * 1.confirmation function from parent component
   * this function will be called when user click yes
   * */
  @Input() confirmFunction:any;

  // @ViewChild('ngbModal', {read: TemplateRef}) ngbModalTemplateRef: TemplateRef<unknown> | undefined;
  constructor(public activeModal:NgbActiveModal) { }

  ngOnInit(): void {
   console.log('confirm modal.')
  }
  /** 
   * open ngb modal
   * @property {TemplateRef} ngbModalTemplateRef
   *  */
//  openModal(){
//   this.modalService.open(this.ngbModalTemplateRef,{
//     centered:true
//   });
//  }

log(){
  console.log('close')
}
}
