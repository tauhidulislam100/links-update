import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmailJobService } from 'src/app/_services/email-job.service';

export interface EmailJobType {
  body: string | null,
  created_at: string | null,
  deletedAt: string | null,
  deletedBy: string | null,
  emailJobRecipientList: [] | Record<string, any>[],
  emailTemplate: string | null,
  id: string | null,
  no_of_recipients: number | null,
  seen: number | null,
  status: string | null,
  subject: string | null,
  updatedAt: string | null,
  unsubscribed: number | null | string,
}

@Component({
  selector: 'app-unsubscribed',
  templateUrl: './unsubscribed.component.html',
  styleUrls: ['./unsubscribed.component.css']
})
export class UnsubscribedComponent implements OnInit {
  unsubscribedData: EmailJobType[] = [];
  constructor(private emailJobService: EmailJobService, private location: Location) { }

  ngOnInit() {
    this.getUNSubscribedList();
  }

  goBack() {
    this.location.back()
  }


  getUNSubscribedList() {
    this.emailJobService.getUNSubscribedJobs().subscribe(data => {
      this.unsubscribedData = data;
    })
  }

  subscribeAll() {
    this.emailJobService.subscribeAllJobs().subscribe(() => {
      this.getUNSubscribedList();
    });
  }

}
