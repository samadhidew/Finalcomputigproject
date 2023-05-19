import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-shopmore',
  templateUrl: './shopmore.component.html',
  styleUrls: ['./shopmore.component.css']
})
export class ShopmoreComponent implements OnInit{
  TimeSlots: any = environment.time.timeslots;
  total: number=0
  sport: string = environment.sport
  date: string = environment.date
  username: string = environment.user.username
  phone: string = environment.user.phoneNO
  email: string = environment.user.email

  title = 'testproj';
  paymentHandler: any = null;

  constructor(
    private rouite:ActivatedRoute,private http: HttpClient,private router: Router
  ) {

  }

  ngOnInit(): void {
    console.log("timeslot in payment details", this.TimeSlots);
    this.invokeStripe();
    for (let i = 0; i < this.TimeSlots.length; i++) {
      if (this.TimeSlots[i].userId == this.username && this.TimeSlots[i].status == 1) {
        this.total++;
      }
    }
  }

  onSubmitting() {
    for (let i = 0; i < this.TimeSlots.length; i++) {
      if (this.TimeSlots[i].userId == this.username && this.TimeSlots[i].status == 1) {
        this.TimeSlots[i].status = 2;
      }
    }
    console.log("sport time", this.TimeSlots);
    environment.time.timeslots = this.TimeSlots;
    console.log(environment.time);
    let bodyData = {
      "timeslots": this.TimeSlots
    };
    console.log("***time", environment.time);
    // @ts-ignore
    if(environment.already){
      // @ts-ignore
      this.http.post(`http://localhost:8800/api/time/${environment.time[0]._id}/updatetime`, bodyData).subscribe((resultData: any) => {
        console.log("update array", resultData);
      });
    }else {
      // @ts-ignore
      this.http.post(`http://localhost:8800/api/time/${environment.time._id}/updatetime`, bodyData).subscribe((resultData: any) => {
        console.log("update array", resultData);
      });
    }

  }

  async makePayment(amount: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51My4WoSGvsBHaF5KKr7IZDByGB5wNEFiv3Baz4ZdtwUBOaQmLZheD5ojrAIi3BR9G4CgQUTQpEJOFKVVvvlDcubm007M3dL5Ym',
      locale: 'auto'
    });

    const result = await new Promise<any>((resolve) => {
      paymentHandler.open({
        name: 'Austasia Sports',
        description: this.total + '  Timeslots Added',
        amount: amount * 100,
        token: (stripeToken: any) => {
          console.log(stripeToken.card);
          alert('Transaction Successful.');
          resolve(true);
        },
        closed: () => {
          resolve(false);
        }
      });
    });

    if (result) {
      this.onSubmitting();
    }
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(script);
    }
  }
}
