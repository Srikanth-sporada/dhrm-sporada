import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})

// 
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private messageService:MessageService) {
  }

  canActivate(): boolean {
    if(!sessionStorage.getItem('user'))
    {
      this.messageService.add({ severity: 'warn', summary: 'Please Login!' });
      this.router.navigate(['/first']);
      return false;
    }
    return true;
  }
}