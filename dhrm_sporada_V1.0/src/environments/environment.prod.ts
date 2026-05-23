export const environment = {
  production: true,
  path: "http://192.168.1.205:8080", // rane.ssipl.org
  path2: "http://192.168.1.205:8080", // 192.168.1.205:8080
  payroll:"https://rane.ssipl.org:8888",
  prodLink: "rhrm", 
  /** Side Nav Menu  */
  hideSalaryMaster:false,
  hidePeoplePlanning:false,
  hidePmpd:true,
  hideMidPermission:true,
  hideMissPunchHR:false,
  hideProcessedBillTabMenu:true,
  arsDumpTabMenu:false,
  /** power BI dashboard */
  hideHrSummary:false,
  hideHrDashboard:false,
  hideCanteenDashboard:true,
  /** reports */
  hideCumulativeReport:false,
  hideLopReport:false,
  hideMachineReport:true,
  hideCanteenReport:true,
  hideHrmsNewTab:true,
  /** attedance calander */
  shiftFullWidth:true,
  /** Trainee Login page */
  disableCompanyDropDown:true,
  disablePlantDropDown:true,
  /** onboard cost center*/
  hidecostCenterInput:true,
  /** approvals */
  hideOperatorCOffApproval:true,
  /** image path */
  noDataImgPath:'/assets/no-data.svg',
  loaderLogoPath: '/assets/ranelogo.png',
  /** trainee application */
  hideTraineeApplicationDelBtn:true,
  /** trainee leave */
  hideEsiLeave:true,
  hideAdvanceLeave:true,
  /** btn throttling time */
  milliSeconds:2250,
  /** primngTab panel scrollable */
  tabViewScrollable: true,
  /** trainee time office */
  hideApplyPermission:true,
  hidePermissionStatus:true,
  /** application environment */  
  prodBg:' !bg-white',
  devBg:' !bg-blue-100',
  uatBg:' !bg-green-100',
  /** enable CC filter dept transfer */
  enableCCFilter:false,
  appEnvironment:'PROD', // PROD DEV UAT
  /** EH BULK APPROVAL */
  setActualEH:false,
  /** session timeout */
  hour:1,
  enableSessionTimeout:false,
  /** contractor and vendor list */
  contractorsList: [
    'CL',
    'CL_PIECE_RATE',
    'VENDOR_NAPS',
    'VENDOR_LEAP',
    'VENDOR_BVOC',
    'VENDOR_DVOC',
    'VENDOR_NATS',
    'VENDOR_LEARN_EARN',
    'VENDOR_NEEM'],
  /**payroll */
  hidePayrollHR:false,
  hidePayrollHrAppr:false,
  /** pagination row limit */
  paginationRowLimit:60,
  /** AD */
  enableADLogin:false,
  Corp_HR_Link : 'https://app.powerbi.com/view?r=eyJrIjoiYjVmMTRjNWItYTQzMi00MjY4LWEyZDYtYzZjOWJiZTgwNWNjIiwidCI6IjQwYTBmOGU1LWZkMDUtNDNmMC05MzkwLThkOTRkZmVmOTgyNSJ9',
};

export const powerBiLink = {
  Canteen_Report: 'https://app.powerbi.com/view?r=eyJrIjoiZTcyYzNmYjQtZTg2OS00ZWQzLWJlYWUtOGJmMDQ3ZWM0YjAwIiwidCI6IjQwYTBmOGU1LWZkMDUtNDNmMC05MzkwLThkOTRkZmVmOTgyNSJ9',
  HR_link: 'https://app.powerbi.com/view?r=eyJrIjoiNzE4MGIwYTMtZWVlZC00NzY3LWExM2MtZTM4MDIxZDlmZjVmIiwidCI6IjQwYTBmOGU1LWZkMDUtNDNmMC05MzkwLThkOTRkZmVmOTgyNSJ9',
  Corp_HR_Link : 'https://app.powerbi.com/view?r=eyJrIjoiYjVmMTRjNWItYTQzMi00MjY4LWEyZDYtYzZjOWJiZTgwNWNjIiwidCI6IjQwYTBmOGU1LWZkMDUtNDNmMC05MzkwLThkOTRkZmVmOTgyNSJ9'
}