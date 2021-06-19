import { Component, OnInit, OnDestroy, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {first} from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ErrorService } from 'src/app/_services/error.service';
import { hasErrorMessage } from 'src/app/utils/hasErrorMessage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  step: 'login' | 'otp' = 'login';
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  returnUrl: string;
  countDownTime: number; //secs
  showLoader = true;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    otp: new FormGroup({
      'input1': new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      'input2': new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      'input3': new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      'input4': new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      'input5': new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      'input6': new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
    })
  });

  @ViewChildren('formRow') rows: any;
  
  constructor(
    private authenticationService: AuthenticationService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private errorService: ErrorService
    ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    let timerId = setTimeout(() => {
      this.showLoader = false;
      clearTimeout(timerId);
    }, 1000);

    document.body.classList.add('bg-white');
  }

  handleChange() {
    this.step = 'login';
  }

  keyUpEvent(event, index) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1 ;
    } else {
      pos = index + 1 ;
    }
    if (pos > -1 && pos < this.formInput.length ) {
      console.log("position ", pos);
      this.rows._results[pos].nativeElement.focus();
    }
  }

  handleSubmit() {
    let email = this.loginForm.get('email').value;

    if(!email) return;
    
    if(this.step === 'login' && this.loginForm.get('email').invalid) {
      return this.errorService.setErrorVisibility(true, "invalid email address");
    } else if(this.step === 'login' && this.loginForm.get('email').valid) {
      this.errorService.setErrorVisibility(false, "");
      return this.getOtp(email);
    }

    if(this.step === 'otp' && this.loginForm.get('otp').invalid) {
      return this.errorService.setErrorVisibility(true,"invalid otp provided");
    }

    this.errorService.setErrorVisibility(false, "");
    const otpObj = this.loginForm.get('otp').value;
    let otp = Object.keys(otpObj).map(k => otpObj[k]).join('');

    this.login(email, otp);

  }


  getOtp(email) {
    this.authenticationService.getOtp(email).subscribe(data => {
      this.startTimer();
      this.step = 'otp';
      }, err => {
        if(err.status === 403) {
          this.errorService.setErrorVisibility(true, hasErrorMessage(err) ? hasErrorMessage(err) : "Unautorized access forbiden, please ensure you have an active account");
        } else {
          this.errorService.setErrorVisibility(true, hasErrorMessage(err) ? hasErrorMessage(err) : "something went wrong");
        }
      }
    );
  }

  login(email, otp) {
    this.authenticationService.login("Admin", email, otp)
      .pipe(first()
      )
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        }, err => {
          if(err.status === 403) {
            this.errorService.setErrorVisibility(true, hasErrorMessage(err) ? hasErrorMessage(err) : "Unautorized access forbiden, please ensure you have an active account");
          } else {
            this.errorService.setErrorVisibility(true, hasErrorMessage(err) ? hasErrorMessage(err) : "something went wrong, please try again later");
          }
        });
  }

  resendOTP() {
    if(this.countDownTime <= 0) {
      this.getOtp(this.loginForm.get('email').value);
    }
  }

  startTimer() {
    this.countDownTime = 120;

    var interval = setInterval(() => {
      if(this.countDownTime <= 0) {
        clearInterval(interval);
      } else {
        this.countDownTime--;
      }
    },1000);
  }

  format(time) {
    // Hours, minutes and seconds
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    ret += "" + String(mins).padStart(2, '0') + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-white');
  }

}
