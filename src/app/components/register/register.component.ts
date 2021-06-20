import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {first} from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ErrorService } from 'src/app/_services/error.service';
import { hasErrorMessage } from 'src/app/utils/hasErrorMessage';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  icons = [];
  step = 1;
  showLoader = true;
  showError = false;
  message='';
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    designation: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    organization_name: new FormControl('', [
      Validators.required
    ]),
    official_email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    website: new FormControl('', [
      Validators.pattern('/^(http[s]?://){0,1}(www.){0,1}[a-zA-Z0-9.-]+.[a-zA-Z]{2,5}[.]{0,1}/')
    ]),
    city: new FormControl('', [
      Validators.required
    ]),
    phone: new FormControl('', [
      Validators.required
    ]),
  })
  constructor(
    private authService: AuthenticationService,
    private errorService: ErrorService,
    private router: Router
    ) { }

  ngOnInit() {
    let timerId = setTimeout(() => {
      this.showLoader = false;
      clearTimeout(timerId);
    }, 1000);
    document.body.classList.add('bg-white');
  }

  handleSubmit() {
    this.message='';
    if(this.step === 1 &&(
      this.registerForm.get('name').invalid ||
      this.registerForm.get('designation').invalid ||
      this.registerForm.get('email').invalid
      )) {
        console.log("invalid ", this.registerForm.value)
        this.showError = true;
        return;
      }

    if(this.step === 2 &&(
      this.registerForm.get('organization_name').invalid ||
      this.registerForm.get('official_email').invalid ||
      this.registerForm.get('website').invalid ||
      this.registerForm.get('city').invalid ||
      this.registerForm.get('phone').invalid
      )) {
        this.showError = true;
        return;
      }

      if(this.registerForm.valid) {
        this.showError = false;
        this.authService.register(this.registerForm.value)
        .subscribe(resp => {
          console.log("resp ", resp);
          // this.router.navigate(['/AdminLogin']);
          this.message='Request for registration is sent, please check your email for receipt confirmation';
        }, (err) => {
          this.message='';
          if(err.status === 403) {
            this.errorService.setErrorVisibility(true, hasErrorMessage(err) ? hasErrorMessage(err) : "Unautorized access forbiden, please ensure you have an active account");
          } else {
            this.errorService.setErrorVisibility(true, hasErrorMessage(err) ? hasErrorMessage(err) : "something went wrong");
          }
        })
        return;
      }

      this.showError = false;
      this.step = 2;
  }
  goNextStep() {
    if(this.step === 1 && this.registerForm.valid) {
      this.step += 1;
      return;
    }
  }

  goPrevStep() {
    if(this.step > 1) {
      this.step -= 1;
    }
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-white');
  }

}
