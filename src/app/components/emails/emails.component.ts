import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import {  Router } from '@angular/router';
import { Page } from 'src/app/pagination/page';
import { compare } from 'src/app/utils/sortCompare';
import { slideAnimation } from 'src/app/_animations/slideAnimation';
import { ConfigService } from 'src/app/_services/config.service';
import { CustomPaginationService } from 'src/app/_services/custom-pagination.service';
import { EmailService } from 'src/app/_services/email.service';
import { ErrorService } from 'src/app/_services/error.service';
import { SelectedTabService } from 'src/app/_services/selected-tab.service';
import { PageType } from 'src/app/_types';
import { EmailJobService } from '../../_services/email-job.service';
import { EmailJobType } from '../unsubscribed/unsubscribed.component';

export interface EmailTemplateType {
  name: string | null
  created_on: string | null,
  created_at: string | null,
  subject: string | null,
  email_templates: string | null,
  no_of_recipients: string | null,
  no_of_times_used: string | null,
  send_from: string | null,
  send_to: string | null,
  total_unsubscribed: number | null,
  unsubscribeOptionEnabled: boolean,
  id: number,
  body: string | null,
  assigned_to: null | string | Record<string, any>,
}

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.css'],
  animations: [slideAnimation],
  host: { '[@slideAnimation]': '' },
})
export class EmailsComponent implements OnInit {
  showArchive = true;
  sentEmailsPage: Page<PageType> = new Page();
  allTemplatesPage: Page<PageType> = new Page();
  allMappedTemplatesPage: Page<PageType> = new Page();
  emailTemplatesData: EmailTemplateType[] = [];
  sentEmailsData: EmailJobType[] = [];
  allMapedTemplatesData: EmailTemplateType[] = [];
  loader = false;
  assets_loc;
  isArchived;
  deletePopoverTitle = "Archive Template";
  deletePopoverMessage = "Please confirm archiving of template, once archived it cannot be unarchived."
  deletePopoverTitleJob = "Archive Task";
  deletePopoverMessageJob = "Please confirm archiving of task, once archived it cannot be unarchived."
  selectedTab = 0;
  compName = 'emails';

  constructor(
    private paginationService: CustomPaginationService,
    private emailJobService: EmailJobService,
    private router: Router, private errorService: ErrorService,
    private emailService: EmailService,
    private configService: ConfigService,
    private selectedTabService: SelectedTabService,
  ) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })

    this.selectedTab = this.selectedTabService.getTab(this.compName);
  }

  ngOnInit() {
    this.isArchived = false;
    this.emailJobService.showArchived = this.showArchive;
    this.emailJobService.getAllJobsPage(this.sentEmailsPage.pageable).subscribe(page => {
      this.sentEmailsPage = {...this.sentEmailsPage, ...page};
      this.sentEmailsData = page.content;
    });

    this.emailJobService.getTemplatesCreatedByAdminPage(this.allTemplatesPage.pageable).subscribe(page => {
      this.allTemplatesPage = {...this.allTemplatesPage, ...page};
      this.emailTemplatesData = page.content;
    });

    this.emailJobService.getEmailTemplatesPage(this.allMappedTemplatesPage.pageable).subscribe(page => {
      this.allMappedTemplatesPage =  {...this.allMappedTemplatesPage, ...page};
      this.allMapedTemplatesData = page.content;
    });
  }

  handleTabChange(e) {
    this.selectedTabService.setTab(this.compName, e.index);
  }

  archiveToggle() {
    this.emailJobService.showArchived = this.showArchive;
    this.getSentEmails();
    this.getAllMappedTemplates();
    this.getAllTemplates();
  }

  private getSentEmails(): void {
    this.emailJobService.getAllJobsPage(this.sentEmailsPage.pageable).subscribe(page => {
      this.sentEmailsPage = {...this.sentEmailsPage, ...page};
      this.sentEmailsData = page.content;
      console.log('page.content ', page.content)
    });
  }

  private getAllTemplates(): void {
    this.emailJobService.getTemplatesCreatedByAdminPage(this.allTemplatesPage.pageable).subscribe(page => {
      this.allTemplatesPage = {...this.allTemplatesPage, ...page};
      this.emailTemplatesData = page.content;
    });
  }

  private getAllMappedTemplates(): void {
    this.emailJobService.getEmailTemplatesPage(this.allMappedTemplatesPage.pageable).subscribe(page => {
      this.allMappedTemplatesPage =  {...this.allMappedTemplatesPage, ...page};
      this.allMapedTemplatesData = page.content;
    });
  }

  public getJobsNextPage(): void {
    this.sentEmailsPage.pageable = this.paginationService.getNextPage(this.sentEmailsPage);
    this.getSentEmails();
  }

  public getJobsPreviousPage(): void {
    this.sentEmailsPage.pageable = this.paginationService.getPreviousPage(this.sentEmailsPage);
    this.getSentEmails();
  }

  public getTemplatesNextPage(): void {
    this.allTemplatesPage.pageable = this.paginationService.getNextPage(this.allTemplatesPage);
    this.getAllTemplates();
  }

  public getTemplatesPreviousPage(): void {
    this.allTemplatesPage.pageable = this.paginationService.getPreviousPage(this.allTemplatesPage);
    this.getAllTemplates();
  }

  public getMappedTemplatesNextPage(): void {
    this.allMappedTemplatesPage.pageable = this.paginationService.getNextPage(this.allMappedTemplatesPage);
    this.getAllMappedTemplates();
  }

  public getMappedTemplatesPreviousPage(): void {
    this.allMappedTemplatesPage.pageable = this.paginationService.getPreviousPage(this.allMappedTemplatesPage);
    this.getAllMappedTemplates();
  }

  generateEmailTemplate() {
    this.router.navigate(['/Emails/AddTemplate']);
  }

  archive(row) {
    this.emailService.deleteEmailTemplate(row.id).subscribe(data => {
      this.isArchived = true;
      this.errorService.setErrorVisibility(false, "");
    }
    );
  }

  archiveEmailJob(row) {
    this.emailJobService.deleteEmailJob(row.id).subscribe(data => {
      this.isArchived = true;
      this.errorService.setErrorVisibility(false, "");
    }
    );
  }

  sortData(sort: Sort, source) {
    if (source === 'sent') {
      const data = this.sentEmailsData.slice();
      if (!sort.active || sort.direction === '') {
        return;
      }
      let sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'created_at': return compare(a.created_at, b.created_at, isAsc);
          case 'no_of_recipients': return compare(a.no_of_recipients, b.no_of_recipients, isAsc);
          case 'seen': return compare(a.seen, b.seen, isAsc);
          case 'unsubscribed': return compare(a.unsubscribed, b.unsubscribed, isAsc);
          default: return 0;
        }
      });

      this.sentEmailsData = sortedData;

    } else if (source === 'e-templates') {
      const data: any = this.allTemplatesPage.content.slice();
      if (!sort.active || sort.direction === '') {
        return;
      }

      let sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'created_at': return compare(a.created_at, b.created_at, isAsc);
          case 'no_of_times_used': return compare(a.no_of_times_used, b.no_of_times_used, isAsc);
          case 'no_of_recipients': return compare(a.no_of_recipients, b.no_of_recipients, isAsc);
          default: return 0;
        }
      });

      this.emailTemplatesData = sortedData;
    } else if (source === 'm-templates') {

      const data: any = this.allMappedTemplatesPage.content.slice();
      if (!sort.active || sort.direction === '') {
        return;
      }

      let sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'created_at': return compare(a.created_at, b.created_at, isAsc);
          case 'no_of_times_used': return compare(a.no_of_times_used, b.no_of_times_used, isAsc);
          case 'no_of_recipients': return compare(a.no_of_recipients, b.no_of_recipients, isAsc);
          default: return 0;
        }
      });
      this.allMapedTemplatesData = sortedData;
    }
  }

}
