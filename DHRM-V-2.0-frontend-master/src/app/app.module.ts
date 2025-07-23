import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './home/rml-user/navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatMenuModule} from "@angular/material/menu";
import {MatExpansionModule} from "@angular/material/expansion";
import { HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FirstPageComponent } from './first-page/first-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './home/Guards/Auth.guard';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { HeaderInterceptor } from './header.interceptor';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DashboardComponent } from './home/rml-user/dashboard/dashboard.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NewContractorModModule } from './new-contractor-mod/new-contractor-mod.module';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DaiyatndreportComponent}  from './home/rml-user/dashboard/daiyatndreport/daiyatndreport.component'
import {MatSelectModule} from '@angular/material/select';
import {ContAtndComponent}  from './home/rml-user/dashboard/ContAtndReport/ContAtndReport'
import {CatAtndComponent} from './home/rml-user/dashboard/CatAtndReport/CatAtndReport'
import {ExcessHoursReportComponent} from './home/rml-user/dashboard/excess-hours-report/excess-hours-report.component'
import { LineatndReportComponent } from './home/rml-user/dashboard/lineatndReport/lineatndReport.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FirstPageComponent,
    DashboardComponent,
    DaiyatndreportComponent,
    ContAtndComponent,
    CatAtndComponent,
    ExcessHoursReportComponent,
    LineatndReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    ScrollingModule,
    NewContractorModModule,
    MatNativeDateModule,
    RouterModule,
    NgChartsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule {  }