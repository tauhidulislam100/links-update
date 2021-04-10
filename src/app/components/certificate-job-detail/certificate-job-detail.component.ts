import {Component, OnInit} from '@angular/core';
import {CertificateService} from '../../_services/certificate.service';
import {ActivatedRoute} from '@angular/router';
import {ErrorService} from 'src/app/_services/error.service';
import {ConfigService} from 'src/app/_services/config.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-certificate-job-detail',
  templateUrl: './certificate-job-detail.component.html',
  styleUrls: ['./certificate-job-detail.component.css']
})
export class CertificateJobDetailComponent implements OnInit {

  assets_loc;
  jobId;
  id;
  details;
  loader = false;
  isSubmitted = false;
  comment = "Purpose of job"

  constructor(private certificateService: CertificateService, private route: ActivatedRoute, private configService: ConfigService, private errorService: ErrorService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.details = this.route.snapshot.data.detail;
    this.route.params.subscribe(params => this.jobId = params.id);

  }

  downloadCertificates() {

    this.loader = true;
    this.certificateService.downloadCertificate(this.jobId).subscribe((res) => {
      this.loader = false;
      const now = Date.now();
      const myFormattedDate = formatDate(now, 'MM/dd/yyyy', 'en-US');
      saveAs(res, `${this.jobId}_${this.details[0].certificateTemplateDetail.name}_${myFormattedDate}_certificates.zip`);
      this.errorService.setErrorVisibility(false, "");
    }, error => {

      this.loader = false;

    });
  }

  publishCertificates() {
    this.isSubmitted = false;
    let data = {
      "comment": this.comment
    }
    this.certificateService.publishCertificate(this.jobId, data).subscribe(
      data => {

        this.isSubmitted = true;
        this.errorService.setErrorVisibility(false, "");
      },
      error => {

      });
  }

  releaseCertificates() {
    this.isSubmitted = false;
    let data = {
      "comment": this.comment
    }
    this.certificateService.releaseCertificate(this.jobId, data).subscribe(data => {

        this.isSubmitted = true;
        this.errorService.setErrorVisibility(false, "");
    
      },
      error => {

      });

  }

  regenerateCertificates() {
    let data = {
      "comment": this.comment
    }
    this.isSubmitted = false;
    this.certificateService.regenerateCertificate(this.jobId, data).subscribe(data => {

        this.isSubmitted = true;
        this.errorService.setErrorVisibility(false, "");

      },
      error => {

      });

  }

  validateOnServer() {
    this.isSubmitted = false;
    this.certificateService.validateCertificatesOnServer(this.jobId).subscribe(data => {
        this.isSubmitted = true;
        this.errorService.setErrorVisibility(false, "");
      },
      error => {
      });

  }


}
