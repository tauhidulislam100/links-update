import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/pagination/page';
import { compare } from 'src/app/utils/sortCompare';
import { slideUpAnimation } from 'src/app/_animations/slideUp';
import { ConfigService } from 'src/app/_services/config.service';
import { CustomPaginationService } from 'src/app/_services/custom-pagination.service';
import { EmailService } from 'src/app/_services/email.service';
import { ErrorService } from 'src/app/_services/error.service';
import { SelectedTabService } from 'src/app/_services/selected-tab.service';
import { PageType } from 'src/app/_types';
import { EmailJobService } from '../../_services/email-job.service';

@Component({
  selector: 'app-email-jobs',
  templateUrl: './email-jobs.component.html',
  styleUrls: ['./email-jobs.component.css'],
  animations: [slideUpAnimation],
  host: {'[@slideUpAnimation]': ''},
})
export class EmailJobsComponent implements OnInit {
  jobsPage: Page<PageType> = new Page();
  allTemplatesPage: Page<PageType> = new Page();
  allMappedTemplatesPage: Page<PageType> = new Page();
  loader = false;
  allJobs;
  assets_loc;
  displayedColumnsSentEmails: string[];
  sentEmailsDataSource;
  displayedColumnsEmailTemplates: string[];
  emailTemplatesDataSource;
  allTemplates;
  isArchived;
  allMappedTemplates;
  displayedColumnsMappedEmailTemplates;
  emailTemplatesMappedToCertificatesDataSource;
  deletePopoverTitle = "Archive Template";
  deletePopoverMessage = "Please confirm archiving of template, once archived it cannot be unarchived."
  deletePopoverTitleJob = "Archive Task";
  deletePopoverMessageJob = "Please confirm archiving of task, once archived it cannot be unarchived."
  selectedTab = 0;
  compName = 'emails';

  constructor(
    private paginationService: CustomPaginationService, 
    private emailJobService: EmailJobService, 
    private route: ActivatedRoute, 
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

    this.emailJobService.getAllJobsPage(this.jobsPage.pageable).subscribe(page => {
      this.allJobs = page;
      this.jobsPage = this.allJobs;
      this.sentEmailsDataSource = new MatTableDataSource<PageType>(this.allJobs.content);
    });

    this.emailService.getTemplatesCreatedByAdminPage(this.allTemplatesPage.pageable).subscribe(page => {
      this.allTemplatesPage = page;
      this.allTemplates = page;
      this.emailTemplatesDataSource = new MatTableDataSource<PageType>(this.allTemplatesPage.content);
    });

    this.emailJobService.getEmailTemplatesPage(this.allMappedTemplatesPage.pageable).subscribe(page => {
      this.allMappedTemplatesPage = page;
      this.allMappedTemplates = page;
      this.emailTemplatesMappedToCertificatesDataSource = new MatTableDataSource<PageType>(this.allMappedTemplatesPage.content);
    });

    this.displayedColumnsSentEmails = ['sent_on','subject', 'email_template', 'no_of_recipients', 'seen', 'unsubscribed', 'archive'];

    this.displayedColumnsEmailTemplates = ['created_on', 'subject', 'email_templates', 'no_of_recipients', 'no_of_times_used', 'archive'];

    this.displayedColumnsMappedEmailTemplates = ['created_on', 'subject', 'email_templates', 'no_of_recipients', 'no_of_times_used', 'update'];
  }

  handleTabChange(e) {
    this.selectedTabService.setTab(this.compName, e.index);
  }

  private getAllJobs(): void {
    this.emailJobService.getAllJobsPage(this.jobsPage.pageable).subscribe(page => {
      this.jobsPage = page;
      this.sentEmailsDataSource = new MatTableDataSource<PageType>(this.jobsPage.content);
    });
  }

  private getAllTemplates(): void {
    this.emailService.getTemplatesCreatedByAdminPage(this.allTemplatesPage.pageable).subscribe(page => {
      this.allTemplatesPage = page;
      this.emailTemplatesDataSource = new MatTableDataSource<PageType>(this.allTemplatesPage.content);
    });
  }

  private getAllMappedTemplates(): void {
    this.emailJobService.getEmailTemplatesPage(this.allMappedTemplatesPage.pageable).subscribe(page => {
      this.allMappedTemplatesPage = page;
      this.emailTemplatesMappedToCertificatesDataSource = new MatTableDataSource<PageType>(this.allMappedTemplatesPage.content);
    });
  }

  public getJobsNextPage(): void {
    this.jobsPage.pageable = this.paginationService.getNextPage(this.jobsPage);
    this.getAllJobs();
  }

  public getJobsPreviousPage(): void {
    this.jobsPage.pageable = this.paginationService.getPreviousPage(this.jobsPage);
    this.getAllJobs();
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
    if(source === 'sent') {
      const data =  this.allJobs.content.slice();
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

     this.sentEmailsDataSource = new MatTableDataSource<PageType>(sortedData);;

    } else if (source === 'e-templates'){
        const data: any = this.allTemplatesPage.content.slice();
      
        if (!sort.active || sort.direction === '') {
          this.allJobs.content = data;
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
       
        this.emailTemplatesDataSource = new MatTableDataSource<PageType>(sortedData);
    } else if (source === 'm-templates'){
      const data: any = this.allMappedTemplatesPage.content.slice();
    
      if (!sort.active || sort.direction === '') {
        this.allJobs.content = data;
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
     
      this.emailTemplatesMappedToCertificatesDataSource = new MatTableDataSource<PageType>(sortedData);
    } 
  }

}
