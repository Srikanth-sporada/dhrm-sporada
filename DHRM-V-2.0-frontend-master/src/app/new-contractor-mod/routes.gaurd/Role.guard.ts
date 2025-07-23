import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Location } from '@angular/common';



@Injectable({
    providedIn: 'root'
  })
  export class Admin_HrApp_Hr_Sup implements CanActivate {
    constructor(private router: Router, private location: Location) {
    }
    canActivate(): boolean {
      const isSupervisor = sessionStorage.getItem('issupervisor') === 'true';
      const isHrAppr = sessionStorage.getItem('ishrappr') === 'true';
      const isHr = sessionStorage.getItem('ishr') === 'true';
      const isAdmin = sessionStorage.getItem('isadmin') === 'true';
  
      if (!(isSupervisor || isHrAppr || isHr || isAdmin)) {
        alert('Not accessible');
        this.location.back();
        return false;
      }
      return true;
    }
  }
@Injectable({
    providedIn: 'root'
  })
  export class Admin_HrApp_Hr implements CanActivate {
    constructor(private router: Router, private location: Location) {
    }
  
    canActivate(): boolean {
      if(!(sessionStorage.getItem('ishrappr') == 'true') && !(sessionStorage.getItem('ishr') == 'true') && !(sessionStorage.getItem('isadmin') == 'true'))
      {
        alert('Not accessible')
        this.location.back()
        return false;
      }
      return true;
    }
  }
@Injectable({
    providedIn: 'root'
  })
  export class Admin_HrApp implements CanActivate {
    constructor(private router: Router, private location: Location) {
    }
  
    canActivate(): boolean {
      if(!(sessionStorage.getItem('ishrappr') == 'true') && !(sessionStorage.getItem('isadmin') == 'true'))
      {
        alert('Not accessible')
        this.location.back()
        return false;
      }
      return true;
    }
  }
@Injectable({
    providedIn: 'root'
  })
  export class Admin implements CanActivate {
    constructor(private router: Router, private location: Location) {
    }
  
    canActivate(): boolean {
      if( !(sessionStorage.getItem('isadmin') == 'true'))
      {
        alert('Not accessible')
        this.location.back()
        return false;
      }
      return true;
    }
  }
@Injectable({
    providedIn: 'root'
  })
  export class AD_HR_HRappr_Repo implements CanActivate {
    constructor(private router: Router, private location: Location) {
    }
  
    canActivate(): boolean {
      if( !(sessionStorage.getItem('isadmin') == 'true'))
      {
        alert('Not accessible')
        this.location.back()
        return false;
      }
      return true;
    }
  }


  @Injectable({
    providedIn: 'root'
  })
  export class Admin_Is_fin implements CanActivate {
    constructor(private router: Router, private location: Location) {
      // const item = JSON.parse(sessionStorage.getItem("all"));
      // const isFin=this.item['is_fin']
    }
    
  
    canActivate(): boolean {
      if(!(sessionStorage.getItem('isadmin') == 'true') || !(sessionStorage.getItem('is_fin') == 'true'))
      {
        alert('Not accessible')
        this.location.back()
        return false;
      }
      return true;
    }
  }