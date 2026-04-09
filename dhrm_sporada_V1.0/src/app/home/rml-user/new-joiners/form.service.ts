import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  bank: any;
  basic : any;
  edu : any;
  emer : any;
  fam : any;
  lang : any;
  other : any;
  prev : any;
  idforfilename:any
  filterinfo:any
  searchfilterinfo:any

  basicdetails :any = []
  education:any = []
  family:any = []
  career:any = []
  url = environment.path
  uniqueId: any
  filenames: any;
  ishr:any = []
  ishrappr:any = []
  banknames: any = []
  pincodes :any
  flag_submit_all: any = true
  category:any;
  mobile:any;
  cont_id:any;

  constructor(
    private http : HttpClient, 
    private active : ActivatedRoute,
    private messageService:MessageService)
  {
   }

validate_All()
{
  this.flag_submit_all = false
}

res:any;

submitbank(){
  console.log(this.bank)
  this.http.put(this.url+'/hrOperation/bankforms', this.bank)
  .subscribe({
      next: (response:any) => {
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'});
        }
        console.log(response);
        this.res = response.message
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      },
})
}

submitbasic(){
  console.log(this.basic)
  this.http.put(this.url+'/hrOperation/basicforms', this.basic)
  .subscribe({
     next: (response:any) => {
        console.log(response);
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'})
        }
      },
      error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      },
})
}

submitedu(){
  console.log(this.edu)
  this.http.put(this.url+'/hrOperation/edu', this.edu)
  .subscribe({
      next: (response:any) => {
        console.log(response);
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'})
        }
      },
      error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message})
      },
})
}


submitemer(){
  
  console.log(this.emer)
  this.http.put(this.url+'/hrOperation/emergency', this.emer)
  .subscribe({
      next: (response:any) => {
        console.log(response);
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'})
        }
      },
      error: (error) => {
        console.error('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      },
})
}

submitfamily(){
  console.log(this.edu)
  this.http.put(this.url+'/hrOperation/family', this.fam)
  .subscribe({
     next: (response:any) => {
        console.log(response);
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'})
        }
      },
      error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      },
})
}

submitother(){
  console.log(this.other)
  this.http.put(this.url+'/hrOperation/others', this.other)
  .subscribe({
      next: (response:any) => {
        console.log(response);
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'})
        }
      },
     error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      },
})
}

submitprev(){
  console.log(this.prev)
  this.http.put(this.url+'/hrOperation/prev', this.prev)
  .subscribe({
     next: (response:any) => {
        console.log(response);
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'})
        }
      },
     error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      },
})
}

sumbitlang(){
   this.http.put(this.url+'/hrOperation/lang', this.lang)
    .subscribe({
      next: (response:any) => {
        console.log(response);
        if(response?.message == 'failure'){
          this.messageService.add({severity:'error',summary:'Error Occured!'})
        }
      },
     error: (error) => {
        console.log('ERROR:',error);
        this.messageService.add({severity:'error',summary:error?.message});
      },
  })
}

getdatabasic(uniqueId:any){
  return this.http.get(this.url+'/hrOperation/getdatabasic?mobile='+uniqueId.mobile+'&company='+uniqueId.company)

}

getdataqualifn(uniqueId:any){
  return this.http.get(this.url+'/hrOperation/getdataqualfn?mobile='+uniqueId.mobile+'&company='+uniqueId.company)

}

getdatafamily(uniqueId:any){
  return this.http.get(this.url+'/hrOperation/getdatafamily?mobile='+uniqueId.mobile+'&company='+uniqueId.company)

}

getdatacareer(uniqueId:any){
  return this.http.get(this.url+'/hrOperation/getdatacareer?mobile='+uniqueId.mobile+'&company='+uniqueId.company)

}

fileupload(file:any,uniqueId:any,company:any, id_no :any, fileno:any){

  const formData = new FormData()
  var changedname = id_no
  var name = file.name
  name = name.split('.')
  var len = name.length

  formData.append("file",file, changedname +'.'+ file.name.split('.')[len-1] )
  formData.append("name", changedname +'.'+ file.name.split('.')[len-1])
  formData.append("mobile",uniqueId)
  formData.append("company", company)
  formData.append("fileno",fileno)

    this.http.post(this.url+'/image', formData).subscribe({
      next: (res:any) => {
        console.log(res);
        if(res?.status == 'error'){
          this.messageService.add({severity:'error',summary:res?.message});
        }else{
          this.messageService.add({severity:'info',summary:'File Uploaded!'});
        }
      },
      error: (err) => {
        console.error('ERROR:',err);
        this.messageService.add({severity:'error',summary:err.message})
      }
    })

}

/** 
 * genreate trainee id
 */
submitted(uniqueId: any){
  console.log("SUBMITTED API DATA:", uniqueId)
  this.http.put(this.url+'/hrOperation/submitted',uniqueId)
  .subscribe({
    next: (response:any) => { 
      console.log("HR SUBMITTED",response);
      if(response?.message == 'failure'){
        this.messageService.add({severity:'error',summary:'Error Occured!'});
      }
    },
    error: (error) => {
      console.error('SUBMITTED API ERROR:',error);
      this.messageService.add({severity:'error',summary:error?.message})
    }
  })
}

pending(uniqueId: any){
  console.log('SUBMITTED API DATA:',uniqueId);
  this.http.put(this.url+'/hrOperation/pending',uniqueId)
  .subscribe({
    next: (response:any) => { 
      console.log(response);
      if(response.message == 'failure'){
        this.messageService.add({severity:'error',summary:'Error Occured!'});
      }
    },
    error: (error) => {
      console.error('PENDING API ERROR:',error);
      this.messageService.add({severity:'error',summary:error?.message});
    },
  })
}

approved(uniqueId:any){
  console.log('APPROVED API DATA:',uniqueId);
  this.http.put(this.url+'/hrOperation/approved', uniqueId) .subscribe({
    next: (response:any) =>{ 
      console.log(response);
      if(response.message == 'failure'){
        this.messageService.add({severity:'error',summary:'Error Occured!'});
      }
    },
    error: (error) => {
      console.error('APPROVED API ERROR:',error);
      this.messageService.add({severity:'error',summary:error?.message});
    },
  })
}

rejected(uniqueId:any){
  console.log('REJECTED API DATA:',uniqueId);
  this.http.put(this.url+'/hrOperation/rejected', uniqueId)
  .subscribe({
    next: (response:any) => { 
      console.log(response);
      if(response.message == 'failure'){
        this.messageService.add({severity:'error',summary:'Error Occured!'});
      }
    },
    error: (error) => {
      console.error('REJECTED API ERROR:',error);
      this.messageService.add({severity:'error',summary:error?.message});
    },
  })
}

filter(form:any)
{
  return this.http.get(this.url+'/hrOperation/filter?status='+form.status+'&fromdate='+form.fromdate+'&todate='+form.todate+'&plantcode='+form.plantcode)
}

searchfilter(form:any)
{
  return this.http.post(this.url+'/hrOperation/searchfilter', form)

}

deleteTrainee(data: any) {
  return this.http.put(this.url+`/hrOperation/Delete_Trainee?Apln=${data}`, null)
}
getbanknames()
{
    return this.http.get(this.url+'/hrOperation/getbanknames')
}

getpincode(pincode:any)
{
    return  this.http.get(this.url+'/hrOperation/getpincode?pincode='+ pincode.pincode)
}


getCategories(){
  return this.http.get(this.url+'/hrOperation/getcategory')
}

checkcategory(category:any,mob:any){
  return this.http.get(this.url+`/hrOperation/checkcategory?cat=${category}&mob=${mob}`)
}

// extra param added payscale
submitCategory2(Bodhi_training: any, dept_Id: any, Role_id: any, line_id: any, payscale: any) {
  return this.http.post(this.url + `/hrOperation/submitCategory2`, {
    cat: this.category,
    mob: this.mobile,
    cont: this.cont_id,
    Bodhi_training: Bodhi_training,
    dept_Id: dept_Id,
    Role_id: Role_id,
    line_id: line_id ,
    payscale: payscale // new
  });
}

// submitCategory(Bodhi_training: any, dept_Id: any, Role_id: any) {
//   return this.http.post(this.url + `/hrOperation/submitCategory`, {
//     cat: this.category,
//     mob: this.mobile,
//     cont: this.cont_id,
//     Bodhi_training: Bodhi_training,
//     dept_Id: dept_Id,
//     Role_id: Role_id
//   });
// }

/** 
 * extra param added
 * check while integrating form.component.ts
 * */
submitCategory(
  Bodhi_training: any,
  dept_Id: any,
  Role_id: any,
  payscale: any // check while integrating form.component.ts
): Observable<HttpEvent<any>> {
  console.log("Submitting category with values:");
  console.log("Category:", this.category);
  console.log("Mobile:", this.mobile);
  console.log("Contractor ID:", this.cont_id);
  console.log("Bodhi_training:", Bodhi_training);
  console.log("Department ID:", dept_Id);
  console.log("Role ID:", Role_id);
  console.log("Payscale:", payscale);

  return this.http.post<any>(
    this.url + `/hrOperation/submitCategory`,
    {
      cat: this.category,
      mob: this.mobile,
      cont: this.cont_id,
      Bodhi_training,
      dept_Id,
      Role_id,
      payscale
    },
    {
      reportProgress: true,
      observe: 'events'
    }
  );
}

DojoTrainingProcess(trainingData:any){
  return this.http.post(this.url + '/hrOperation/submitCategory', trainingData);
}


submitCategory1(Bodhi_training:any,dept_Id:any,Role_id:any){
 return this.http.post(this.url+`/hrOperation/submitCategory1`,
  {
    cat:this.category,
    mob:this.mobile,
    cont:this.cont_id,
    Bodhi_training:Bodhi_training,
    dept_Id:dept_Id,
    Role_id:Role_id 
  })
 .subscribe( (reponse) =>{
  })
}

getContracts(mob:any){
  console.log(this.url+`/hrOperation/getContracts?mob=${this.mobile}`)
 return this.http.get(this.url+`/hrOperation/getContracts?mob=${mob}`)
}

getDepList(id:any){
  const queryParams = new URLSearchParams({ id }).toString();
  return this.http.get(`${this.url}/clam/getDepList?${queryParams}`)
  
}
get_Indirect_dtls(plant:any,dept:any){
  return this.http.get(`${this.url}/CLAM/get_indirect?plant=${plant}&dept=${dept}`)
  
}

getLineName(dept:any){
  return this.http.get(`${this.url}/master/getLineName?dept_slno=${dept}`)
  
}

  /** new API
   * @param cont_id
   */
  getContPayscale(cont_id: any) {
    const queryParams = new URLSearchParams({ cont_id }).toString();
    return this.http.get(`${this.url}/clam/get_Cont_Pay_Scale?${queryParams}`)

  }
  /** new API 
   * @param data
  */
  getSinglePayscale(data: any) {
    return this.http.post(`${this.url}/salary/SinglePay`, data)
  }

}