import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { Page } from 'src/app/pagination/page';
import { slideUpAnimation } from 'src/app/_animations/slideUp';
import { ConfigService } from 'src/app/_services/config.service';
import { CustomPaginationService } from 'src/app/_services/custom-pagination.service';
import { ErrorService } from 'src/app/_services/error.service';
import { SelectedTabService } from 'src/app/_services/selected-tab.service';
import { PageType } from 'src/app/_types';
import { CertificateService } from '../../_services/certificate.service';
import { ConfirmationDialogueComponent } from "../confirmation-dialogue/confirmation-dialogue.component";

export interface JobData {
  id,
  created_at
}

export interface CertificateData {
  certificate_templates,
  no_of_recipients,
  update,
  archive
}

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  animations: [slideUpAnimation],
  host: {'[@slideUpAnimation]': ''},
})
export class JobsComponent implements OnInit {
  isChecked = true;
  popoverIsVisible = false;
  popoverData = '';
  popperTop: '100px';
  popperLeft: '100px';
  unReleasedPage: Page<PageType> = new Page();
  releasedPage: Page<PageType> = new Page();
  templatePage: Page<PageType> = new Page();
  assets_loc;
  allJobs;
  loader = false;
  certificateForm: FormGroup;
  displayedColumnsCertificates: string[];
  certificateDataSource;
  isReleased: boolean;
  isPublished: boolean;
  isSubmitted: boolean;
  jobsForm: FormGroup;
  displayedColumnsJobs: string[];
  releasedJobsDataSource;
  unReleasedJobsDataSource;
  templatesData=[];
  templates;
  isArchived;
  selection = new SelectionModel<JobData>(true, []);
  downloadPopoverTitle = "Download";
  downloadPopoverMessage = "Please confirm to download";
  releasePopoverTitle = "Release";
  releasePopoverMessage = "Release";
  publishPopoverTitle = "Publish";
  publishPopoverMessage = "Publish";
  regeneratePopoverTitle = "Regenerate";
  regeneratePopoverMessage = "Regenerate";
  comment = "Purpose of log";
  recipientSizeIsZero = false;
  emailLimitIsReached = false;
  publishLimitIsReached = false;
  publishLimit;
  deletePopoverTitle = "Archive Task";
  deletePopoverMessage = "Please confirm archiving of task, once archived it cannot be unarchived."
  compName = 'certificates';
  selectedTab = 0;
  @ViewChild('message', { static: false }) message: ElementRef;

  constructor(
    private certificateService: CertificateService,
    private fb: FormBuilder,
    private errorService: ErrorService,
    private paginationService: CustomPaginationService,
    private renderer: Renderer2, 
    private configService: ConfigService, 
    private dialog: MatDialog,
    private selectedTabService: SelectedTabService,
    private router: Router, 
    ) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    });

    this.selectedTab = selectedTabService.getTab(this.compName);
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.isPublished = false;
    this.isReleased = false;
    this.isArchived = false;
    this.isSubmitted = false;

    this.certificateService.getAllReleasedJobsPage(this.releasedPage.pageable).subscribe(data => {
      this.allJobs = data;
      this.buildJobsForm();
      this.releasedJobsDataSource = new MatTableDataSource<JobData>(this.allJobs.content);
      this.releasedPage = this.allJobs;
      this.releasedJobsDataSource.sort = this.sort;
      //console.log(this.allJobs.content);
      //  this.addCheckboxesToJobs();
    });
    this.certificateService.getAllUnrealsedJobsPage(this.unReleasedPage.pageable).subscribe(data => {
      // this.unReleasedJobsDataSource = new MatTableDataSource<JobData>(data.content);
      this.unReleasedJobsDataSource = data.content;
      this.unReleasedPage = data;
      // this.unReleasedJobsDataSource.sort = this.sort;
      //console.log(this.allJobs.content);
      //  this.addCheckboxesToJobs();
    });

    this.certificateService.getCertificateTemplatesPage(this.templatePage.pageable).subscribe(data => {
      this.templates = data;
      this.certificateDataSource = new MatTableDataSource<JobData>(this.templates.content);
      this.templatePage = this.templates;
      this.templatesData = data.content;
    })

    this.displayedColumnsCertificates = ['id', 'certificate_templates', 'no_of_recipients', 'update'];

    this.displayedColumnsJobs = ['created_at', 'name', 'noOfRecipients', 'seen', 'shared', 'hovereffect'];

    this.certificateForm = this.fb.group({
      allCerts: new FormArray([])
    });
  }

  handleTabChange(e) {
    this.selectedTabService.setTab(this.compName, e.index);
  }
  
  //Jobs
  buildJobsForm() {
    this.jobsForm = this.fb.group({
      allJobs: new FormArray([])
    });
  }

  private getAllJobs(): void {
    this.certificateService.getAllJobsPage(this.releasedPage.pageable).subscribe(page => {
      this.releasedPage = page;
      this.releasedJobsDataSource = new MatTableDataSource<{}>(this.releasedPage.content);

    });
  }

  private getAllTemplates(): void {
    this.certificateService.getCertificateTemplatesPage(this.templatePage.pageable).subscribe(page => {
      this.templatePage = page;
      this.certificateDataSource = new MatTableDataSource<{}>(this.templatePage.content);

    });
  }

  public getNextPage(): void {
    this.releasedPage.pageable = this.paginationService.getNextPage(this.releasedPage);
    this.getAllJobs();
  }

  public getPreviousPage(): void {
    this.releasedPage.pageable = this.paginationService.getPreviousPage(this.releasedPage);
    this.getAllJobs();
  }

  public getNextTemplatePage(): void {
    this.templatePage.pageable = this.paginationService.getNextPage(this.templatePage);
    this.getAllTemplates()
  }

  public getPreviousTemplatePage(): void {
    this.templatePage.pageable = this.paginationService.getPreviousPage(this.templatePage);
    this.getAllTemplates()
  }


  downloadCertificates(row) {

    this.loader = true;
    this.certificateService.downloadCertificate(row.id).subscribe((res) => {
      this.loader = false;
      const now = Date.now();
      const myFormattedDate = formatDate(now, 'MM/dd/yyyy', 'en-US');
      saveAs(res, `${row.id}_${row.certificateTemplateName}_${myFormattedDate}_certificates.zip`);
      this.errorService.setErrorVisibility(false, "");
    }, error => {
      this.loader = false;
    });
  }

  publishCertificates(row) {
    let data = {
      "comment": this.comment
    }
    this.loader = true;
    this.isSubmitted = false;
    this.certificateService.publishCertificate(row.id, data).subscribe(
      data1 => {
        if (data1.isLimitReached) {
          this.publishLimitIsReached = true;
          let div = this.renderer.createElement('div');
          div.innerHTML = "<div class=\"alert alert-secondary\" role=\"alert\"><div class=\"row align-items-center\"><div class=\"col\"><i class=\"fas fa-exclamation-circle mr-2\"></i>" +
            "Oh! It seems there is not enough limit to publish certificates. You can check the balance at the <a\n" +
            "        [routerLink]=\"'/AdminProfile'\" routerLinkActive=\"active\">profile's page</a>  and raise a ticket for limit increase at  <a\n" +
            "        [routerLink]=\"'/FAQ'\" routerLinkActive=\"active\">Support page</a> " +
            "</div><div class=\"col-auto\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><i class=\"fas fa-times-circle\"></i></button></div></div></div>"
          this.renderer.appendChild(this.message.nativeElement, div);
          const closeBtns = this.message.nativeElement.querySelectorAll('.close');
          if(closeBtns) {
            closeBtns.forEach(element => {
              this.renderer.listen(element, 'click', (e) => {
                element.parentNode.parentNode.parentNode.remove();
              })
            });
          }

          this.isSubmitted = false;
        } else {

          let div = this.renderer.createElement('div');
          div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\" ><div class=\"row align-items-center\"><div class=\"col\"><i class=\"fas fa-check-circle mr-2\"></i>" +
        
          "Great! The publish task is submitted. You can track it with task# " + row.id +
          "</div><div class=\"col-auto\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><i class=\"fas fa-times-circle\"></i></button></div></div></div>"

        this.renderer.appendChild(this.message.nativeElement, div);
        const closeBtns = this.message.nativeElement.querySelectorAll('.close');
        if(closeBtns) {
          closeBtns.forEach(element => {
            this.renderer.listen(element, 'click', (e) => {
              element.parentNode.parentNode.parentNode.remove();
            })
          });
        }
        // this.renderer.appendChild(this.message, div);
          this.isSubmitted = true;
          this.publishLimitIsReached = false;
        }
        this.publishLimit = data1.publishLimit;
        this.loader = false;
        this.isReleased = false;
        this.isPublished = true;

        this.errorService.setErrorVisibility(false, "");
      },error => {

        this.loader = false
      });
  }

  generateCertificateTemplate() {
    this.router.navigate(['/Certificates/AddTemplate']);
  }

  releaseCertificates(row) {
    let data = {
      "comment": this.comment
    }
    this.loader = true;
    this.isSubmitted = false;
    this.certificateService.releaseCertificate(row.id, data).subscribe(data => {
      let data1 = JSON.parse(data);
      if (data1.limitIsReached) {
        this.emailLimitIsReached = true;
        this.recipientSizeIsZero = false;
        this.isReleased = false;
        let div = this.renderer.createElement('div');
        div.innerHTML = "<div class=\"alert alert-secondary\" role=\"alert\"><div class=\"row align-items-center\"><div class=\"col\"><i class=\"fas fa-exclamation-circle mr-2\"></i>" +
          "Oh! It seems there is not enough limit to send emails. You can check the balance at the <a\n" +
          "        [routerLink]=\"'/AdminProfile'\" routerLinkActive=\"active\">profile's page</a>  and raise a ticket for limit increase at  <a\n" +
          "        [routerLink]=\"'/FAQ'\" routerLinkActive=\"active\">Support page</a> " +
          "</div><div class=\"col-auto\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><i class=\"fas fa-times-circle\"></i></button></div></div></div>"
        this.renderer.appendChild(this.message.nativeElement, div);
        const closeBtns = this.message.nativeElement.querySelectorAll('.close');
        if(closeBtns) {
          closeBtns.forEach(element => {
            this.renderer.listen(element, 'click', (e) => {
              element.parentNode.parentNode.parentNode.remove();
            })
          });
        }

      } else {
        this.emailLimitIsReached = false;
        if (data1.noOfRecipients == 0) {
          this.recipientSizeIsZero = true;
          this.isReleased = false;
          let div = this.renderer.createElement('div');
          div.innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">" +
            "Requested email addresses are invalid or unsubscribed for the email." +
            "</div>"
          this.renderer.appendChild(this.message.nativeElement, div);
        } else {
          this.recipientSizeIsZero = false;
          this.isReleased = true;
          // this.popoverTitle = data;
          let div = this.renderer.createElement('div');

          div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\" ><div class=\"row align-items-center\"><div class=\"col\"><i class=\"fas fa-check-circle mr-2\"></i>" +
    
          "Great! The release task is submitted. You can track it with task# " + row.id +
          "</div><div class=\"col-auto\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><i class=\"fas fa-times-circle\"></i></button></div></div></div>"
  
          this.renderer.appendChild(this.message.nativeElement, div);
          const closeBtns = this.message.nativeElement.querySelectorAll('.close');
          if(closeBtns) {
            closeBtns.forEach(element => {
              this.renderer.listen(element, 'click', (e) => {
                element.parentNode.parentNode.parentNode.remove();
              })
            });
          }

          this.errorService.setErrorVisibility(false, "");
        }
      }
      this.loader = false;
      this.isPublished = false;
      this.isSubmitted = true;
      this.errorService.setErrorVisibility(false, "");

    },
      error => {

        this.loader = false
      });

  }

  regenerateCertificates(row) {
    let data = {
      "comment": this.comment
    }
    this.loader = true;
    this.isSubmitted = false;
    this.certificateService.regenerateCertificate(row.id, data).subscribe(data => {
      this.loader = false;
      this.isPublished = false;
      this.isReleased = true;
      this.isSubmitted = true;
      let div = this.renderer.createElement('div');

      div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\" ><div class=\"row align-items-center\"><div class=\"col\"><i class=\"fas fa-check-circle mr-2\"></i>" +
    
        "Great! The regenerate task is submitted. You can track it with task# " + row.id +
        "</div><div class=\"col-auto\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><i class=\"fas fa-times-circle\"></i></button></div></div></div>"

      this.renderer.appendChild(this.message.nativeElement, div);
      const closeBtns = this.message.nativeElement.querySelectorAll('.close');
      if(closeBtns) {
        closeBtns.forEach(element => {
          this.renderer.listen(element, 'click', (e) => {
            element.parentNode.parentNode.parentNode.remove();
          })
        });
      }
      // this.renderer.appendChild(this.message, div);


      this.errorService.setErrorVisibility(false, "");



    },
      error => {
        this.loader = false
      });



  }

  validateOnServer(row) {
    this.loader = true;
    this.isSubmitted = false;
    this.certificateService.validateCertificatesOnServer(row.id).subscribe(data => {
      this.loader = false;
      this.isPublished = false;
      this.isReleased = true;
      this.isSubmitted = true;
      let div = this.renderer.createElement('div');

      div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\" ><div class=\"row align-items-center\"><div class=\"col\"><i class=\"fas fa-check-circle mr-2\"></i>" +
    
      "Great! The validate task is submitted. You can track it with task# " + row.id +
      "</div><div class=\"col-auto\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><i class=\"fas fa-times-circle\"></i></button></div></div></div>"
      
    this.renderer.appendChild(this.message.nativeElement, div);
    const closeBtns = this.message.nativeElement.querySelectorAll('.close');
    if(closeBtns) {
      closeBtns.forEach(element => {
        this.renderer.listen(element, 'click', (e) => {
          element.parentNode.parentNode.parentNode.remove();
        })
      });
    }
    // this.renderer.appendChild(this.message, div);


      this.errorService.setErrorVisibility(false, "");
    },
      error => {

        this.loader = false
      });

  }

  showPopover(event, data) {
    this.popoverData = data;
    this.popoverIsVisible = true;
  }

  hidePopover() {
    this.popoverIsVisible = false;
  }

  applyPopperStyles() {
    const styles = { 'top': '100px', 'left': '100px' };
    return styles;
  }

  archive(row) {
    this.certificateService.deleteCertificateTemplate(row.id).subscribe(data => {
      this.isArchived = true;
      this.errorService.setErrorVisibility(false, "");

    }
    );
  }

  submit(row, type) {
    let title = "Please confirm the submission of job for " + row.numberOfRecipients + " recipients"

    if (row.numberOfRecipients > 100) {
      if (type == "regenerate") {
        title = "This will regenerate the certificates for all recipient in the task# " + row.id + " with their updated details. Should we proceed?"
      }
      const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
        width: '400px',
        data: { title: title }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == "Submit") {
          this.submitConfirm(type, row);
        }
      });
    } else {
      this.submitConfirm(type, row);
    }
  }


  submitConfirm(type, row) {
    if (type == "release") {
      this.releaseCertificates(row);
    } else if (type == "publish") {
      this.publishCertificates(row);
    } else if (type == "regenerate") {
      this.regenerateCertificates(row)
    }
  }

  archiveJob(row) {
    this.certificateService.deleteCertificateJob(row.id).subscribe(data => {
      let div = this.renderer.createElement('div');

      div.innerHTML = "<div class=\"alert alert-success\" role=\"alert\" ><div class=\"row align-items-center\"><div class=\"col\"><i class=\"fas fa-check-circle mr-2\"></i>" +
    
      "Job is archived successfully " + row.id +
      "</div><div class=\"col-auto\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><i class=\"fas fa-times-circle\"></i></button></div></div></div>"

      this.renderer.appendChild(this.message.nativeElement, div);
      const closeBtns = this.message.nativeElement.querySelectorAll('.close');
      if(closeBtns) {
        closeBtns.forEach(element => {
          this.renderer.listen(element, 'click', (e) => {
            element.parentNode.parentNode.parentNode.remove();
          })
        });
      }


      this.errorService.setErrorVisibility(false, "");

    }
    )
  }

}


