import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { MessageService } from 'primeng/api';

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
        console.log(response);
         this.res = response.message},
      error: (error) => console.log(error),
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
      error: (error) => console.error(error),
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
      error: (error) => console.error(error),
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
      error: (error) => console.error(error),
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
      error: (error) => console.error(error),
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
      error: (error) => console.error(error),
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
      error: (error) => console.error(error),
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
      error: (error) => console.error(error),
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
      next: (res)=> {console.log(res);},
      error: (err)=>console.log(err)
    })

}

submitted(uniqueId: any){
  console.log("----------------------------", uniqueId)
  this.http.put(this.url+'/hrOperation/submitted',uniqueId)
  .subscribe({
    next: (response) => { 
      console.log("HR SUBMITTED",response);
    },
    error: (error) => {
      console.log(error);
    }
    ,
  })
}

pending(uniqueId: any){
  this.http.put(this.url+'/hrOperation/pending',uniqueId)
  .subscribe({
    next: (response) =>{ console.log(response);
    },
    error: (error) => console.log(error),
  })
}

approved(uniqueId:any){

  this.http.put(this.url+'/hrOperation/approved', uniqueId) .subscribe({
    next: (response) =>{ console.log(response);
    },
    error: (error) => console.log(error),
  })
}

rejected(uniqueId:any){
  console.log(this.uniqueId);

  this.http.put(this.url+'/hrOperation/rejected', uniqueId)
  .subscribe({
    next: (response) =>{ 
      console.log(response);
    },
    error: (error) => console.log(error),
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
    return  this.http.get(this.url+'/hrOperation/getpincode?pincode='+pincode.pincode)
}


getCategories(){
  return this.http.get(this.url+'/hrOperation/getcategory')
}

checkcategory(category:any,mob:any){
  return this.http.get(this.url+`/hrOperation/checkcategory?cat=${category}&mob=${mob}`)
}


submitCategory2(Bodhi_training: any, dept_Id: any, Role_id: any, line_id: any) {
  return this.http.post(this.url + `/hrOperation/submitCategory2`, {
    cat: this.category,
    mob: this.mobile,
    cont: this.cont_id,
    Bodhi_training: Bodhi_training,
    dept_Id: dept_Id,
    Role_id: Role_id,
    line_id: line_id 
  });
}

submitCategory(Bodhi_training: any, dept_Id: any, Role_id: any) {
  return this.http.post(this.url + `/hrOperation/submitCategory`, {
    cat: this.category,
    mob: this.mobile,
    cont: this.cont_id,
    Bodhi_training: Bodhi_training,
    dept_Id: dept_Id,
    Role_id: Role_id
  });
}
DojoTrainingProcess(trainingData:any){
  return this.http.post(this.url + '/hrOperation/submitCategory', trainingData);
}
//  .subscribe(reponse=>{
//   })
//}
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
}

