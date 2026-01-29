import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { environment } from '../../environments/environment.prod'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClamAPIService {
  url: any = environment.path
  url2: any = environment.path2

  constructor(private http: HttpClient) { }

  // ---------

  license_file(formData: any, code: any) {
    const queryParams = new URLSearchParams({ code }).toString();
    return this.http.post<any>(`${this.url}/Licns_Upload?${queryParams}`, formData)

  }

  // getBasicFile(code:any){
  //   return this.http.get(this.url+'/hrOperation/getdatabasic?mobile='+uniqueId.mobile+'&company='+uniqueId.company)
  // }



  addContractor(data: any) {
    return this.http.post<any>(this.url + '/clam/contractadd', data)

  }

  getContractor() {
    return this.http.get<any>(this.url + '/clam/getcon')
  }
  getContractor_combine(userEmpcode: any) {
    const queryParams = new URLSearchParams({ userEmpcode }).toString();
    return this.http.get(`${this.url}/clam/getcon_combine?${queryParams}`, {});

  }
  getPlant_compain(userEmpcode: any) {
    const queryParams = new URLSearchParams({ userEmpcode }).toString();
    return this.http.get(`${this.url}/clam/plant_compain?${queryParams}`, {});
  }

  getPayroll() {
    return this.http.get<any>(this.url + '/clam/payroll')
  }

  updateContractor(data: any, concode: any) {
    const queryParams = new URLSearchParams({ concode }).toString();
    return this.http.put<any>(`${this.url}/clam/editcon?${queryParams}`, data)
  }
  deleteContractor(id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/delcon?${queryParams}`, {});

  }

  getConcode() {
    return this.http.get(this.url + '/clam/concode')
  }

  clamSearch(keyParams: { contCode?: string, companyName?: string, sapVendor?: string }): Observable<any> {
    return this.http.get<any>(`${this.url}/clam/search`, { params: keyParams });
  }




  // -------------------------------------
  getPlantCode(id: any) {

    const queryParams = new URLSearchParams({ id }).toString();
    // console.log(`${this.url}/clam/plantid?${queryParams}`)
    return this.http.get(`${this.url}/clam/plantid?${queryParams}`, {});
  }

  // -------------------------------------
  // getPlantCode(id: any) {

  //   const queryParams = new URLSearchParams({ id }).toString();
  //   // console.log(`${this.url}/clam/plantid?${queryParams}`)
  // return this.http.get(`${this.url}/clam/plantid?${queryParams}`, {});
  // }

  //----------------------------------------------------------------
  getPlant() {
    return this.http.get(this.url + '/clam/plant')
  }


  //---------------------------------------------------------------

  // Canteen master
  addCanteen(data: any) {
    // console.log(this.url+'/clam/addcanteen')
    // console.log(data)
    return this.http.post(this.url + '/clam/addcanteen', data)
  }

  editCanteen(data: any) {
    return this.http.post(this.url + '/clam/editcanteen', data)
  }
  getCanteen_Mst() {
    return this.http.get(this.url + '/clam/getcanteen')
  }

  deleteCanteen(id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/delcanteen?${queryParams}`, {});

  }

  get_Shift_master() {
    return this.http.get(this.url + '/clam/getshift')
  }

  // -----------------------------------------------

  add_El(data: any) {
    return this.http.post(this.url + '/clam/add_el', data)
  }

  edit_El(data: any, id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/edit_el?${queryParams}`, data)
  }

  get_El_Mst() {
    return this.http.get(this.url + '/clam/get_el')
  }

  delete_El(id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/del_el?${queryParams}`, {});

  }


  // Bonus Master


  get_Bonus_Mst() {
    return this.http.get(this.url + '/clam/bonus')
  }
  edit_Bonus_Mst(data: any, id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/upd_bonus?${queryParams}`, data)
  }
  del_Bonus_Mst(id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/delbonus?${queryParams}`, {});
  }
  add_Bonus_Mst(data: any) {
    return this.http.post(this.url + '/clam/addbonus', data)
  }

  // PayRoll Master

  get_Payroll_Master() {
    return this.http.get(this.url + '/clam/payroll')
  }
  del_Payroll_Master(data: any, id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/delpayroll?${queryParams}`, data);
  }
  add_Payroll_Master(data: any) {
    return this.http.post(this.url + '/clam/addpayroll', data)
  }

  edit_Payroll_Master(data: any, id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/upd_payroll?${queryParams}`, data)
  }

  // =========================================
  // Payscaler Master

  get_Payscale_Master(plant_code: any) {
    // return this.http.get(this.url+'/clam/payscale')
    const queryParams = new URLSearchParams({ plant_code }).toString();
    return this.http.get(`${this.url}/salary/payscale?${queryParams}`);
  }

  get_Payscale_Master_combine(plant_code: string, userEmpcode: any) {
    // return this.http.get(this.url+'/clam/payscale')
    const queryParams = new URLSearchParams({ plant_code }).toString();
    const queryParams1 = new URLSearchParams({ userEmpcode }).toString();
    return this.http.get(`${this.url}/salary/payscale_combine?${queryParams}&${queryParams1}`);
  }


  del_Payscale_Master(data: any, id: any) {
    console.log(data)
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/delpayscale?${queryParams}`, data);
  }

  add_Payscale_Master(data: any) {
    return this.http.post(this.url + '/clam/addpayscale', data)
  }
  add_Payscale_Master_new(data: any) {
    return this.http.post(this.url + '/salary/addpayscale', data)
  }
  Update_Payscale_Master(data: any) {
    return this.http.post(this.url + '/salary/updatepayscale', data)
  }

  edit_Payscale_Master(data: any, id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/upd_payscale?${queryParams}`, data)
  }

  get_Payscale_code() {
    return this.http.get(this.url + '/clam/paycode')
  }

  get_Contractor_list() {

  }

  get_Payscale_Header(plant: any) {
    const queryParams = new URLSearchParams({ plant }).toString();
    return this.http.get(`${this.url}/salary/getPayscaleHeader?${queryParams}`)

  }
  get_Payscale_Header_combine(plant: string, userEmpcode: any) {
    const queryParams = new URLSearchParams({ plant }).toString();
    const queryParams1 = new URLSearchParams({ userEmpcode }).toString();
    return this.http.get(`${this.url}/salary/getPayscaleHeader_combine?${queryParams}&${queryParams1}`)

  }


  // ===================================================

  get_pincode() {
    return this.http.get(this.url + '/clam/pincode')
  }
  get_ror() {
    return this.http.get(this.url + '/clam/ror')
  }
  get_religion() {
    return this.http.get(this.url + '/clam/rel')
  }
  getDepList(id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.get(`${this.url}/clam/getDepList?${queryParams}`)

  }
  getLine(dept_slno: any) {
    const queryParams = new URLSearchParams({ dept_slno }).toString();
    return this.http.get(`${this.url}/clam/getLineName?${queryParams}`)

  }

  getRoleName(form: any) {
    console.log('form', form);

    return this.http.get(
      this.url + `/clam/getRoleMaster?dept_slno=${form}`
    );
  }

  get_Last_EmpID() {
    return this.http.get(this.url + '/clam/lastempId')
  }


  get_Cl_Emp_Hr() {
    return this.http.get(this.url + '/clam/clhr')
  }
  get_Cl_Emp_Hrappr(plant_code: any) {

    const queryParams = new URLSearchParams({ plant_code }).toString();
    return this.http.get(`${this.url}/clam/clhrappr?${queryParams}`)
    // return this.http.get(this.url+'/clam/clhrappr')
  }
  searchFilter(data: any) {
    // console.log(data)
    return this.http.get<any>(this.url + '/clam/hrSearch?status=' + data.status + '&CName=' + data.CName + '&EName=' + data.EName + '&plantcode=' + data.plantcode + '&emp_code=' + data.emp_code,)
  }


  add_cl_Emp_ByCon(data: any) {
    return this.http.post(this.url + '/clam/addclemp', data)
  }

  photo_upload(formData: any, code: any) {
    console.log(formData, code)
    const queryParams = new URLSearchParams({ code }).toString();
    console.log(`${this.url}/Cl_Photo_Upload?${queryParams}`)
    return this.http.post<any>(`${this.url}/Cl_Photo_Upload?${queryParams}`, formData)

  }

  edit_Cl_Emp_ByCon(data: any, id: any) {
    console.log(data, id)
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/editclemp?${queryParams}`, data)
  }

  submit_cl_Emp_ByHR(data: any, id: any) {
    console.log(data)
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/clemphr?${queryParams}`, data)
  }

  edit_cl_Emp_ByHR(data: any, id: any) {
    console.log(data)
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/cleedithr?${queryParams}`, data)
  }

  app_cl_Emp_By_HRappr(data: any, id: any) {
    console.log(data)
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/clemphrappr?${queryParams}`, data)
  }

  edit_cl_Emp(data: any, id: any) {
    const queryParams = new URLSearchParams({ id }).toString();
    return this.http.put(`${this.url}/clam/editclemp?${queryParams}`, data)
  }
  del_cl_Emp_byCon(apln_slno: any, reason: string, status: string) {
    const queryParams = new URLSearchParams({ apln_slno, reason, status }).toString();
    return this.http.put(`${this.url}/clam/delclemp?${queryParams}`, reason)
  }
  rej_by_Hrappr(apln_slno: any, reason: string) {
    const queryParams = new URLSearchParams({ apln_slno, reason }).toString();
    return this.http.put(`${this.url}/clam/rejcl?${queryParams}`, reason)
  }


  getLinebyplant(plant_Code: any, dept: any, hr: any) {
    const plant = new URLSearchParams({ plant_Code }).toString();
    const dep = new URLSearchParams({ dept }).toString();
    const Hr = new URLSearchParams({ hr }).toString();
    return this.http.get(`${this.url}/clam/lineby?${plant}&${dep}&${Hr}`)

  }


  get_Shift(plant_Code: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/clam/shiftby?${queryParams}`)

  }

  getrawShiftData(plant_Code: string, date: string, dept: any, hr: any) {
    const queryParams1 = new URLSearchParams({ plant_Code }).toString();
    const queryParams2 = new URLSearchParams({ date }).toString();
    const queryParams3 = new URLSearchParams({ dept }).toString();
    const queryParams4 = new URLSearchParams({ hr }).toString();
    return this.http.get(`${this.url}/clam/arsData?${queryParams1}&${queryParams2}&${queryParams3}&${queryParams4}`)
  }

  cancelShift(data: any) {
    return this.http.post(this.url + '/clam/shiftcancel', data)
  }

  // Salary
  getapntList(plant_Code: string,) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/updt_pay?${queryParams}`)
  }

  getTraineDtls(apln_slno: any, gen_id: any, apln_status: any) {
    // console.log(apln_slno, apln_status, gen_id)
    const queryParams1 = new URLSearchParams({ apln_slno }).toString();
    const queryParams2 = new URLSearchParams({ apln_status }).toString();
    const queryParams3 = new URLSearchParams({ gen_id }).toString();
    return this.http.get(`${this.url}/salary/get_tr?${queryParams1}&${queryParams2}&${queryParams3}`)
  }
  getTraineDtlsSal(apln_slno: any) {
    // console.log(apln_slno, apln_status, gen_id)
    const queryParams1 = new URLSearchParams({ apln_slno });

    return this.http.get(`${this.url}/salary/get_tr_dtls?${queryParams1}`)
  }

  getPayrollData(plant_Code: string) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/payroll_data?${queryParams}`)
  }


  getConPayscale(plant_Code: string, con_id: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    const queryParams1 = new URLSearchParams({ con_id }).toString();
    return this.http.get(`${this.url}/salary/conpay?${queryParams}&${queryParams1}`)
  }
  getSinglePayscale(data: any) {

    return this.http.post(`${this.url}/salary/SinglePay`, data)
  }

  getCanteen(plant_Code: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/cant_amt?${queryParams}`)
  }
  getSalBonus(plant_Code: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/sal_bonus?${queryParams}`)
  }
  getPayscleMaster_combine(plant_Code: string, userEmpcode: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    const queryParams1 = new URLSearchParams({ userEmpcode }).toString();
    return this.http.get(`${this.url}/salary/Payscale_mst_new_combine?${queryParams}&${queryParams1}`)
  }
  getPayscleMaster(userEmpcode: any) {
    const queryParams = new URLSearchParams({ userEmpcode }).toString();
    return this.http.get(`${this.url}/salary/Payscale_mst_new?${queryParams}`)
  }


  addWagemaster(data: any) {
    return this.http.post<any>(`${this.url}/salary/add_Salry`, data);

  }
  reviseWagemaster(data: any) {
    return this.http.post<any>(`${this.url}/salary/revise_Salry`, data);

  }


  getWageMst(plant_Code: any, userEmpcode: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    const queryParams1 = new URLSearchParams({ userEmpcode }).toString();
    return this.http.get(`${this.url}/salary/view_sal?${queryParams}&${queryParams1}`)
  }
  getWageApprMst(plant_Code: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/appr_list?${queryParams}`)
  }
  getDeptMst(Plant_code: any) {
    const queryParams = new URLSearchParams({ Plant_code }).toString();
    return this.http.get(`${this.url}/salary/getDept?${queryParams}`)
  }
  getEmp_Sal_Master(plant_Code: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/emp_Sal_Master?${queryParams}`)
  }
  getpayrollDates(plant_Code: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/getPayrollForOnrTime?${queryParams}`)
  }
  getOneTimeSal(plant_Code: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.get(`${this.url}/salary/getonetimeSal?${queryParams}`)
  }
  VerifyOTD_and_OTE(plant_Code: any, data: any) {
    const queryParams = new URLSearchParams({ plant_Code }).toString();
    return this.http.post(`${this.url}/salary/VerifyOTDE?${queryParams}`, data)
  }


  NewPayscaleHeader(data: any, created_by: any) {
    // console.log(data);
    const queryParams = new URLSearchParams({ created_by }).toString();
    return this.http.post(`${this.url}/salary/new_PayscaleHead?${queryParams}`, data)

  }
  updatePayscaleHeader(data: any, created_by: any) {
    // console.log(data);
    const queryParams = new URLSearchParams({ created_by }).toString();
    return this.http.post(`${this.url}/salary/update_PayscaleHead?${queryParams}`, data)

  }
  deletePayscaleHeader(data: any, created_by: any) {
    // console.log(data);
    const queryParams = new URLSearchParams({ created_by }).toString();
    return this.http.post(`${this.url}/salary/delete_PayscaleHead?${queryParams}`, data)

  }

  oneTimeSalary(data: any) {
    // console.log(data)
    return this.http.post<any>(`${this.url}/salary/otn_Salry`, data);
  }
  clSalReports(data: any) {
    return this.http.get(
      this.url + `/salary/Salreports?type=${data.type}&plant=${data.plant}&from=${data.from}&to=${data.to}&cont=${data.cont} `);
  }

  approveOneTimeSal(data: any) {
    return this.http.post<any>(`${this.url}/salary/approve_otn_Salry`, data);
  }
  rejectOneTimeSal(data: any) {
    return this.http.post<any>(`${this.url}/salary/reject_otn_Salry`, data);
  }



  getSalaryDetails(Sal_Id: any) {
    const queryParams = new URLSearchParams({ Sal_Id }).toString();
    return this.http.get(`${this.url}/salary/sal_details?${queryParams}`)
  }

  approve_NoT_Edited_Salary(data: any) {
    return this.http.put<any>(`${this.url}/salary/11appr_sal`, data);
  }
  approve_Edited_Salary(data: any, user: any) {
    return this.http.put<any>(`${this.url}/salary/appr_sal?user=${user}`, data);
  }
  rework_Emp_Salary(data: any) {
    return this.http.put<any>(`${this.url}/salary/rewrk_sal`, data);
  }
  approve_Bulk_Salary(data: any, user: any) {
    return this.http.post<any>(`${this.url}/salary/appr_Bulk_sal?user=${user}`, data);
  }



  update_Salary(data: any) {
    return this.http.put<any>(`${this.url}/salary/Updt_sal`, data);
  }

  get_wageList_For_Revise(Plant_code: any) {
    const queryParams = new URLSearchParams({ Plant_code }).toString();
    return this.http.get(`${this.url}/salary/wage_list?${queryParams}`)
  }

  get_Non_Sap() {
    return this.http.get(this.url + '/salary/non_Sap')
  }

  verify_Revise_salary(data: any) {
    console.log(data)
    return this.http.post<any>(`${this.url}/salary/vrfy_sal`, data);
  }
  bulk_Revise_Insert(data: any) {
    return this.http.post<any>(`${this.url}/salary/bulk_sal`, data);
  }

  transfer_post(fromDate: any, ToDate: any) {

    return this.http.put(`${this.url}/clam/trn_post_data?from_Date=${fromDate}&to_date=${ToDate}`, '')
  }

  get_FactHoliday_data() {
    return this.http.get(this.url + '/master/getFactHoliday')
  }

  updt_Fct_Holiday(data: any, user: any) {
    return this.http.put(`${this.url}/master/updtFactHoliday?User=${user}`, data)
  }
  add_Fct_Holiday(data: any, user: any) {
    return this.http.post(`${this.url}/master/addFactHoliday?User=${user}`, data)
  }
  del_Fct_Holiday(data: any, user: any) {
    return this.http.put(`${this.url}/master/delFactHoliday?User=${user}`, data)
  }


  get_Alt_Holiday_data() {
    return this.http.get(this.url + '/master/getAltHoliday')
  }
  updt_Alt_Holiday(data: any, user: any) {
    return this.http.put(`${this.url}/master/updtAltHoliday?User=${user}`, data)
  }
  add_Alt_Holiday(data: any, user: any) {
    console.log(data, user)
    return this.http.post(`${this.url}/master/addAltHoliday?User=${user}`, data)
  }
  del_Alt_Holiday(data: any, user: any) {
    return this.http.put(`${this.url}/master/delAltHoliday?User=${user}`, data)
  }



  get_Bill_date() {
    return this.http.get(this.url + '/master/getBillProcess')
  }
  updt_Bill_date(data: any, user: any) {
    return this.http.put(`${this.url}/master/updtBillProcess?User=${user}`, data)
  }
  add_Bill_date(data: any, user: any) {
    console.log(data, user)
    return this.http.post(`${this.url}/master/addBillProcess?User=${user}`, data)
  }
  del_Bill_date(data: any) {
    console.log(data)
    return this.http.post(`${this.url}/master/delBillProcess?lock_month=${data.lock_month}&plant_Code=${data.plant_Code}&category=${data.category}&payrollArea=${data?.PayrollArea}`, data)

    // return this.http.post(url);
  }

  Lock_Salary(data: any, user: any) {
    console.log(data, user)
    return this.http.post(`${this.url}/master/LockSalary?User=${user}`, data)
  }


  getFilteredData(data: any) {
    console.log(data)
    return this.http.post(`${this.url}/clam/empRec`, data)

  }





  getOperatorOD(genId: any, date: any, plant: any) {
    // console.log(`${this.url}/clam/optrOd1?genid=${genId}&date=${date}&plant=${plant}`)
    return this.http.get(`${this.url}/optr/optrOd1?genid=${genId}&date=${date}&plant=${plant}`)
  }


  applyoptrOD(data: any) {
    // console.log(data,`${this.url}/clam/optrapply`)
    return this.http.post(`${this.url}/optr/optrapply`, data)
  }



  getMstPermission(plant: any) {
    // console.log("mst_permission")
    return this.http.get(`${this.url}/optr/mst_perms?plant=${plant}`)
  }


  // getOperatorPermission(plant:any,genId:any,attn_date:any){
  //   return this.http.get(`${this.url}/optr/mst_perms?plant=${plant}&genid=${genId}&date=${attn_date}`)
  // }

  verifyOptrPermission(genId: any, date: any, plant: any) {
    // console.log(`${this.url}/clam/optrOd1?genid=${genId}&date=${date}&plant=${plant}`)
    return this.http.get(`${this.url}/optr/verify_Permission?genid=${genId}&date=${date}&plant=${plant}`)
  }

  submitOptrPermission(data: any) {
    // console.log('hai sudmit od',data)
    return this.http.post(`${this.url}/optr/optrPerApply`, data)
  }
  sec_permission(data: any) {
    // console.log('hai sudmit od',data)
    return this.http.post(`${this.url}/optr/2ndPermission`, data)
  }

  get_optr_permission_data(plant: any, empl_slNo: any, ishrappr: any) {
    return this.http.get(`${this.url}/optr/perm_list?plant=${plant}&empl_slNo=${empl_slNo}&ishrappr=${ishrappr}`)
  }
  get_optr_Mid_permission_data(plant: any, empl_slNo: any) {
    return this.http.get(`${this.url}/optr/Mid_perm_list?plant=${plant}&empl_slNo=${empl_slNo}`)
  }
  get_optr_leave_data(plant: any, empl_slNo: any, ishrappr: any) {
    return this.http.get(`${this.url}/optr/leave_list?plant=${plant}&empl_slNo=${empl_slNo}&ishrappr=${ishrappr}`)
  }


  getTrnPermission(gen_id: any) {
    return this.http.get(`${this.url}/optr/emp_perm_list?gen_id=${gen_id}`)
  }

  getTrnLeave(gen_id: any) {
    return this.http.get(`${this.url}/optr/emp_leave_list?gen_id=${gen_id}`)
  }
  /** hr applied record api #NEW
   * @param data
   */
  getHrAppliedLeaveRecord(data:any){
    return this.http.get(this.url + `/report/trn_leave_details?companyCode=${data?.companyCode}&plantCode=${data?.plantCode}&payrollArea=${data?.payrollArea}&startDate=${data?.startDate}&endDate=${data?.endDate}&genId=${data?.genId}`)
  }
  /**  
   * get HR applied LOP records #NEW
   * @param data
  */
 getHrAppliedLopRecord(data:any){
   return this.http.get(this.url + `/report/manual_lop_details?companyCode=${data?.companyCode}&plantCode=${data?.plantCode}&payrollArea=${data?.payrollArea}&startDate=${data?.startDate}&endDate=${data?.endDate}&genId=${data?.genId}`)
 }
  l1_approver(data: any, empl_slNo: any) {
    // console.log(data)
    // console.log(`${this.url}/optr/l1_approve`)
    return this.http.post(`${this.url}/optr/l1_approve?empl_slNo=${empl_slNo}`, data)
  }
  l2_approver(data: any) {
    // console.log(data)
    return this.http.post(`${this.url}/optr/l2_approve`, data)
  }

  permission_Cancel(data: any) {
    return this.http.post(`${this.url}/optr/permission_cncl`, data)
  }
  l1_Leave_approver(data: any, empl_slNo: any) {
    // console.log(data)
    // console.log(`${this.url}/optr/l1_approve`)
    return this.http.post(`${this.url}/optr/l1_Leave_appr?empl_slNo=${empl_slNo}`, data)
  }
  l2_Leave_approver(data: any) {
    // console.log(data)
    return this.http.post(`${this.url}/optr/l2_Leave_appr`, data)
  }
  l2_Leave_approver_Selected(data: any) {
    // console.log(data)
    return this.http.post(`${this.url}/optr/l2_Leave_appr_slctd`, data)
  }

  reject_optr_Leave(data: any) {
    // console.log(data)
    return this.http.post(`${this.url}/optr/rejct_leave`, data)
  }

  get_Mst_Leave(plant: any) {
    return this.http.get(`${this.url}/master/get_mst_leave?plant=${plant}`)
  }
  verify_leave_Mst(data: any) {
    return this.http.post(`${this.url}/master/vrfy_mst_leave`, data)
  }


  submit_leave_mst(data: any) {
    console.log(data)
    return this.http.post(`${this.url}/master/submit_mst_leave`, data)
  }
  update_bulk_leave_mst(data: any) {
    return this.http.put(`${this.url}/master/updt_blk_mst_leave`, data)
  }
  update_leave_mst(data: any) {
    return this.http.put(`${this.url}/master/updt_mst_leave`, data)
  }

  get_leave_details(gen_id: any, plant: any) {
    return this.http.get(`${this.url}/optr/get_leave_details?gen_id=${gen_id}&plant=${plant}`)
  }
  get_leave_elgibility(plant: any) {
    return this.http.get(`${this.url}/optr/get_leave_elibity?plant=${plant}`)
  }
  get_leave_blnc(cemp_id: any) {
    return this.http.get(`${this.url}/optr/get_leave_blnc?cemp_id=${cemp_id}`)
  }
  /** 
   * hr leave apply api
   * @param {*} data
   *  */
  applyTraineeLeaveByHR(data:any){
    return this.http.post(this.url + '/optr/HR_leave_apply',data)
  }
  // submit_optr_leave(data:any){
  //   return this.http.post(`${this.url}/optr/New_optr_leave`,data) 
  // }
  submit_optr_leave(data: any) {
    return this.http.post(`${this.url}/optr/submit_optr_leave1`, data)
  }


  leave_Cancel(data: any) {
    return this.http.post(`${this.url}/optr/leave_cncl`, data)
  }



  getCanteenRpt(data: any) {
    // console.log(data)
    return this.http.post(`${this.url}/clam/cntrpt`, data)

  }

  get_Coff_emp_list(emp_slno: any) {
    return this.http.get(`${this.url}/optr/Optr_Coff_list?emp_slno=${emp_slno}`)
  }
  get_Coff_optr_list(emp_slno: any) {
    return this.http.get(`${this.url}/optr/Optr_Coff_status?emp_slno=${emp_slno}`)
  }

  reject_optr_Coff(data: any) {
    // console.log(data)
    return this.http.post(`${this.url}/optr/Optr_coff_rejct`, data)
  }



  l1_coff_approve(data: any) {
    return this.http.post(`${this.url}/optr/Optr_coff_approve`, data)
  }



  cancel_Optr_Coff(data: any) {
    return this.http.post(`${this.url}/optr/Optr_coff_cancel`, data)
  }


  shiftChangedetails(data: any) {
    console.log(data);
    return this.http.post(`${this.url}/CLAM/Shift_Chng_Vrfy`, data)


  }
  shiftChangeProcess(data: any) {
    console.log(data);
    return this.http.post(`${this.url}/CLAM/Shift_Chng_Prs`, data)

  }
  mid_permission(data: any) {
    console.log(data);
    return this.http.post(`${this.url}/CLAM/mid_permission`, data)

  }
  mid_Userdetails(gen_id: any, plant: any) {

    return this.http.get(`${this.url}/CLAM/per_dtls?gen_id=${gen_id}&plant=${plant}`)

  }
  getRoute(plant: any) {

    return this.http.get(`${this.url}/CLAM/get_route?plant=${plant}`)

  }
  get_Van_Details(plant: any) {

    return this.http.get(`${this.url}/CLAM/get_Van_Details?plant=${plant}`)

  }
  get_route_payroll(plant: any) {

    return this.http.get(`${this.url}/CLAM/get_route_payroll?plant=${plant}`)

  }
  get_Van_Delay_Regularization_Details(plant: any) {

    return this.http.get(`${this.url}/CLAM/get_Van_Delay_Regularization_Details?plant=${plant}`)

  }
  Van_Facility(data: any) {

    return this.http.post(`${this.url}/clam/Van_Maaping`, data)

  }
  delete_Van_Facility(data: any) {

    return this.http.put(`${this.url}/CLAM/delete_Van_Maaping`, data)

  }

  get_User_route_dtls(date: any, plant: any, route: any, Category: any) {
    return this.http.get(`${this.url}/CLAM/usr_route_dtls?date=${date}&plant=${plant}&route=${route}&Category=${Category}`)

  }

  Van_delay(data: any) {

    return this.http.post(`${this.url}/CLAM/Van_delay`, data)

  }


  add_new_route(plant: any, route: any, applied_by: any) {

    return this.http.post(`${this.url}/CLAM/new_route?plant=${plant}&route=${route}&applied_by=${applied_by}`, [])

  }
  edit_route(plant: any, route: any, slno: any) {

    return this.http.put(`${this.url}/CLAM/edit_route?plant=${plant}&route=${route}&slno=${slno}`, [])

  }
  delete_route(slno: any) {

    return this.http.put(`${this.url}/CLAM/delete_route?slno=${slno}`, [])

  }

  get_Indirect_dtls(plant: any, dept: any) {
    return this.http.get(`${this.url}/CLAM/get_indirect?plant=${plant}&dept=${dept}`)

  }
  get_indirect_headCount(plant: any, admin: any) {
    return this.http.get(`${this.url}/CLAM/get_indirect_headCount?plant=${plant}&admin=${admin}`)

  }
  update_Ind_HC(data: any, emp: any) {
    return this.http.post(`${this.url}/CLAM/update_Ind_HC?emp=${emp}`, data)

  }
  update_Single_HC(hc: any, HC_Id: any, emp: any) {
    return this.http.put(`${this.url}/CLAM/update_Single_HC?hc=${hc}&HC_Id=${HC_Id}&emp=${emp}`, '')

  }
  delete_Single_HC(HC_Id: any, emp: any) {
    return this.http.put(`${this.url}/CLAM/delete_Indirect_HC?HC_Id=${HC_Id}&emp=${emp}`, '')

  }

  getPlantForEmpRep () {
    return this.http.get(`${this.url}/clam/plantFor_Report`)
  }


}