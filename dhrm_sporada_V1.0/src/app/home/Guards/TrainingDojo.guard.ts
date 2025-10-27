import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class TrainerGuard implements CanActivate {
  constructor(private location: Location,private messageService:MessageService) {}

  canActivate(): boolean {
    if(!(sessionStorage.getItem('istrainer') == 'true') && !(sessionStorage.getItem('issupervisor') == 'false'))
    {
      this.messageService.add({ severity: 'warn', summary: 'Access Denied'});
      setTimeout(() => this.location.back(),2000)
      return false;
    }
    return true;
  }
}
