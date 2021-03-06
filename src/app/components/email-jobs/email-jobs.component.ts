import {Component, OnInit} from '@angular/core';
import {EmailJobService} from '../../_services/email-job.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material';
import {ErrorService} from 'src/app/_services/error.service';
import {EmailService} from 'src/app/_services/email.service';
import {ConfigService} from 'src/app/_services/config.service';
import {Page} from 'src/app/pagination/page';
import {CustomPaginationService} from 'src/app/_services/custom-pagination.service';

@Component({
  selector: 'app-email-jobs',
  templateUrl: './email-jobs.component.html',
  styleUrls: ['./email-jobs.component.css']
})
export class EmailJobsComponent implements OnInit {
  jobsPage: Page<any> = new Page();
  allTemplatesPage: Page<any> = new Page();
  allMappedTemplatesPage: Page<any> = new Page();
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

  constructor(private paginationService: CustomPaginationService, private emailJobService: EmailJobService, private route: ActivatedRoute, private router: Router, private errorService: ErrorService, private emailService: EmailService, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.isArchived = false;

    this.allJobs = this.route.snapshot.data.jobs;
    this.allTemplates = this.route.snapshot.data.templates;
    this.allMappedTemplates = this.route.snapshot.data.mappedTemplates;
    this.sentEmailsDataSource = new MatTableDataSource<any>(this.allJobs.content);
    this.jobsPage = this.allJobs;
    this.displayedColumnsSentEmails = ['id','status', 'subject', 'sent_on', 'no_of_recipients','seen', 'view', 'archive'];
    this.emailTemplatesDataSource = new MatTableDataSource<any>(this.allTemplates.content);
    this.allTemplatesPage = this.allTemplates;
    this.emailTemplatesMappedToCertificatesDataSource = new MatTableDataSource<any>(this.allMappedTemplates.content);
    this.allMappedTemplatesPage = this.allMappedTemplates;
    this.displayedColumnsEmailTemplates = ['id', 'email_templates', 'created_on', 'no_of_times_used', 'no_of_recipients', 'update', 'archive'];
    this.displayedColumnsMappedEmailTemplates = ['id', 'email_templates', 'created_on', 'no_of_times_used', 'no_of_recipients', 'update'];
  }

  private getAllJobs(): void {
    this.emailJobService.getAllJobsPage(this.jobsPage.pageable).subscribe(page => {
      this.jobsPage = page;
      this.sentEmailsDataSource = new MatTableDataSource<any>(this.jobsPage.content);
    });
  }

  private getAllTemplates(): void {
    this.emailService.getTemplatesCreatedByAdminPage(this.allTemplatesPage.pageable).subscribe(page => {
      this.allTemplatesPage = page;
      this.emailTemplatesDataSource = new MatTableDataSource<any>(this.allTemplatesPage.content);
    });
  }

  private getAllMappedTemplates(): void {
    this.emailJobService.getEmailTemplatesPage(this.allMappedTemplatesPage.pageable).subscribe(page => {
      this.allMappedTemplatesPage = page;
      this.emailTemplatesMappedToCertificatesDataSource = new MatTableDataSource<any>(this.allMappedTemplatesPage.content);
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
}
