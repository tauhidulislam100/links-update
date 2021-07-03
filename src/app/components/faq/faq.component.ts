import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfigService} from 'src/app/_services/config.service';
import {AdminDetailService} from "../../_services/admin-detail.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  assets_loc;
  ticketForm: FormGroup;
  requestRaised = false;
  isSubmitted = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private configService: ConfigService, private adminService: AdminDetailService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }


  ngOnInit() {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      detail: ['', Validators.required]
    });

    if (this.route.snapshot.paramMap.get('title') != null) {
      this.ticketForm.get('title').setValue(this.route.snapshot.paramMap.get('title'));
    }
  }

  send() {
    if (!this.ticketForm.invalid) {
      let title = this.ticketForm.get('title').value;
      let detail = this.ticketForm.get('detail').value;
      let data = {
        subject: title,
        body: detail
      }
      this.adminService.raiseTicket(data).subscribe(data => {
          this.isSubmitted = true;
        },
        error => {
          this.isSubmitted = false;
        })

    }
  }

}
