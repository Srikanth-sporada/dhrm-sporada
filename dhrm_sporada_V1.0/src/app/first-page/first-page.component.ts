import { Component, OnInit } from "@angular/core";
import { newsImages } from "../imageList";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-first-page",
  templateUrl: "./first-page.component.html",
  styleUrls: ["./first-page.component.css"],
})
export class FirstPageComponent implements OnInit {
  /** company & plant code from ng route  */
  companyCode:any;
  plantCode:any;
  gradients = [
    "linear-gradient(135deg, rgb(232, 200, 230) 0%, rgb(232, 200, 230) 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, rgb(166, 229, 229) 0%, rgb(166, 229, 229) 100%)",
    "linear-gradient(135deg, rgb(166, 219, 185) 0%, rgb(166, 219, 185) 100%)",
    "linear-gradient(135deg, rgb(248, 209, 158) 0%, rgb(248, 209, 158) 100%)",
  ];

  boxLabels: {
    label: string;
    link: string;
    image: string;
    sessionKey?: string;
    style?: any;
  }[] = [
    {
      label: "Trainee New Application",
      link: "/trainee-application",
      image: "assets/New Job.jpeg",
      style: { marginBottom: "8px", Colors: "black" },
    },
    {
      label: "Trainee Test Login (BODHI)",
      link: "/trainee-login",
      image: "assets/Test.jpeg",
      style: { marginBottom: "8px" },
    },
    {
      label: "Trainer Login (BODHI)",
      link: "/rhrm/login",
      image: "assets/trainer.jpeg",
      sessionKey: "emp",
      style: { marginBottom: "8px" },
    },
    {
      label: "Trainee Login",
      link: "/rhrm/ars-login",
      image: "assets/Workmen.jpeg",
      sessionKey: "trainee",
    },
    {
      label: "Executive Login",
      link: "/rhrm/login",
      image: "assets/Executive.jpeg",
      sessionKey: "emp",
    },
  ];

  imageStyles = [
    { width: "160px", height: "140px", objectFit: "cover", marginTop: "8px" },
    { width: "160px", height: "140px", objectFit: "cover", marginTop: "8px" },
    { width: "160px", height: "140px", objectFit: "cover", marginTop: "8px" },
    { width: "160px", height: "140px", objectFit: "cover", marginTop: "8px" },
    { width: "160px", height: "140px", objectFit: "cover", marginTop: "8px" },
  ];

  constructor(private route:ActivatedRoute) {
    /** converting string into number */
    this.companyCode = this.route.snapshot.paramMap.get('companyCode');
    this.plantCode = this.route.snapshot.paramMap.get('plantCode');
    console.log('company Code:', this.companyCode , 'Plant Code:' , this.plantCode);
    sessionStorage.clear();
  }

  ngOnInit(): void {
    this.news = newsImages;
  }

  setSession(key: string): void {
    sessionStorage.setItem("user", key);
  }

  // version 2

  // user logins
  // default selected user
  selectedUser: string = "trainee-application";
  users = [
    { user: "Trainee New Application",value:"trainee-application" },
    { user: "Trainee Test Login (DOJO)", value:"trainee-test-login" },
    { user: "Trainer Login (DOJO)", value:"trainer-login" },
    { user: "Trainee Login", value:"workmen-login" },
    { user: "Executive Login",value:"executive-login" },
    { user: "CL Labour / CL-Piece Rate",value:"cl-new-onboard" },
  ];

  news = [
    {image:"assets/news.jpg",alt:"rane-news"},
    {image:"assets/news.jpg",alt:"rane-news"},
    {image:"assets/news.jpg",alt:"rane-news"},
    {image:"assets/news.jpg",alt:"rane-news"},
    {image:"assets/news.jpg",alt:"rane-news"}
  ]
}