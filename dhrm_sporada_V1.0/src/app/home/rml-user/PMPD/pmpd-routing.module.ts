import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PmpdMasterComponent } from './pmpd-master/pmpd-master.component';
import { ProdActualComponent } from './prod-actual/prod-actual.component';


const routes: Routes = [
  {path:'master',component:PmpdMasterComponent},
  {path:'actual',component:ProdActualComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
 
})
export class PmpdRoutingModule{}
