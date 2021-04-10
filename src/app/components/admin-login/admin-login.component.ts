import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication.service';
import {first} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {NavbarService} from 'src/app/_services/navbar.service';
import {ErrorService} from 'src/app/_services/error.service';
import {ConfigService} from 'src/app/_services/config.service';


@Component({
  selector: 'app-user-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  userLoginForm: FormGroup;
  userOTPForm: FormGroup;
  userPasswordForm: FormGroup;
  showPasswordForm: boolean;
  returnUrl: string;
  otpGenerated: boolean;
  checkEmailAlert: boolean;
  checkOtp: boolean;
  assets_loc;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router, private nav: NavbarService, private errorService: ErrorService, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }


  ngOnInit() {
    this.nav.hide();

    this.showPasswordForm = false;
    this.otpGenerated = false;
    this.checkEmailAlert = false;
    this.checkOtp = false;
    this.authenticationService.logout();
    this.userLoginForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });

    this.userOTPForm = new FormGroup({
      digit_1: new FormControl('', [Validators.required, Validators.maxLength(1)]),
      digit_2: new FormControl('', [Validators.required, Validators.maxLength(1)]),
      digit_3: new FormControl('', [Validators.required, Validators.maxLength(1)]),
      digit_4: new FormControl('', [Validators.required, Validators.maxLength(1)]),
    });

    this.userPasswordForm = this.formBuilder.group({
      // email:   ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  userLoginSubmit() {
    if (this.userLoginForm.invalid) {
      return;
    }

    this.getOtp();

  }

  handlePasswordSubmit() {
    //  console.log(this.userPasswordForm);
    if (this.userLoginForm.invalid || this.userPasswordForm.invalid) {
      return;
    }


    this.authenticationService.login("Admin", this.userLoginForm.controls.email.value, this.userPasswordForm.controls.password.value)
      .pipe(first()
      )
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          if (error.status === 403) {
            this.errorService.setErrorVisibility(false, "");
            this.otpGenerated = false;
            this.checkOtp = true;
          }
        });


  }

  getOtp() {
    this.authenticationService.getOtp(this.userLoginForm.controls.email.value).subscribe(data => {

        this.otpGenerated = true;
        this.checkEmailAlert = false;
        this.showPasswordForm = true;
        this.errorService.setErrorVisibility(false, "");
      }, err => {
        if (err.status == 403) {
          this.errorService.setErrorVisibility(false, "");
          this.otpGenerated = false;
          this.checkEmailAlert = true;
          this.showPasswordForm = false;
        }

      }
    );
  }

}
