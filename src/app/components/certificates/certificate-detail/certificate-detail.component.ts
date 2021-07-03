import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../../_services/certificate.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/app/_services/error.service';
import { ConfigService } from 'src/app/_services/config.service';

@Component({
  selector: 'app-certificate-detail',
  templateUrl: './certificate-detail.component.html',
  styleUrls: ['./certificate-detail.component.css']
})
export class CertificateDetailComponent implements OnInit {
  assets_loc;
  jobId;
  id;
  details;
  loader = false;
  isSubmitted = false;
  comment = "Purpose of job"

  constructor(private certificateService: CertificateService, private route: ActivatedRoute, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobId = params.id;
      this.certificateService.getJobDetails(params.id).subscribe(data => {
        this.details = data;
      })
    });
  }
}
