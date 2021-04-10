// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { AuthenticationService } from '../../_services/authentication.service';
// import { first, map, catchError } from 'rxjs/operators';
// import { Router, ActivatedRoute } from '@angular/router';
// import { environment } from 'src/environments/environment';
// import { NavbarService } from 'src/app/_services/navbar.service';
//
//
// @Component({
//   selector: 'app-user-login',
//   templateUrl: './user-login.component.html',
//   styleUrls: ['./user-login.component.css']
// })
// export class UserLoginComponent implements OnInit {
//   userLoginForm: FormGroup;
//   userOTPForm: FormGroup;
//   userPasswordForm: FormGroup;
//   showPasswordForm: boolean;
//   returnUrl: string;
//   otpGenerated: boolean;
//   checkEmailAlert:boolean;
//   checkOtp:boolean;
//   assets_loc;
//   constructor(private formBuilder: FormBuilder,private authenticationService: AuthenticationService,private route: ActivatedRoute, private router: Router, private nav : NavbarService) { }
//
//   ngOnInit() {
//     this.nav.hide();
//     this.assets_loc = environment.assets_location;
//     this.showPasswordForm = false;
//     this.otpGenerated = false;
//     this.checkEmailAlert = false;
//     this.checkOtp = false;
//     this.authenticationService.logout();
//     this.userLoginForm = this.formBuilder.group({
//       email: ['', [Validators.required]]
//     });
//
//     this.userOTPForm = new FormGroup({
//       digit_1: new FormControl('', [Validators.required, Validators.maxLength(1)]),
//       digit_2: new FormControl('', [Validators.required, Validators.maxLength(1)]),
//       digit_3: new FormControl('', [Validators.required, Validators.maxLength(1)]),
//       digit_4: new FormControl('', [Validators.required, Validators.maxLength(1)]),
//     });
//
//     this.userPasswordForm = this.formBuilder.group({
//       // email:   ['', [Validators.required]],
//       password: ['', [Validators.required]]
//     });
//     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
//   }
//
//
//
//   userLoginSubmit() {
//     if(this.userLoginForm.invalid)
//     {
//       return;
//     }
//
//     this.getOtp();
//
//   }
//
//   handlePasswordSubmit() {
//   //  console.log(this.userPasswordForm);
//   if (this.userLoginForm.invalid || this.userPasswordForm.invalid ) {
//     return;
//   }
//
//
//   this.authenticationService.login("Admin", this.userLoginForm.controls.email.value, this.userPasswordForm.controls.password.value)
//     .pipe(first()
//     )
//     .subscribe(
//       data => {
//         this.router.navigate([this.returnUrl]);
//       },
//       error => {
//         if (error.status === 403) {
//           // window.alert("Please Check UserName And Password!")
//           this.otpGenerated = false;
//           this.checkOtp = true;
//
//         }
//
//       });
//
//
//   }
//
//   getOtp(){
//      this.authenticationService.getOtp(this.userLoginForm.controls.email.value).subscribe( data => {
//
//     this.otpGenerated = true;
//     this.checkEmailAlert = false;
//     this.showPasswordForm = true;
//      }
//      ,
//       error => {
//         if (error.status === 403) {
//           this.checkEmailAlert = true;
//           this.otpGenerated = false;
//           this.checkOtp = false;
//           // window.alert("Please Check Email!")
//         }
//
//       });
//   }
//
// }
