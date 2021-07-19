import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { CertificateService } from 'src/app/_services/certificate.service';

@Component({
  selector: 'app-add-certificate',
  templateUrl: './add-certificate.component.html',
  styleUrls: ['./add-certificate.component.css']
})
export class AddCertificateComponent implements OnInit {
  certificateForm = new FormGroup({
    'file': new FormControl(null, Validators.required),
    'certificate-name': new FormControl('', Validators.required),
    'email-template-name': new FormControl('', Validators.required),
    'description': new FormControl('', Validators.required),
  });
  message = '';
  success=undefined;
  constructor(private location: Location, private certificateService: CertificateService) {}

  ngOnInit() {
  }


  onFileChange(e) {
    const file = e.target.files[0];
    this.certificateForm.patchValue({
      'file': file,
    });
  }


  goBack() {
    this.location.back()
  }

  submitForm() {
    this.success = undefined;
    this.message = '';
    
    Object.keys(this.certificateForm.controls).forEach(key => {
      this.certificateForm.get(key).markAsTouched();
      this.certificateForm.get(key).markAsDirty();
    });

    if(this.certificateForm.valid) {
      const formData = new FormData();
      for(let key in this.certificateForm.controls) {
        formData.append(key, this.certificateForm.get(key).value);
      }
      this.certificateService.addNewCertificate(formData).subscribe((response) => {
        this.message = 'new certificate added successfully';
        this.success = true;
        console.log('response ', response);
      }, err => {
        this.message = 'unable to add this certificate, please try again';
        this.success = false;
        console.log('error ', err);
      });
    }
  }

}
