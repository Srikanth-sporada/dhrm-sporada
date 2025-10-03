import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class CommonPermission implements CanActivate {
  constructor(private location: Location,private messageService: MessageService) {
  }

  canActivate(): boolean {
    if(!(sessionStorage.getItem('istrainee') == 'false' || !(sessionStorage.getItem('isCL') == 'false')))
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
export class SkillDevHR implements CanActivate {
  constructor(private location: Location, private messageService:MessageService) {
  }

  canActivate(): boolean {
    if(!(sessionStorage.getItem('istrainer') == 'true') && !(sessionStorage.getItem('ishr') == 'true') && !(sessionStorage.getItem('ishraapr') == 'true') )
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
  export class SkillDevSupervisor implements CanActivate {
    constructor(private location: Location, private messageService:MessageService) {
    }
  
    canActivate(): boolean {
      const item = sessionStorage.getItem("all");
  
      if (item !== null) 
      {
      var all = JSON.parse(item);
      }
  
      var isRA = all.Is_ReportingAuth
      
      if(!isRA)
      {
        this.messageService.add({ severity: 'warn', summary: 'Access Denied'});
        setTimeout(() => this.location.back(), 2000);
        return false;
      }
      return true;
    }
  }