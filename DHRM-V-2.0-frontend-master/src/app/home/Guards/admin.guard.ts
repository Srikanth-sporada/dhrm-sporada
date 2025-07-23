import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(): boolean {
    if(sessionStorage.getItem('isadmin')=='true')
    {
      
      return true;
    }else{
        alert('Access is blocked temporarily')
        return false;
    }
    
  }
}