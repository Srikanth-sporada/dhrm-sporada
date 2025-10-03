import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {MessageService} from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router,private messageService:MessageService) {
  }

  canActivate(): boolean {
    if(sessionStorage.getItem('isadmin')=='true')
    {
      return true;
    }else{
        this.messageService.add({severity:'warn', summary:'Access Denied', detail:'You are not authorized to access this page' });
        setTimeout(() => this.router.navigate(['/first']), 2000);
        return false;
    }
    
  }
}