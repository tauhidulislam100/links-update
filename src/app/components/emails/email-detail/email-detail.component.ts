import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/_services/config.service';
import { EmailJobService } from '../../../_services/email-job.service';

@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.css']
})
export class EmailDetailComponent implements OnInit {
  assets_loc;
  details: Record<string, any>;
  id;

  constructor(private emailJobService: EmailJobService, private route: ActivatedRoute, private location: Location,  private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.emailJobService.getEmailsByJobId(params.id).subscribe(data => {
        this.details = data;
      })
    })
  }

  goBack() {
    this.location.back()
  }

}
