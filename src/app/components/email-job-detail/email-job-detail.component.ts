import {Component, OnInit} from '@angular/core';
import {EmailJobService} from '../../_services/email-job.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigService} from 'src/app/_services/config.service';

@Component({
  selector: 'app-email-job-detail',
  templateUrl: './email-job-detail.component.html',
  styleUrls: ['./email-job-detail.component.css']
})
export class EmailJobDetailComponent implements OnInit {
  assets_loc;
  details;
  id;

  constructor(private emailJobService: EmailJobService, private route: ActivatedRoute, private router: Router, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {

    this.details = this.route.snapshot.data.detail;

  }

}
