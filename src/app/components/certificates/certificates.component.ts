import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material';
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { Page } from 'src/app/pagination/page';
import { compare } from 'src/app/utils/sortCompare';
import { slideAnimation } from 'src/app/_animations/slideAnimation';
import { ConfigService } from 'src/app/_services/config.service';
import { CustomPaginationService } from 'src/app/_services/custom-pagination.service';
import { ErrorService } from 'src/app/_services/error.service';
import { SelectedTabService } from 'src/app/_services/selected-tab.service';
import { PageType } from 'src/app/_types';
import { CertificateService } from '../../_services/certificate.service';
import { ConfirmationDialogueComponent } from "../confirmation-dialogue/confirmation-dialogue.component";

export interface CertificateDataType {
  id: number,
  created_at: string,
  certificateTemplate: Record<string, any>,
  certificateTemplateName: string,
  deletedAt: string,
  deletedBy: Record<string, any>,
  last_action: string | null,
  last_action_date: string | null,
  last_downloaded_on: string | null,
  last_published_on: string | null,
  last_released_on: string | null,
  no_of_recipients: number | null,
  published: boolean,
  recipients: any[],
  share: number,
  status: string,
  updatedAt: string,
  seen: number,
}

export interface TemplateType {
  certificate_image: string | null,
  certificate_image_thumbnail: Record<string, any> | null,
  created_at: string | null,
  created_by: Record<string, any> | null,
  deleted_at: string | null,
  deleted_by: Record<string, any> | null,
  id: number,
  instructions: string | null,
  last_edited_on: string | null,
  last_used_on: string | null,
  name: string | null,
  no_of_recipient: number | null,
  updated_at: string | null,
}


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css'],
  animations: [slideAnimation],
  host: { '[@slideAnimation]': '' },
})
export class CertificatesComponent implements OnInit {
  showArchive = true;
  popoverIsVisible = false;
  popoverData = '';
  popperTop: '100px';
  popperLeft: '100px';
  unReleasedPage: Page<PageType> = new Page();
  releasedPage: Page<PageType> = new Page();
  templatePage: Page<PageType> = new Page();
  assets_loc;
  loader = false;
  displayedColumnsCertificates: string[];
  isReleased: boolean;
  isPublished: boolean;
  isSubmitted: boolean;
  displayedColumnsJobs: string[];
  releasedJobsDataSource: CertificateDataType[];
  unReleasedJobsDataSource: CertificateDataType[];
  templatesData:TemplateType[] = [];
  isArchived;
  selection = new SelectionModel<CertificateDataType[]>(true, []);
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
    this.certificateService.showArchived = this.showArchive;

    this.certificateService.getAllReleasedJobsPage(this.releasedPage.pageable).subscribe(data => {
      this.releasedJobsDataSource = data.content;
      this.releasedPage = data;
    });

    this.certificateService.getAllUnrealsedJobsPage(this.unReleasedPage.pageable).subscribe(data => {
      this.unReleasedJobsDataSource = data.content;
      this.unReleasedPage = data;
    });

    this.certificateService.getCertificateTemplatesPage(this.templatePage.pageable).subscribe(data => {
      this.templatePage = data;
      this.templatesData = data.content;
    })

    this.displayedColumnsCertificates = ['id', 'certificate_templates', 'no_of_recipients', 'update'];
    this.displayedColumnsJobs = ['created_at', 'name', 'noOfRecipients', 'seen', 'shared', 'hovereffect'];
  }

  handleTabChange(e) {
    this.selectedTabService.setTab(this.compName, e.index);
  }

  archiveToggle() {
    this.certificateService.showArchived = this.showArchive;
    this.getAllReleasedJobs();
    this.getAllUNReleasedJobs();
    this.getAllTemplates();
  }

  private getAllUNReleasedJobs(): void {
    this.certificateService.getAllUnrealsedJobsPage(this.unReleasedPage.pageable).subscribe(data => {
      this.unReleasedJobsDataSource = data.content;
      this.unReleasedPage = data;
    });
  }

  private getAllReleasedJobs(): void {
    this.certificateService.getAllReleasedJobsPage(this.releasedPage.pageable).subscribe(data => {
      this.releasedJobsDataSource = data.content;
      this.releasedPage = data;
    });
  }

  private getAllTemplates(): void {
    this.certificateService.getCertificateTemplatesPage(this.templatePage.pageable).subscribe(page => {
      this.templatePage = page;
      this.templatesData = page.content;
    });
  }

  public getNextPage(): void {
    this.releasedPage.pageable = this.paginationService.getNextPage(this.releasedPage);
    this.getAllReleasedJobs();
  }

  public getPreviousPage(): void {
    this.releasedPage.pageable = this.paginationService.getPreviousPage(this.releasedPage);
    this.getAllReleasedJobs();
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
          if (closeBtns) {
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
          if (closeBtns) {
            closeBtns.forEach(element => {
              this.renderer.listen(element, 'click', (e) => {
                element.parentNode.parentNode.parentNode.remove();
              })
            });
          }
          this.isSubmitted = true;
          this.publishLimitIsReached = false;
        }
        this.publishLimit = data1.publishLimit;
        this.loader = false;
        this.isReleased = false;
        this.isPublished = true;
        this.errorService.setErrorVisibility(false, "");
      }, error => {
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
        if (closeBtns) {
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
          if (closeBtns) {
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
      if (closeBtns) {
        closeBtns.forEach(element => {
          this.renderer.listen(element, 'click', (e) => {
            element.parentNode.parentNode.parentNode.remove();
          })
        });
      }
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
      if (closeBtns) {
        closeBtns.forEach(element => {
          this.renderer.listen(element, 'click', (e) => {
            element.parentNode.parentNode.parentNode.remove();
          })
        });
      }
      this.errorService.setErrorVisibility(false, "");
    }, error => {
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
      if (closeBtns) {
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

  sortData(sort: Sort, source) {
    if (source === 'unreleased') {
      const data = this.unReleasedJobsDataSource.slice();
      if (!sort.active || sort.direction === '') {
        this.unReleasedJobsDataSource = data;
        return;
      }

      let sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'updatedAt': return compare(a.updatedAt, b.updatedAt, isAsc);
          default: return 0;
        }
      });

      this.unReleasedJobsDataSource = sortedData;
    } else if (source === 'released') {
      const data = this.releasedPage.content.slice() as unknown as CertificateDataType[];

      if (!sort.active || sort.direction === '') {
        return;
      }

      let sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'created_at': return compare(a.created_at, b.created_at, isAsc);
          case 'certificateTemplateName': return compare(a.certificateTemplateName, b.certificateTemplateName, isAsc);
          case 'no_of_recipients': return compare(a.no_of_recipients, b.no_of_recipients, isAsc);
          case 'seen': return compare(a.seen, b.seen, isAsc);
          case 'share': return compare(a.share, b.share, isAsc);
          default: return 0;
        }
      });
      this.releasedJobsDataSource = sortedData;
    }
  }

}
