import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TrainerGuard implements CanActivate {
  constructor(private router: Router, private location: Location) {
  }

  canActivate(): boolean {
    if(!(sessionStorage.getItem('istrainer') == 'true') && !(sessionStorage.getItem('issupervisor') == 'flase'))
    {
      alert('Not accessible')
      this.location.back()
      return false;
    }
    return true;
  }
}
