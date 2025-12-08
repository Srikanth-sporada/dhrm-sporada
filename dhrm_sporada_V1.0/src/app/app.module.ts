import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./home/rml-user/navbar/navbar.component";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatExpansionModule } from "@angular/material/expansion";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FirstPageComponent } from "./first-page/first-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "./home/Guards/Auth.guard";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { HeaderInterceptor } from "./header.interceptor";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { DashboardComponent } from "./home/rml-user/dashboard/dashboard.component";
import { MatNativeDateModule } from "@angular/material/core";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { NewContractorModModule } from "./new-contractor-mod/new-contractor-mod.module";
import { RouterModule } from "@angular/router";
import { NgChartsModule } from "ng2-charts";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DaiyatndreportComponent } from "./home/rml-user/dashboard/daiyatndreport/daiyatndreport.component";
import { MatSelectModule } from "@angular/material/select";
import { ContAtndComponent } from "./home/rml-user/dashboard/ContAtndReport/ContAtndReport";
import { CatAtndComponent } from "./home/rml-user/dashboard/CatAtndReport/CatAtndReport";
import { ExcessHoursReportComponent } from "./home/rml-user/dashboard/excess-hours-report/excess-hours-report.component";
import { LineatndReportComponent } from "./home/rml-user/dashboard/lineatndReport/lineatndReport.component";
import { ToastService, AngularToastifyModule } from "angular-toastify";
import { NgOptimizedImage } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";
import { CarouselModule } from "primeng/carousel";
import { MessageService, ConfirmationService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { RippleModule } from "primeng/ripple";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { SpeedDialModule } from "primeng/speeddial";
import { TabViewModule } from "primeng/tabview";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TraineeApplicationComponent } from "./first-page/trainee-application/trainee-application.component";
import { TraineeLoginComponent } from "./first-page/trainee-login/trainee-login.component";
import { TrainerLoginComponent } from "./first-page/trainer-login/trainer-login.component";
import { WorkmenLoginComponent } from "./first-page/workmen-login/workmen-login.component";
import { ExecutiveLoginComponent } from "./first-page/executive-login/executive-login.component";
import { SalaryApprovalDeptFilterPipe } from "./pipes/salary-approval-dept-filter.pipe";



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
    LineatndReportComponent,
    TraineeApplicationComponent,
    TraineeLoginComponent,
    TrainerLoginComponent,
    WorkmenLoginComponent,
    ExecutiveLoginComponent,
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
    MatSelectModule,
    AngularToastifyModule,
    NgOptimizedImage,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ButtonModule,
    DropdownModule,
    InputMaskModule,
    PasswordModule,
    CheckboxModule,
    InputTextModule,
    CarouselModule,
    ToastModule,
    RippleModule,
    ConfirmPopupModule,
    SpeedDialModule,
    TabViewModule,
    CalendarModule,
    FileUploadModule,
    InputTextareaModule,
    InputNumberModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    ToastService,
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
