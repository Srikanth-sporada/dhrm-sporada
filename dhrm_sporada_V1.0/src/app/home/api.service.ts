import { HttpClient, HttpParams,HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { appendFile } from "fs";
import { relativeTimeThreshold } from "moment";
import { report } from "process";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { PayrollArea } from "./rml-user/masters/types/payrollArea.type";
// import { ProductModel } from './models/product.model';

@Injectable({
  providedIn: "root",
})
export class ApiService {
  url: any = environment.path;
  url2: any = environment.path2;

  constructor(private http: HttpClient) { }

  ars_login(form: any) {
    return this.http.post(this.url + "/login/ars-login", form);
  }

  login(User_Name: string, Password: string) {
    return this.http.post(this.url + "/login/emp-login", { User_Name, Password, });
  }
  traineeLogin(formvalue: any) {
    return this.http.post(this.url + "/login/trainee-login", formvalue);
  }
  /////////////////////////////////////////////////////////////////////////////////////////

  traineeFormData(form: any) {
    return this.http.post(this.url + "/hrOperation/traineeformdata", form);
  }
  getHr(uniqueid: any) {
    return this.http.get(
      this.url +
      "/hrOperation/gethrappr?username=" +
      uniqueid.username +
      "&user=" +
      uniqueid.user,
      uniqueid
    );
  }
  /** CL & CL PIECE RATE ONBOARD NEW API */
  checkAdhaarClOnboardNew(data:any){
    return this.http.post(this.url + '/cl/onboard/v1/check-user',data)
  }
  /** get contractors NEW API*/
  getContractorsByPlant(plant:any){
    return this.http.get(this.url + `/cl/onboard/v1/get_contractor?Plant_code=${plant}`)
  }
  /** religion and relations NEW API*/
  getApplicationFormData(companyCode:any,plantCode:any){
    return this.http.get(this.url + `/cl/onboard/v1/application-form-data?companyCode=${companyCode}&plantCode=${plantCode}`)
  }
  /** get pincode data NEW API*/
  getPincodeData(pincode:any){
    return this.http.get(this.url + `/cl/onboard/v1/getPincodes?pincode=${pincode}`)
  }
  /** sumbit cl application for NEW API */
  submitClNewOnboardForm(data:any){
    return this.http.post(this.url + '/cl/onboard/v1/upsert_application',data)
  }

  getPlantCode(form: any) {
    return this.http.get(
      this.url + "/hrOperation/plantcodelist?company_name=" + form.company_name
    );
  }
  /** get plant data by company code */
  getPlantsByCompanyCode(companyCode:any){
    return this.http.get(this.url + `/HROperation/plantcodeCC?company_name=${companyCode}`)
  }
  getCompanyCode() {
    return this.http.get(this.url + "/hrOperation/companycodelist");
  }
  getAadhar() {
    return this.http.get(this.url + "/hrOperation/getaadhar");
  }
  checkAadhar(aadhar: any, mobile: any) {
    return this.http.get(
      this.url +
      "/hrOperation/checkAadhar?aadhar=" +
      aadhar +
      "&mobile=" +
      mobile
    );
  }
  getDataForId(form: any) {
    return this.http.get(
      this.url +
      "/hrOperation/getdataforid?mobile=" +
      form.mobile +
      "&company=" +
      form.company
    );
  }

  /** 
   * update trainee data #NEW
   * @param payload
   */
  updateTraineDataBulk(payload:any){
    return this.http.post(this.url + '/master/updatetrndetails' , payload);
  }

  /** get all data about trainee for ID card */
  getTraineeDataForIdCard(applicationNo:any){
    return this.http.get(this.url + `/HROperation/getdatafortrainee?apln_slno=${applicationNo}`)
  }
  getDataForPermId(form: any) {
    return this.http.get(
      this.url + "/hrOperation/getdataforpermid?apln_slno=" + form.apln_slno
    );
  }
  getValidDate(form: any) {
    return this.http.get(
      this.url + "/hrOperation/getValidDate?cat=" + form.cat
    );
  }
  filterForApproval(form: any) {
    return this.http.get(this.url + "/hrOperation/filterforapproval?status=" + form.status + "&plantcode=" + form.plantcode);
  }

  getdatabasic(uniqueId: any) {
    return this.http.post(this.url + "/hrOperation/getdatabasic", uniqueId);
  }

  getdataqualifn(uniqueId: any) {
    return this.http.post(this.url + "/hrOperation/getdataqualfn", uniqueId);
  }

  getdatafamily(uniqueId: any) {
    return this.http.post(this.url + "/hrOperation/getdatafamily", uniqueId);
  }

  getdatacareer(uniqueId: any) {
    return this.http.post(this.url + "/hrOperation/getdatacareer", uniqueId);
  }
  ////////////////////////////////////////////////////////////////////////masters
  getplantcode(plant: any) {
    return this.http.get(this.url + `/master/getplantcode?plant=${plant}`);
  }

  getPlantByCompanyCode(compantCode:any) {
    return this.http.get(this.url + `/master/get_plant_code?plant=${compantCode}`)
  }
  getLineName(form: any) {
    return this.http.get(
      this.url + `/master/getLineName?dept_slno=${form.dept_slno}`
    );
  }
  getRoleName(form: any) {
    return this.http.get(
      this.url + `/master/getRoleMaster?dept_slno=${form.dept_slno}`
    );
  }
  line_dept_design(form: any) {
    return this.http.get(
      this.url + "/master/getall?plantcode=" + form.plantcode
    );
  }
  companyshow() {
    return this.http.get(this.url + "/master/companyshow");
  }
  companyadd(form: any) {
    return this.http.post(this.url + "/master/companyadd", form);
  }
  companyedit(form: any) {
    return this.http.put(this.url + "/master/companyedit", form);
  }
  companydel(form: any) {
    return this.http.put(this.url + "/master/companydel", form);
  }

  getplant() {
    return this.http.get(this.url + "/master/getplant");
  }
  deleteplant(form: any) {
    return this.http.put(this.url + "/master/deleteplant", form);
  }
  updateplant(form: any) {
    return this.http.put(this.url + "/master/updateplant", form);
  }
  addplant(form: any) {
    return this.http.post(this.url + "/master/addplant", form);
  }
  /**
   * Payroll Area API Service #NEW
   * @param {*} data
   * @return {*} 
   * @memberof ApiService
   */
  addNewPayrollArea(data:any):any{
    return this.http.post(this.url + "/master/addPayrollArea",data);
  }
  updatePayrollArea(data:any){
    return this.http.put(this.url + "/master/updatePayrollArea",data)
  }
  getPayrollArea(){
    return this.http.get(this.url + "/master/getPayrollArea")
  }
  deletePayrollArea(data:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
  return this.http.delete(this.url + "/master/deletePayrollArea",httpOptions)
  }
  getPayrollAreaByPlantcode(plantcode:any){
    return this.http.get(this.url + `/master/getPayrollAreaByPlant?PlantCode=${plantcode}`);
  }

  /**
   * Cost Center API Service #NEW
   * 
   */
  /**
   * get cost center by filters
   * @param data
   */
  getCostCenter(data:any){
    return this.http.get(this.url + `/master/GetCostCenter?companyCode=${data?.companyCode}&departmentCode=${data?.departmentCode}&plantCode=${data?.plantCode}`)

  }

  /** 
   * update cost center
   * @param data
   */
  addCostCenter(data:any){
    return this.http.post(this.url + '/master/insertorupdatecostcenter',data)
  }
  /** 
   * update cost center
   * @param data
   */
  updateCostCenter(data:any){
    return this.http.post(this.url + '/master/updatecostcenter',data);
  }
  /** 
   * delete cost center logical delete
   * @param costCenterId OBJ
   */
  deleteCostcenter(costCenterId:any){
    return this.http.post(this.url + '/master/dlcostcenter',costCenterId)
  }
  /** 
   * get cost center by plant code
   * @param plantcode
   */
  getCostcenterByPlantcode(plantcode:any){
    return this.http.get(this.url + `/master/getCostcenterbyplant?PlantCode=${plantcode}`)
  }

  /**
   * Full month LOP API service
   * @param data
   */
  getTraineeDataForFML(data:any){
    return this.http.get(this.url + `/ars/applyFML?gen_id=${data.genId}&plantcode=${data.plantCode}`)
  }
  /**
   * Apply trainee LOP by HR API
   * @param data
   */
  applyTraineeLopByHR(data:any){
    return this.http.post(this.url + '/ars/insertTraineeLOP', data);
  }
  /**
   * apply full month LOP for trainee
   * @param data 
   * @returns 
   */
  applyfullMonthLOP(data:any){
    return this.http.post(this.url + '/ars/addTrnFML',data);
  }
  
  getLOPDataByEmployeeID(id:any){
    return this.http.get(this.url + `/ars/getFML?applied_by=${id}`)
  }

  // bank api service
  getbank() {
    return this.http.get(this.url + "/master/getbank");
  }
  deletebank(form: any) {
    return this.http.put(this.url + "/master/deletebank", form);
  }
  updatebank(form: any) {
    return this.http.put(this.url + "/master/updatebank", form);
  }
  addbank(form: any) {
    return this.http.post(this.url + "/master/addbank", form);
  }

  getdepartment() {
    return this.http.get(this.url + "/master/getdepartment");
  }
  getdepartment_header() {
    return this.http.get(this.url + "/master/getdept_header");
  }
  deletedepartment(form: any) {
    return this.http.put(this.url + "/master/deletedepartment", form);
  }
  updatedepartment(form: any) {
    return this.http.put(this.url + "/master/updatedepartment", form);
  }
  adddepartment(form: any) {
    return this.http.post(this.url + "/master/adddepartment", form);
  }

  getdesignation() {
    return this.http.get(this.url + "/master/getdesignation");
  }
  deletedesignation(form: any) {
    return this.http.put(this.url + "/master/deletedesignation", form);
  }
  updatedesignation(form: any) {
    return this.http.put(this.url + "/master/updatedesignation", form);
  }
  adddesignation(form: any) {
    return this.http.post(this.url + "/master/adddesignation", form);
  }

  getline() {
    return this.http.get(this.url + "/master/getline");
  }
  deleteline(form: any) {
    return this.http.put(this.url + "/master/deleteline", form);
  }
  updateline(form: any) {
    return this.http.put(this.url + "/master/updateline", form);
  }
  addline(form: any) {
    return this.http.post(this.url + "/master/addline", form);
  }

  getoperation(plant: any, admin: any) {
    return this.http.get(this.url + `/master/getoperation?Plant=${plant}&admin=${admin}`);
  }
  deleteoperation(form: any) {
    return this.http.put(this.url + "/master/deleteoperation", form);
  }
  updateoperation(form: any) {
    return this.http.put(this.url + "/master/updateoperation", form);
  }
  addoperation(form: any) {
    return this.http.post(this.url + "/master/addoperation", form);
  }

  addoperationWithFile(data: FormData) {
    return this.http.post(this.url + "/oprn_video", data);
  }


  getemployee() {
    return this.http.get(this.url + "/master/getemployee");
  }
  deleteemployee(form: any) {
    return this.http.put(this.url + "/master/deleteemployee", form);
  }
  updateemployee(form: any) {
    return this.http.put(this.url + "/master/updateemployee", form);
  }
  addemployee(form: any) {
    return this.http.post(this.url + "/master/addemployee", form);
  }

  getshift() {
    return this.http.get(this.url + "/master/getshift");
  }
  deleteshift(form: any) {
    return this.http.put(this.url + "/master/deleteshift", form);
  }
  updateshift(form: any) {
    return this.http.put(this.url + "/master/updateshift", form);
  }
  addshift(form: any) {
    return this.http.post(this.url + "/master/addshift", form);
  }

  plantcodelist(form: any) {
    return this.http.get(this.url + "/master/getplant");
  }

  getoprnDept(plant: any) {
    return this.http.get(this.url + `/master/getOprnDepartment?plant=${plant}`);
  }

  getoprnLine(Dept: any) {
    return this.http.get(this.url + `/master/getOprnLine?Department=${Dept}`);
  }

  getDeptByPlant() {
    return this.http.get(this.url + `/master/getDepartmentbyplant?plant=${sessionStorage.getItem("plantcode"
    )}`
    );
  }
  getlineBydept() {
    return this.http.get(this.url + `/master/lineByDept?empl_slno=${sessionStorage.getItem("emp_id")}`);
  }
  // getlineBydept_optr() {
  //   return this.http.get(
  //     this.url +
  //       `/master/lineByDept?empl_slno=${sessionStorage.getItem("user_name")}`
  //   );
  // }
  getlineBydeptslno(dept_slno: any) {
    return this.http.get(this.url + `/master/lineByDeptSlno?dept_slno=${dept_slno}`
    );
  }


  getBackDate() {
    return this.http.get(this.url + `/master/getbackdate`);
  }

  /** 
   * add backdate #NEW
   * @param data
   *  */
  addBackDate(data:any) {
    console.log('add backdate data:',data);
    return this.http.post(this.url + '/master/insertbackdatecontrol',data);
  }
  
  updateBackDate(data: any) {
    return this.http.post(this.url + `/master/updatebackdate`, data)
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////masters

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  getModules(username: any) {
    return this.http.get(this.url + "/training/getModules?username=" + username.username);
  }
  getModulesQa(username: any, plant: any) {
    return this.http.get(
      `${this.url}/training/getModulesQa?username=${username}&plant=${plant}`
    );
  }

  getOperationsSkill(username: any) {
    return this.http.get(
      this.url + "/training/getOperations?username=" + username.username
    );
  }

  addmodule(formvalue: any) {
    return this.http.post(this.url + "/training/addmodule", formvalue);
  }
  updatemodule(formvalue: any) {
    return this.http.put(this.url + "/training/updatemodule", formvalue);
  }
  deletemodule(formvalue: any) {
    return this.http.put(this.url + "/training/deletemodule", formvalue);
  }
  getQuestions(testData: any) {
    /** using urlSearchParams */
    const baseUrl = this.url + '/training/getQuestions';
    const url:any = new URL(baseUrl);
    const params = url.searchParams;
    params.append('module',`1.${testData.module.module_name}`);
    params.append('username',testData.username);
    console.log(url.toString());
    return this.http.get(url.toString());
    /** using encode uri component */
    // const module = encodeURIComponent(testData.module_name);
    // const username = encodeURIComponent(testData.username);
    // return this.http.get(
    //   this.url +
    //   "/training/getQuestions?module=1." + module +"&username=" + username
    // );
  }
  getQuestions_tnr(form: any) {
    return this.http.get(this.url + "/training/getQuestions_tnr?module=" + encodeURIComponent(form.module) + "&plant_code=" + form.plant_code);
  }

  getSkillQs_trn(form: any) {
    return this.http.get(this.url + "/training/getSkillQsPaper?operation=" + form.module + "&plant=" + form.plant + "&level=" + form.level);
  }

  getTest(data: any) {
    return this.http.get(
      this.url +
      "/training/getTest?username=" +
      data.username +
      "&module=1." +
      encodeURIComponent(data.module.module_name)
    );
  }
  Qualified(data: any) {
    return this.http.get(
      this.url +
      "/training/Qualified?username=" +
      data.username +
      "&module=1." +
      encodeURIComponent(data.module.module_name)
    );
  }
  pretest(formvalue: any) {
    return this.http.post(this.url + "/training/pretest", formvalue);
  }
  posttest(formvalue: any) {
    return this.http.post(this.url + "/training/posttest", formvalue);
  }
  questionbank(formvalue: any) {
    return this.http.post(this.url + "/training/questionbank", formvalue);
  }

  skillQuestionBank(formvalue: any) {
    return this.http.post(this.url + "/training/SkillQuesBank", formvalue);
  }

  questionBankDelete(formvalue: any) {
    return this.http.post(this.url + "/training/questionBankDelete", formvalue);
  }
  getTrainee() {
    return this.http.get(
      this.url +
      "/training/getTrainee?plantcode=" +
      sessionStorage.getItem("plantcode")
    );
  }
  get_test_status(form: any) {
    return this.http.get(
      this.url +
      "/training/get_test_status?idno=" +
      form.idno +
      "&module_name=" +
      encodeURIComponent(form.module_name)
    );
  }
  getOfflineModules(traineeId:any) {
    // + sessionStorage.getItem("plantcode"));
    return this.http.get(this.url + "/training/getOfflineModule?id=" + traineeId)
  }
 
  /** 
   * check previous test module
   * @param data
   * #NEW
   */
  checkTrainingModule(data:any){
    console.log('check data:',data);
    return this.http.get(this.url + `/training/checkPreviousModule?id=${data.idno}&module_name=${data.module_name}`)
  }

  offlineUpload(formvalue: any) {
    return this.http.post(this.url + "/training/offlineUpload", formvalue);
  }
  testSummary(form: any) {
    return this.http.get(this.url + "/training/testSummary?start=" + form.start + "&end=" + form.end + "&plantcode=" + form.plantcode + '&test_status=' + form.test_status + '&reporting_authority=' + form.reporting_authority);
  }
  traineeScorecard(formvalue: any) {
    return this.http.get(this.url + "/training/traineeScorecard?trainee_idno=" + formvalue.trainee_idno);
  }
  traineeAnswers(form: any) {
    return this.http.get(this.url + "/training/traineeAnswers?idno=" + form.idno + "&module=" + encodeURIComponent(form.module));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  depttransfer(form: any) {
    return this.http.get(
      this.url + "/hrOperation/depttransfer?plantcode=" + form.plantcode
    );
  }
  onboard(form: any) {
    return this.http.get(this.url + "/hrOperation/onboard?plantcode=" + form.plantcode + "&select=" + form.select);
  }
  relieve(form: any) {
    return this.http.put(this.url + "/hrOperation/relieve", form);
  }
  dept_line(form: any) {
    return this.http.get(this.url + `/hrOperation/dept-line?line_code=${form.line_code}&dept_slno=${form.dept_slno}&apln_slno=${form.apln_slno}`
    );
  }
  dept_line_report(form: any) {
    return this.http.get(this.url + `/hrOperation/dept-line-report?plantcode=${form.plantcode}`
    );
  }
  transfer(form: any) {
    return this.http.put(this.url + "/hrOperation/transfer", form);
  }
  getonboard(form: any) {
    return this.http.get(this.url + `/hrOperation/getonboard?apln_slno=${form.apln_slno}&readonly=${form.readonly}`);
  }

  getreliveReason() {
    return this.http.get(this.url + `/hrOperation/reliveReason`);
  }
  /** first apporver API */
  onboard_form(form: any) {
    console.log(form);
    return this.http.post(this.url + "/hrOperation/onboard_form", form);
  }
  /** HR finalApporver API #NEW
   * @param onboardData
   */
   traineeFinalApprover(onboardData:any){
    return this.http.post(this.url + '/hrOperation/onboard_form_new',onboardData)
   }

  getfiledrop(form: any) {
    return this.http.post(this.url + "/hrOperation/getfiledrop", form);
  }

  ////////////////////////////////////////////////////////////////////////////////////

  post_eval_days() {
    return this.http.get(this.url + "/skilldev//post-eval-days");
  }

  getSupervisorStatus(plant: any, dept: any) {
    return this.http.get(this.url + `/skilldev/Supervisor_Evaluation?Plant=${plant}&Dept=${dept}`)
  }

  evaluationdays(status: any) {
    return this.http.post(this.url + "/skilldev/evaluationdays", status);
  }
  skillmatrix(plant: any) {
    return this.http.get(this.url + `/skilldev/Skill_Matrix?plant=${plant}`);
  }
  evaluationdaysup(status: any) {
    return this.http.post(this.url + "/skilldev/evaluationdaysup", status);
  }
  evaluationDueSupervisor(form: any) {
    return this.http.get(this.url + "/skilldev/evaluationDueSupervisor?plantcode=" + form.plant_code + "&dept_slno=" + form.dept_slno);
  }
  rejoinData(formvalues: any) {
    return this.http.get(this.url + "/hrOperation/rejoin_request?plantcode=" + formvalues.plantcode + "&genid=" + formvalues.genid);
  }
  GetCategory() {
    return this.http.get(this.url + '/hrOperation/Get_Category');
  }
  AddRejoinTrainee(data: any) {
    return this.http.post(this.url + '/hrOperation/Add_Rejoin_Trainee', data);
  }
  GetRejoinTable(plant: any) {
    return this.http.get(this.url + `/hrOperation/Get_Rejoin_Table?plant=${plant}`);
  }
  UpdateSingleRejoin(data: any) {
    return this.http.put(this.url + '/hrOperation/Resubmit_Rejoin', data);
  }

  GetPhrTable(plant: any) {
    return this.http.get(this.url + `/hrOperation/Phr_Data?plant=${plant}`);
  }

  GetChrTable(plant: any) {
    return this.http.get(this.url + `/hrOperation/chr_Data?plant=${plant}`);
  }

  UpdatePHRApproval(data: any) {
    return this.http.put(this.url + '/hrOperation/Phr_Approve_Rejoin_Trainee', data);
  }

  UpdateCHRApproval(data: any) {
    return this.http.put(this.url + '/hrOperation/CHR_Approve_Rejoin_Trainee', data);
  }

  UpdateRejoinTrainee(data: any) {
    return this.http.put(this.url + '/hrOperation/Update_Rejoin_Request', data);
  }

  fetchLineNamesByDept(dept: string) {
    return this.http.get(this.url + `/skilldev/FetchLineDept?Dept=${dept}`);
  }
  eval_pending_approval(status: any) {
    return this.http.get(
      this.url +
      "/skilldev/eval_pending_approval?status=" +
      status.status +
      "&plantcode=" +
      status.plantcode
    );
  }
  get_eval_form(form: any) {
    return this.http.get(
      this.url +
      `/skilldev/get_eval_form?apln_slno=${form.apln_slno}&skill=${form.skill}`
    );
  }
  eval_form(form: any) {
    return this.http.post(this.url + "/skilldev/eval_form", form);
  }
  eval_form_sup(form: any) {
    return this.http.put(this.url + "/skilldev/eval_form_sup", form);
  }
  get_eval_sup(form: any) {
    return this.http.get(
      this.url +
      `/skilldev/get_eval_sup?apln_slno=${form.apln_slno}&skill=${form.skill}`
    );
  }
  getoperations(id: any) {
    return this.http.get(this.url + `/skilldev/getoperations?id=${id}`);
  }
  getoperationsByGenid(id: any) {
    return this.http.get(this.url + `/skilldev/getoperationsbygenid?genid=${id}&plant_code=${sessionStorage.getItem('plantcode')}`);
  }
  getoperationsByOperation(id: any) {
    return this.http.get(this.url + `/skilldev/getoperationsbyoperation?oprn=${id}&dept_slno=${sessionStorage.getItem('ishr') == 'true' || sessionStorage.getItem('ishrappr') == 'true' ? '' : sessionStorage.getItem('dept_slno')}`);
  }

  getOperationList() {
    return this.http.get(this.url + `/skilldev/getopranlist?plantcode=${sessionStorage.getItem('plantcode')}`)
  }

  getskillsummry() {
    return this.http.get(this.url + `/skilldev/getSkillSummary?plant=${sessionStorage.getItem('plantcode')}`)
  }

  getFileDetails(apln_slno: any) {
    return this.http.get(this.url + `/skilldev/fileDetails?apln_slno=${apln_slno}`)
  }

  getPlantskill() {
    return this.http.get(this.url + `/skilldev/getPlantskill?plant=${sessionStorage.getItem('plantcode')}`)
  }

  //////////////////////////////////////////////////////////////////////////////////

  trainee_report(form: any) {
    return this.http.post(this.url + `/report/trainee-report`, form);
  }
  test_summary(form: any) {
    return this.http.post(this.url + `/report/test-summary-report`, form);
  }
  eval_due(form: any) {
    return this.http.post(this.url + `/report/evaluation-due-report`, form);
  }

  raw_punch_data(params: any) {
    return this.http.get(this.url + `/report/getrawpunchdata?plant=${params.plant}&from=${params.from}&to=${params.to}`
    );
  }
  //////////////////////////////////////////////////////////////////////////

  people_planning(form: any) {
    return this.http.get(this.url + `/peopleplanning/people_planning?plant=${form.plantcode}&year=${form.year}&month=${form.month}`
    );
  }
  people_planning_save(form: any) {
    return this.http.post(this.url + "/peopleplanning/people_planning_save", form);
  }

  shift_template(plant: any) {
    return this,this.http.get(this.url + `/peopleplanning/Shift_Template?plant=${plant}`);
  };

  shift_upload(form: any) {
    return this.http.post(this.url + "/peopleplanning/Shift_Upload", form);
  }


  /////////////////////////////////////// PHASE - 3
  attendance(form: any) {
    return this.http.get(
      this.url2 + "/attendance?emp_id=" + form.emp_id + "&date=" + form.date
    );
  }
  forgotpunch_details(form: any) {
    return this.http.get(
      this.url + "/ars/forgotPunchDetail?id=" + form.id + "&date=" + form.date
    );
  }
  forgot_punch(form: any) {
    return this.http.post(this.url2 + "/forgot_punch", form);
  }
  coff_date(form: any) {
    return this.http.post(this.url2 + "/coff_dates", form);
  }
  coff_details(form: any) {
    return this.http.get(
      this.url2 + "/coff_details?emp_id=" + form.emp_id + "&date=" + form.date,
      form
    );
  }
  coff_date_validation(form: any) {
    return this.http.get(
      this.url2 +
      "/coffDateValidation?emp_id=" +
      form.emp_id +
      "&coffDate=" +
      form.coff_date +
      "&date=" +
      form.date,
      form
    );
  }
  emp_coff(form: any) {
    return this.http.post(this.url2 + "/emp_coff", form);
  }
  ot_dates(form: any) {
    return this.http.post(this.url2 + "/ot_dates", form);
  }
  ot_details(form: any) {
    return this.http.get(
      this.url2 + "/ot_details?emp_id=" + form.emp_id + "&date=" + form.date,
      form
    );
  }
  get_machine_id(form: any) {
    return this.http.get(this.url2 + "/ot_machine_id?id=" + form.id, form);
  }
  ot_apply(form: any) {
    return this.http.post(this.url2 + "/ot_apply", form);
  }
  shift_change_shifts(form: any) {
    return this.http.get(
      this.url2 + "/shift_change_shifts?id=" + form.id,
      form
    );
  }
  shift_change_reliever_name(form: any) {
    return this.http.get(
      this.url2 + "/shift_change_reliever_name?id=" + form.id,
      form
    );
  }
  shift_change(form: any) {
    return this.http.post(this.url2 + "/shift_change", form);
  }
  forgotPunchStatus(form: any) {
    return this.http.get(
      this.url +
      "/ars/forgotPunchStatus?empID=" +
      form.empID +
      "&date=" +
      form.date,
      form
    );
  }
  shiftChangeStatus(form: any) {
    return this.http.get(
      this.url2 +
      "/shiftChangeStatus?empID=" +
      form.empID +
      "&date=" +
      form.date,
      form
    );
  }
  otStatus(form: any) {
    return this.http.get(
      this.url2 + "/otStatus?empID=" + form.empID + "&date=" + form.date,
      form
    );
  }

  coffRequestDisplay(form: any) {
    return this.http.get(
      this.url2 + "/coffRequestDisplay?executiveID=" + form.id,
      form
    );
  }
  coffRequestStatus(form: any) {
    return this.http.post(this.url2 + "/coffRequestStatus", form);
  }
  otRequestDisplay(form: any) {
    return this.http.get(
      this.url2 + "/otRequestDisplay?executiveID=" + form.id,
      form
    );
  }
  otRequestStatus(form: any) {
    return this.http.post(this.url2 + "/otRequestStatus", form);
  }
  shiftChangeRequestDisplay(form: any) {
    return this.http.get(
      this.url2 + "/shiftChangeRequestDisplay?executiveID=" + form.id,
      form
    );
  }
  shiftChangeRequestStatus(form: any) {
    return this.http.post(this.url2 + "/shiftChangeRequestStatus", form);
  }
  forgotPunchRequestDisplay(form: any) {
    return this.http.get(this.url + "/ars/forgotPunchRequestDisplay?executiveID=" + form.id, form);
  }
  forgotPunchRequestStatus(form: any) {
    return this.http.post(this.url2 + "/forgotPunchRequestStatus", form);
  }
  calendar(form: any) {
    return this.http.get(
      this.url2 + "/ars/calendar?id=" + form.id + "&date=" + form.date,
      form
    );
  }
  cal(form: any) {
    return this.http.get(this.url2 + "/ars/calendarsup?genid=" + form.id + "&date=" + form.date + "&dept=" + sessionStorage.getItem("dept_slno") + "&plant=" + sessionStorage.getItem("plantcode") + "&hr=" + sessionStorage.getItem("ishr"), form
    );
  }

  forgottopunchapply(data: any) {
    return this.http.post(this.url + `/ars/forgottopunchapply`, data);
  }

  approveForgotToPunch(data: any) {
    return this.http.post(this.url + `/ars/approveForgotToPunch`, data);
  }

  getlockDate() {
    let user = sessionStorage.getItem("user_name");
    return this.http.get(this.url + `/ars/getlockdate?user=${user}`);
  }
  get_ot_details_supervisor() {
    let empID = sessionStorage.getItem("emp_id");
    let plant = sessionStorage.getItem("plantcode");
    return this.http.get(
      this.url + `/ars/get_ot_details_supervisor?plant=${plant}&empID=${empID}`
    );
  }

  getMachine(apln_slno: any) {
    return this.http.get(
      this.url +
      `/ars/getMachine?plant=${sessionStorage.getItem(
        "plantcode"
      )}&apln_slno=${apln_slno}`
    );
  }

  getConsumedOtDetails(apln_slno: any, date: any) {
    return this.http.get(
      this.url + `/ars/getOtDetails?apln_slno=${apln_slno}&date=${date}`
    );
  }

  getAllowedOtHours() {
    return this.http.get(this.url + `/ars/getAllowedOtHours?plant=${sessionStorage.getItem("plantcode")}`
    );
  }
  requestOt(data: any) {
    return this.http.post(this.url + `/ars/requestOT`, data);
  }

  getFhOt() {
    return this.http.get(this.url + `/ars/getFhOt?empId=${sessionStorage.getItem("emp_id")}`);
  }

  approveFhOt(data: any) {
    return this.http.post(this.url + `/ars/approveOT`, data);
  }

  getPhOt() {
    return this.http.get(
      this.url + `/ars/getPhOt?empId=${sessionStorage.getItem("emp_id")}`
    );
  }

  approvePhOt(data: any) {
    return this.http.post(this.url + `/ars/approvePhOt`, data);
  }

  approvePhOtBulk(data: any) {
    return this.http.post(this.url + `/ars/approvePhOtBulk`, data);
  }

  approveFhOtBulk(data: any) {
    return this.http.post(this.url + `/ars/approveFhOtBulk`, data);
  }
  getHrCoff(genid: any) {
    return this.http.get(
      this.url +
      `/ars/getHrCoff?plant=${sessionStorage.getItem(
        "plantcode"
      )}&genid=${genid}`
    );
  }

  getlockDateByEmp(user: any) {
    return this.http.get(this.url + `/ars/getlockdate?user=${user}`);
  }

  getlockdateByPlant() {
    return this.http.get(
      this.url +
      `/ars/getlockdateByPlant?plant=${sessionStorage.getItem("plantcode")}`
    );
  }
  getlockdateByCategory(category: any) {
    return this.http.get(
      this.url +
      `/ars/getlockdateByCategory?plant=${sessionStorage.getItem("plantcode")}&cat=${category}`
    );
  }

  getLastProcesedBill(plantCode:any,category:any){
    return this.http.get(this.url + `/ars/getlockdateByCategory?plant=${plantCode}&cat=${category}`)
  }

  
  checkCoffDate(date: any, apln_slno: any) {
    return this.http.get(
      this.url + `/ars/checkCoffDate?date=${date}&apln_slno=${apln_slno}`
    );
  }

  applyHrCoff(data: any) {
    return this.http.post(this.url + `/ars/applyHrCoff`, data);
  }

  coffStatus(date: any) {
    return this.http.get(
      this.url +
      "/ars/compoffStatus?apln_slno=" +
      sessionStorage.getItem("user_name") +
      "&date=" +
      date
    );
  }

  /** new reports #new */
  
  /** LOP report #new
   * @param {*} formData lop report filter form
   */
  getLopReportData(formData:any){
    return this.http.get(this.url + `/report/lopreport?companyCode=${formData.companyCode}&genId=${formData.genId}&month=${formData.month}&payrollArea=${formData.payrollArea}&plantCode=${formData.plantCode}&year=${formData.year}`);
  }
  /** 
   * cumulative report #new
   * @param {*} formData cumulative report form
   * lockMonth ==> formData.year + formData.month + 01
   */

  getCumulativeReportData(formData:any) {
    return this.http.get(this.url + `/report/cumulativereport?plant=${formData.plantCode}&pArea=${formData.payrollArea}&lockMonth=${formData.year + '-' + formData.month + '-' + '01'}&company_code=${formData.companyCode}&genid=${formData.genId}`)
  }
  arsReports(data: any) {
    return this.http.get(this.url + `/report/arsreports?type=${data.type}&plant=${data.plant}&from=${data.from}&to=${data.to}&cat=${data.cat}`
    );
  }

  musterReport(from: any, to: any) {
    return this.http.get(
      this.url +
      `/ars/musterReport?plant=${sessionStorage.getItem(
        "plantcode"
      )}&from=${from}&to=${to}`
    );
  }

  atndReport(data: any) {
    return this.http.get(this.url + `/report/presentAbsentReport?plant=${data.plant}&year=${data.year}&month=${data.month}&id=${data.id}&dept=${sessionStorage.getItem("ishr") == "true" ? undefined : sessionStorage.getItem("dept_slno")}`
    );
  }

  getCategories() {
    return this.http.get(this.url + "/hrOperation/getcategory");
  }

  getExcessHours() {
    return this.http.get(this.url + `/ars/getExcessHours?empl_slno=${sessionStorage.getItem("emp_id")}`);
  }
  getExcessHours_Report() {
    return this.http.get(this.url + `/ars/getExcessHours_Report?empl_slno=${sessionStorage.getItem("emp_id")}`);
  }

  approveExcessHr(data: any) {
    return this.http.post(this.url + `/ars/approveExcessHr`, {data:data});
  }

  getApprovedExcessHours() {
    return this.http.get(
      this.url +
      `/ars/getApprovedExcessHours?empl_slno=${sessionStorage.getItem(
        "emp_id"
      )}`
    );
  }
  getApprovedExcessHoursOptr(plant: any, emp: any) {
    return this.http.get(
      this.url +
      `/ars/getApprovedExcessHours_optr?empl_slno=${emp}&plant=${plant}`);
  }

  getAbsentDays(apln_slno: any) {
    return this.http.get(
      this.url + `/ars/getAbsentDays?apln_slno=${apln_slno}`
    );
  }
  getAbsentDays_Optr(apln_slno: any) {
    return this.http.get(
      this.url + `/ars/getAbsentDays_Optr?apln_slno=${apln_slno}`
    );
  }

  getFullDayAbsentDays(apln_slno: any) {
    return this.http.get(
      this.url + `/ars/getFullDayAbsentDays?apln_slno=${apln_slno}`
    );
  }
  approveCoff(data: any) {
    return this.http.post(this.url + `/ars/approveCoff`, data);
  }
  applyCoffByOptr(data: any) {
    return this.http.post(this.url + `/optr/apply_coff_optr`, data);
  }

  getNightShiftCompOff() {
    return this.http.get(
      this.url +
      `/ars/getNightShiftCompOff?empl_slno=${sessionStorage.getItem(
        "emp_id"
      )}`
    );
  }

  approveNightCoff(data: any) {
    return this.http.post(this.url + `/ars/approveNightCoff`, data);
  }

  getApprovedHrDetails(apln_slno: any) {
    return this.http.get(
      this.url + `/ars/getApprovedHrDetails?apln_slno=${apln_slno}`
    );
  }
  getApprovedHrDetails_Optr(apln_slno: any) {
    return this.http.get(
      this.url + `/ars/getApprovedHrDetails_optr?apln_slno=${apln_slno}`
    );
  }

  getApprovedCoffDetails(apln_slno: any) {
    return this.http.get(
      this.url + `/ars/getApprovedCoffDetails?apln_slno=${apln_slno}`
    );
  }
  getApprovedCoffDetails_Optr(apln_slno: any) {
    return this.http.get(
      this.url + `/ars/getApprovedCoffDetails_Optr?apln_slno=${apln_slno}`
    );
  }

  getOtapperMapping(plant: any) {
    return this.http.get(this.url + `/ars/otapprmapping?plant=${plant}`);
  }
  getFiveDaysMapping(plant: any) {
    return this.http.get(this.url + `/master/getFiveDaysList?plant=${plant}`);
  }

  Update5Days(data: any, user: any) {
    return this.http.post(this.url + `/master/Update5Days?user=${user}`, data);
  }

  saveMapping(data: any, user: any) {
    return this.http.post(this.url + `/master/saveFiveDaysList?user=${user}`, data);
  }

  getEmplListForMapping(plant: any) {
    return this.http.get(this.url + `/ars/emplListForMapping?plant=${plant}`);
  }

  getFHListForMapping(plant: any) {
    return this.http.get(this.url + `/ars/FHListForMapping?plant=${plant}`);
  }

  gethrApprList(plant: any) {
    return this.http.get(this.url + `/ars/hrApprList?plant=${plant}`);
  }

  addOtMapping(data: any) {
    return this.http.post(this.url + `/ars/addOtMapping`, data);
  }
  editOtMapping(data: any) {
    return this.http.post(this.url + `/ars/editOtMapping`, data);
  }

  deleteOtMapping(data: any) {
    return this.http.post(this.url + `/ars/deleteOtMapping`, data);
  }

  getDetailsbyGebId(genid: any, plant: any) {
    return this.http.get(
      this.url + `/ars/getDetailsbyGebId?genid=${genid}&plant=${plant}`
    );
  }

  getWeekoffData(date: any, line: any,endOfWeek:any) {
    return this.http.get(this.url + `/ars/getWeekoffData?date=${date}&line=${line}&sunday=${endOfWeek}`
    );
  }
  // update already updated week off
  changeAlreadyUpdatedEmployeeWeekOff(data:any){
    return this.http.put(this.url + '/ars/second_weekoff_update', data)
  }

  getWeekdates(date: any) {
    return this.http.get(this.url + `/ars/getWeekdates?date=${date}`);
  }

  checkIfAbsent(empid: any, date: any, sunday: any) {
    return this.http.get(
      this.url + `/ars/checkIfAbsent?date=${date}&emp_id=${empid}&sunday=${sunday}`
    );
  }

  updateWeekOff(data: any) {
    return this.http.post(this.url + `/ars/updateWeekOff`, data);
  }


  getFpreason() {
    return this.http.get(this.url + `/ars/fpreason?plant=${sessionStorage.getItem('plantcode')}`);
  }

  getfpreasonArs() {
    return this.http.get(
      this.url + `/ars/fpreasonArs?apln_slno=${sessionStorage.getItem('user_name')}`
    );
  }

  getApprovedHoursforEmp(month: any, year: any, type: any) {
    return this.http.get(
      this.url + `/ars/getApprovedHoursforEmp?apln_slno=${sessionStorage.getItem('user_name')}&month=${month}&year=${year}&type=${type}`
    );
  }

  getbackdate() {
    return this.http.get(this.url + `/ars/getbackdate?plant=${sessionStorage.getItem('plantcode')}`)
  }
  getPayrolldate() {
    return this.http.get(this.url + `/ars/getPayrollDate?plant=${sessionStorage.getItem('plantcode')}`)
  }

  //////////////////////////////////////////////////////////////////////////////////

  plantupload(form: any) {
    return this.http.post(this.url + "/plantupload", form);
  }
  offline_test(form: any) {
    return this.http.post(this.url + "/offline_test_upload", form);
  }
  questionbankupload(formvalue: any) {
    return this.http.post(this.url + "/questionbankupload", formvalue);
  }
  SkillimageUpload(formvalue: any) {
    return this.http.post(this.url + "/skill_dev_upload", formvalue)
  }
  skill_dev(form: any) {
    return this.http.post(this.url + "/skill_dev_upload", form);
  }
  filedrop(form: any) {
    return this.http.post(this.url + "/filedrop", form);
  }

  //////////////////////////////////////////////////////////////////////////////////

  submitted_mail(form: any) {
    return this.http.post(this.url + "/hrOperation/submitted_mail", form);
  }
  approved_mail(form: any) {
    return this.http.post(this.url + "/hrOperation/approved_mail", form);
  }
  evaluation_mail(form: any) {
    return this.http.post(this.url + "/hrOperation/evaluation_mail", form);
  }

  //////////////////////////////PMPD/////////////////////////////////////
  get_pmpd_data() {
    return this.http.get(this.url + "/pmpd/getData");
  }
  verify_pmpd_data(data: any) {
    return this.http.put(this.url + "/pmpd/validateData", data);
  }

  upload_pmpd_data(data: any) {
    return this.http.put(this.url + "/pmpd/uploadData", data);
  }

  update_pmpd_data(data: any) {
    return this.http.post(this.url + "/pmpd/updatePmpd", data);
  }

  activate_pmpd(data: any) {
    return this.http.post(this.url + "/pmpd/reActivate", data);
  }

  getProdData(from: any, to: any) {
    return this.http.get(this.url + `/pmpd/getProdData?from=${from}&to=${to}`);
  }

  verifyProdData(data: any) {
    return this.http.post(this.url + `/pmpd/verifyProdActual`, data);
  }

  uploadProdData(data: any) {
    return this.http.post(this.url + `/pmpd/uploadProdData`, data);
  }

  //ars
  forgottoPunchCheck(genid: any, date: any, plant: any) {
    return this.http.get(
      this.url +
      "/ars/fpcheck?genid=" +
      genid +
      "&date=" +
      date +
      "&plant=" +
      plant
    );
  }

  forgottoPunchData(genid: any, date: any) {
    return this.http.get(this.url + "/ars/fpdata?genid=" + genid + "&date=" + date);
  }

  insertFotgotPunchData(data: any) {
    return this.http.put(this.url + "/ars/insertFp", data);
  }

  verify_bulk(data: any) {
    return this.http.post(this.url + `/ars/verifyBulk`, data);
  }

  insert_bulk_fp(data: any) {
    return this.http.put(this.url + `/ars/insertBulkFp`, data);
  }

  //dashboard

  getDeptAtndData(data: any) {
    return this.http.get(
      this.url +
      `/report/getDepartmentAtndDetails?plant=${data.plant}&date=${data.date}`
    );
  }

  getLineAtndDetails(data: any) {
    return this.http.get(
      this.url +
      `/report/getLineAtndDetails?plant=${data.plant}&date=${data.date
      }&dept=${sessionStorage.getItem("ishr") == "true" ||
        sessionStorage.getItem("ishrappr") == "true"
        ? ""
        : sessionStorage.getItem("dept_slno")
      }`
    );
  }
  getContAtndData(data: any) {
    return this.http.get(
      this.url +
      `/report/getContractAtndDetails?plant=${data.plant}&date=${data.date}`
    );
  }
  getCatAtndData(data: any) {
    return this.http.get(
      this.url +
      `/report/getCategoryAtndDetails?plant=${data.plant}&date=${data.date}`
    );
  }

  directandindirect(data: any) {
    return this.http.get(
      this.url +
      `/report/getdirectandindirect?plant=${data.plant}&date=${data.date}`
    );
  }
  getetplanvsactdept(data: any) {
    return this.http.get(
      this.url +
      `/report/getplanvsactdept?plant=${data.plant}&date=${data.date}&type=${data.type}`
    );
  }

  getplanvsactline(data: any) {
    return this.http.get(
      this.url +
      `/report/getplanvsactline?plant=${data.plant}&date=${data.date}&dept=${data.dept}&type=${data.type}`
    );
  }

  getexcesshourschart(data: any) {
    return this.http.get(
      this.url +
      `/report/getexcesshourschart?plant=${data.plant}&year=${data.year}`
    );
  }

  getMissPunchTrend(data: any) {
    return this.http.get(
      this.url +
      `/report/getmisspunchtrend?plant=${data.plant}&year=${data.year}`
    );
  }

  getContWorking(data: any) {
    return this.http.get(
      this.url +
      `/report/count_working?plant=${data.plant}&year=${data.year}&month=${data.month}`
    );
  }

  getDeptReport(data: any) {
    return this.http.get(this.url + `/report/getdeptreport?plant=${sessionStorage.getItem('plantcode')}&from=${data.from}&to=${data.to}&dept=${sessionStorage.getItem('dept_slno')}`
    );
  }

  getSkillTest(genid: string) {
    return this.http.get(`${this.url}/skilldev/Skill_Test?genid=${genid}`);
  }

  getSkillTestHr(genid: string) {
    return this.http.get(`${this.url}/skilldev/Skill_Test_HR?genid=${genid}`);
  }

  getSkillOperations(line: any, plant: any) {
    return this.http.get(`${this.url}/skilldev/Skill_Operations?line=${line}&plant=${plant}`);
  }

  getskillvideo(skill: any, plant: any) {
    return this.http.get(`${this.url}/skilldev/Skill_Operations_Video?skill=${skill}&plant=${plant}`);
  }

  getSkillTestQuestions(plant: any, level: any, Oprn: any, genid: any) {
    return this.http.get(`${this.url}/skilldev/skill_test_question?level=${level}&plant=${plant}&oprn=${Oprn}&trainee=${genid}`);
  }

  getRepActiSts(genid: any) {
    return this.http.get(`${this.url}/skilldev/Reporting_Author?trainee=${genid}`);
  }

  skillTestSubmit(payload: any) {
    return this.http.post(this.url + "/skilldev/skill_Test_Submit", payload);
  }

  answersheet(genid: string) {
    return this.http.get(`${this.url}/skilldev/Answer_Sheet?genid=${genid}`);
  }

  answersforuser(genid: string) {
    return this.http.get(`${this.url}/skilldev/Answer_peval_no?genid=${genid}`);
  }

  abservforuser(genid: string) {
    return this.http.get(`${this.url}/skilldev/Abserv_Peval_No?peval=${genid}`);
  }

  getSupDept(plant: any) {
    return this.http.get(`${this.url}/training/get_Sup_Dept?plant=${plant}`);
  }

  SupAbserPoint(formvalue: any) {
    return this.http.post(this.url + "/training/Super_Questions", formvalue);
  }

  getSupQuestion(form: any) {
    return this.http.get(this.url + "/training/getSupQuestion?Dept=" + form.Department + "&plant=" + form.Plant);
  }

  getSupervisorAbserventPoint(plant: any, dept: any) {
    return this.http.get(`${this.url}/skilldev/Supervisor_Abservent_Point?Plant=${plant}&Dept=${dept}`);
  }

  getOldAbservent(peval: any) {
    return this.http.get(`${this.url}/skilldev/Old_Abservents?Peval=${peval}`);
  }

  getSkillPersonStatus(peval: any) {
    return this.http.get(`${this.url}/skilldev/Supervisor_Evaluation1?Peval=${peval}`)
  }

  submitSuperAbserv(formValue: any) {
    return this.http.post(this.url + "/skilldev/Submit_Abservents", formValue);
  }

  getDeptForReport(plant: any) {
    return this.http.get(`${this.url}/report/getDepartments?plant=${plant}`)
  }

  getMatrixReport(dept: any, plant: any) {
    return this.http.get(`${this.url}/report/Matrix_Report?department=${dept}&plant=${plant}`)
  }

}
