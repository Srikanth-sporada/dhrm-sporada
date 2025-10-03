import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Location } from '@angular/common';
import {MessageService} from 'primeng/api';
import { set } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class isHr implements CanActivate{
  constructor(private location: Location, private messageService: MessageService) {
  }

  canActivate(): boolean {
    if(!(sessionStorage.getItem('ishr') == 'true'))
    {
      this.messageService.add({ severity: 'warn', summary: 'Access Denied'});
      setTimeout(() => this.location.back(), 2000);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class isHrAppr implements CanActivate{
  constructor(private location: Location, private messageService: MessageService) {
  }

  canActivate(): boolean {
    if(!(sessionStorage.getItem('ishrappr') == 'true'))
    {
      this.messageService.add({ severity: 'warn', summary: 'Access Denied'});
      setTimeout(() => this.location.back(), 2000);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HrPermission implements CanActivate{
  constructor(private location: Location, private messageService: MessageService) {
  }

  canActivate(): boolean {
    if(!(sessionStorage.getItem('ishrappr') == 'true') && !(sessionStorage.getItem('ishr') == 'true'))
    {
      this.messageService.add({ severity: 'warn', summary: 'Access Denied'});
      setTimeout(() => this.location.back(), 2000);
      return false;
    }
    return true;
  }
}
