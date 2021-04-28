import { SelectionModel } from '@angular/cdk/collections';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogOverview } from 'src/app/components/dialog-overview/dialog-overview.component';
import { preload } from 'src/app/utils/preload';
import { slideUpAnimation } from 'src/app/_animations/slideUp';
import { ConfigService } from 'src/app/_services/config.service';
import { FieldService } from 'src/app/_services/field.service';
import { FieldType, UserType } from 'src/app/_types';
import * as XLSX from 'xlsx';
import { UserDetail } from '../../userDetail';
import {
  validateCheckBox,
  validateSaveAndUpdate
} from '../../_custome-validators/certificateForm.validator';
import { CertificateService } from '../../_services/certificate.service';
import { EmailService } from '../../_services/email.service';
import { RecipientService } from '../../_services/recipient.service';
import { TagService } from '../../_services/tag.service';

export interface UserData {
  checkBox,
  id,
  name,
  email,
  userTags
}

@Component({
  selector: 'app-users',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.css'],
  animations: [slideUpAnimation],
  host: { '[@slideUpAnimation]': '' },
})
export class RecipientsComponent implements OnInit, OnDestroy, AfterViewInit {
  loader = false;
  allUsers: UserType[];
  searchResultSize;
  usersForm: FormGroup;
  displayedColumns: string[];
  searchdisplayedColumns: string[];
  showSearchResultMessage = false;
  dataSource;
  searchDataSource = new MatTableDataSource<any>()
  selection = new SelectionModel<UserData>(true, []);
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selectedFileName = '';
  assets_loc;
  expandedView;
  tagged: boolean;
  isSavedOrUpdated: boolean;
  fields: FieldType[];
  icons = [];
  subscription: Subscription[] = [];
  showNewRecipients = true;
  showSearchResults = false;
  textAreaLegend = "Email, Name, Gender, Mobile";
  showErrorIfNameOrEmailIsMissingAfterUpload = false;
  showWarningIfAFewFieldsAreMissing = false;
  showNoRecipientFound = false;
  unMatchedHeaders: string[];
  allrecipientsToPreview;
  previewDisplayColumns = ['email', 'name', 'user_tags', 'fields'];
  previewDataSource;
  showPreview = false;
  noOfRecipientsNotFound = 0;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('message', { static: true }) message: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('myExpandedInput', { static: false }) input: ElementRef;
  @ViewChild('myInput', { static: false }) myInput: ElementRef;
  @ViewChild('myExpandedInput', { static: false }) myExpandedInput: ElementRef;


  constructor(private userService: RecipientService,
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private tagService: TagService,
    private emailService: EmailService,
    private fieldService: FieldService,
    private renderer: Renderer2,
    private configService: ConfigService,
    private recipentService: RecipientService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    });


  }

  ngAfterViewInit() {
    this.myInput.nativeElement.focus();
  }

  ngOnInit() {

    this.tagged = false;
    this.isSavedOrUpdated = false;
    this.expandedView = false;
    this.searchDataSource.paginator = this.paginator;
    this.usersForm = this.fb.group({
      userDetails: [''],
      filterValue: [],
      allUsers: new FormArray([], [validateCheckBox()])
    });


    this.searchdisplayedColumns = ['id', 'email', 'name', 'user_tags', 'fields', 'profileLink'];

    this.subscription[0] = this.fieldService.getAllFields().subscribe(data => {
      this.fields = data;
      this.fields.forEach(data => {
        this.textAreaLegend = this.textAreaLegend + ", " + data.name;
      });
    });


    if (this.route.snapshot.paramMap.get('id') != null) {
      this.showPreview = true;
      this.showNewRecipients = false;
      this.subscription[1] = this.recipentService.getByTag(this.route.snapshot.paramMap.get('id')).subscribe(recipents => {
        this.allUsers = recipents.recipientList;
        this.allrecipientsToPreview = recipents.recipientsToPreview;
        this.searchResultSize = this.allUsers.length;
        this.previewDataSource = new MatTableDataSource<UserData>(this.allrecipientsToPreview);
        this.noOfRecipientsNotFound = recipents.totalRecipientsNotFound;

        let div = this.renderer.createElement('div');
        div.innerHTML = `
          <div class="alert alert-success" role="alert">
            All  ${this.searchResultSize} recipients exist. 
          </div>
        `;
        this.renderer.appendChild(this.message.nativeElement, div);

      });
      // this.addCheckboxes();
    } else {

      this.subscription[2] = this.recipentService.getAllNewUsers().subscribe(data => {
        this.allUsers = data;
        this.addCheckboxes();
        this.dataSource = new MatTableDataSource<UserType>(this.allUsers);
        this.displayedColumns = ['email', 'name', 'user_tags', 'fields'];
      });
    }

    this.icons = preload(
      this.assets_loc + "assets/upload.svg",
      this.assets_loc + "assets/download-orange.svg",
      this.assets_loc + "assets/certificate.svg",
      this.assets_loc + "assets/tag.svg",
      this.assets_loc + "assets/send-email-recipients.svg"
    );
  }

  private addCheckboxes() {
    this.allUsers.map((o, i) => {
      (this.usersForm.controls.allUsers as FormArray).push(this.setUsersFormArray(o));
    });
  }

  private setUsersFormArray(user) {
    let formGroup = this.fb.group({
      checkBox: [false],
      id: [user.id],
      userTags: new FormArray([])
    });
    user.userTags.forEach(element => {
      let Tags: FormControl = new FormControl(element.name);
      (formGroup.controls.userTags as FormArray).push(Tags);
    }
    );
    return formGroup;
  }

  applyFilter(filterValue: string) {
    this.selection.clear();

    this.usersForm.value.allUsers.forEach(element => {
      element.checkBox = false;
    });

    this.dataSource.filterPredicate = (data: UserData, filter: string) => {
      return data.userTags
        .map(data => filter.split(",").map(filterV =>
          data.tag.name.toString().trim().toLowerCase().indexOf(filterV) !== -1).some(data => data)).some(data => data)
    };

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterAfterSelection(filterValue: string) {

    this.selection.clear();
    this.dataSource.filterPredicate =
      (data: UserData, filter: string) => data.userTags.map(data => data.tag.name.toString().trim().toLowerCase().indexOf(filter) !== -1).some(data => data)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.tagService.setFilterTag(undefined);
    // this.dataSource = this.dataSource.filteredData;

  }

  searchUsers1(value: string) {

    if (value != " ") {
      this.loader = true;
      let emails = [];
      value.split("\n").map(data => emails.push(data.split(",")[0]));

      this.userService.getByEmails(emails).then(result => {
        if (result.totalRecipientsFound == 0) {

          this.showNoRecipientFound = true;
          this.loader = false;
          this.showSearchResultMessage = true;
          this.showNewRecipients = false;
          let div = this.renderer.createElement('div');
          div.innerHTML = `
          <div class="alert alert-secondary error" *ngIf="showNoRecipientFound" role="alert">
          <div class="row align-items-center">
             <div class="col">
               <svg xmlns="http://www.w3.org/2000/svg" width="20.289" height="20.289" viewBox="0 0 20.289 20.289">
                 <path id="Path_178" data-name="Path 178" d="M12.145,2A10.145,10.145,0,1,0,22.289,12.145,10.148,10.148,0,0,0,12.145,2Zm0,15.217A1.017,1.017,0,0,1,11.13,16.2V12.145a1.014,1.014,0,0,1,2.029,0V16.2A1.017,1.017,0,0,1,12.145,17.217Zm.866-8.252a1.212,1.212,0,0,1-1.763,0,1.167,1.167,0,0,1,0-1.725,1.212,1.212,0,0,1,1.763,0A1.167,1.167,0,0,1,13.01,8.965Z" transform="translate(-2 -2)" fill="#28293d"/>
               </svg>
               All records are new. You can save them and search again to proceed for any task.
             </div>
             <div class="col-auto">
               <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                 <span aria-hidden="true">Dismiss</span>
               </button>
             </div>
     
          </div>
       </div>
          `;

          this.renderer.appendChild(this.message.nativeElement, div);
          this.renderer.appendChild(this.message, div);

        } else {
          this.showPreview = true;
          this.showNoRecipientFound = false;
          this.loader = false;
          this.allUsers = result.recipientList;
          this.allrecipientsToPreview = result.recipientsToPreview;
          this.noOfRecipientsNotFound = result.totalRecipientsNotFound;
          this.previewDataSource = new MatTableDataSource<any>(result.recipientsToPreview);
          this.searchResultSize = result.totalRecipientsFound;
          let div = this.renderer.createElement('div');
          if (this.noOfRecipientsNotFound > 0) {
            if (result.duplicates == 0) {
              div.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                  We found  ${this.searchResultSize} existing recipient and ${this.noOfRecipientsNotFound}  new one. Please save all before proceeding.
                </div>
              `;
            } else if (result.duplicates > 0) {
              div.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                  We found  ${this.searchResultSize} existing recipient and  ${this.noOfRecipientsNotFound}  new one. Rest  ${result.duplicates}  are duplicates. Please save all before proceeding.
                </div>
              `;
            }
          } else if (this.noOfRecipientsNotFound == 0) {
            if (result.duplicates > 0) {
              div.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                  We found  ${this.searchResultSize}  existing recipient and Rest  ${result.duplicates}  are duplicates. Please save all before proceeding.
                </div>
              `;
            } else if (result.duplicates == 0) {
              div.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                  All ${this.searchResultSize}  recipients exist
                </div>
              `;
            }

          }

          // this.message.nativeElement.appendChild(div);
          this.renderer.appendChild(this.message.nativeElement, div);
          this.showSearchResultMessage = true;
          this.showNewRecipients = false;
        }
        // this.showSearchResults = true;
      });
    }
  }

  async searchUsers(filterValue: string) {
    if (filterValue != "") {
      this.loader = true;
      (this.usersForm.controls.allUsers as FormArray).clear();
      let emails = [];
      filterValue.split("\n").map(data =>
        emails.push(data.split(",")[0])
      );


      this.allUsers = await this.userService.getByEmails(emails);
      this.loader = false;
      // this.addCheckboxes();
      //this.dataSource = new MatTableDataSource<UserData>(this.allUsers);
    }
    // this.uncheckAll();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  uncheckAll() {
    this.selection.clear();
    this.usersForm.value.allUsers.forEach(element => {
      element.checkBox = false;
      this.usersForm.get('allUsers').setValidators([validateCheckBox()]);
      this.usersForm.get('allUsers').updateValueAndValidity();
    });
  }

  checkAll() {
    this.dataSource.filteredData.forEach(row => {
      let index = (<FormArray>this.usersForm.get('allUsers')).controls.findIndex(x => x.value.id == row.id);
      (this.usersForm.get('allUsers').value)[index].checkBox = true;
      this.selection.select(row);
      this.usersForm.get('allUsers').setValidators([validateCheckBox()]);
      this.usersForm.get('allUsers').updateValueAndValidity();
    });
  }

  masterToggle() {
    this.isAllSelected() ?
      this.uncheckAll() : this.checkAll();
  }

  generateCertificate() {
    let listOfRecipients: any[] = [];
    if (!this.showNewRecipients) {
      if (this.searchResultSize > 0) {
        listOfRecipients = this.allUsers
        let usersList: UserDetail[] = [];
        let userIds: number[] = [];
        listOfRecipients.forEach(data => {
          usersList.push(new UserDetail(data.id, data.name, data.email, data.gender));
          userIds.push(data.id);
        });
        this.certificateService.setSelectedUsers(usersList);
        this.certificateService.setSelectedIds(userIds);
        this.router.navigate(['/GenerateCertificate'])
      }
    } else {
      if (this.usersForm.get('allUsers').valid) {
        listOfRecipients = this.usersForm.get("allUsers").value
          .map((v, i) => v.checkBox ? this.allUsers[i] : null)
          .filter(v => v !== null);
        let usersList: UserDetail[] = [];
        let userIds: number[] = [];
        listOfRecipients.forEach(data => {
          usersList.push(new UserDetail(data.id, data.name, data.email, data.gender));
          userIds.push(data.id);
        });
        this.certificateService.setSelectedUsers(usersList);
        this.certificateService.setSelectedIds(userIds);
        this.router.navigate(['/GenerateCertificate'])
      }
    }
  }

  sendEmail() {

    let listOfRecipients: any[] = [];
    if (!this.showNewRecipients) {
      if (this.searchResultSize > 0) {
        this.loader = true;
        listOfRecipients = this.allUsers;
        let usersList: UserDetail[] = [];
        let emails: string[] = [];
        listOfRecipients.forEach(data => {
          usersList.push(new UserDetail(data.id, data.name, data.email, data.gender));
          emails.push(data.email);
        });
        this.emailService.setSelectedUsers(usersList);
        this.emailService.setEmails(emails);
        this.router.navigate(['/SendEmail']);
      }
    } else {
      if (this.usersForm.get('allUsers').valid) {
        this.loader = true;
        const selectedIds = this.usersForm.get("allUsers").value
          .map((v, i) => v.checkBox ? this.allUsers[i] : null)
          .filter(v => v !== null);
        let usersList: UserDetail[] = [];
        let emails: string[] = [];
        selectedIds.forEach(data => {
          usersList.push(new UserDetail(data.id, data.name, data.email, data.gender));
          emails.push(data.email);
        });
        this.emailService.setSelectedUsers(usersList);
        this.emailService.setEmails(emails);
        this.router.navigate(['/SendEmail']);
      }
    }


  }

  checkboxLabel(row?: UserData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  saveAllAndSearch(userDetail: string) {
    this.usersForm.get('userDetails').setValidators([Validators.required, validateSaveAndUpdate()]);
    this.usersForm.get('userDetails').updateValueAndValidity();
    if (this.usersForm.get('userDetails').valid) {
      this.loader = true;
      let users = userDetail.split("\n");
      let userArray: any[] = [];
      let splitValue = ",";
      users.forEach(
        data => {
          if (data != "") {
            let data1 = data.split(splitValue);
            let user = {
              "email": (data1[0]).trim(),
              "name": (data1[1]).trim()
            };
            if (data1.length >= 3) {


              if (data1[2] != "") {
                user["gender"] = (data1[2]).trim();
              }

              if (data1.length == 4) {
                if (data1[3] != "") {
                  user["mobile_number"] = (data1[3]).trim();
                }
              }

              if (data1.length > 4) {
                let fields = {};
                let i = 4;
                this.fields.forEach(field => {

                  if (data1[i] != "") {

                    fields[field.name] = (data1[i]).trim();
                  }
                  i++
                });
                user["fields"] = fields;
              }
            }


            userArray.push(user);
          }
        });
      this.userService.saveUsers(userArray).subscribe((data) => {
        this.loader = false;
        this.tagged = false;
        this.isSavedOrUpdated = true;
        this.uncheckAll();
        this.showNewRecipients = false;
        this.showPreview = false;
        let div = this.renderer.createElement('div');
        div.innerHTML = `
          <div class="alert alert-success" role="alert">
            Done! You can search the recipients now.
          </div>
        `;
        this.renderer.appendChild(this.message.nativeElement, div);
        //  this.userService.getAllNewUsers().subscribe(data => {
        //    this.uncheckAll();
        //    this.allUsers = data;
        //    this.addCheckboxes();
        //    this.dataSource = new MatTableDataSource<UserData>(this.allUsers);
        // })
      }, error => {
        this.loader = false
      });
    }
  }

  onFileChange(evt: any) {
    let data = [];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length == 1 && evt.target.accept === ".xlsx") {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const rows: string[] = XLSX.utils.sheet_to_csv(ws).split("\n");
        let headers: string[];
        if (rows.length > 0) {
          headers = rows[0].split(",");
        }
        this.validateHeaders(headers);
        data = <any>(XLSX.utils.sheet_to_json(ws, { raw: false }));
        this.loadUserDetails(data);
      };
      reader.readAsBinaryString(target.files[0]);
    }
    this.selectedFileName = evt.target.files[0].name;
  }

  loadUserDetails(users: any[]) {
    let details = "";
    users.forEach(data => {
      console.log(data);
      let email = "";
      let name = "";
      let gender = "";
      let mobile = "";

      if (data.Email != undefined) {
        email = data.Email;
      }

      if (data.Name != undefined) {
        name = data.Name;
      }

      if (data.Gender != undefined) {
        gender = data.Gender;
      }

      if (data.Mobile != undefined) {
        mobile = data.Mobile;
      }

      details += `${email},${name},${gender},${mobile}`;
      this.fields.forEach(field => {
        var fieldValue = "";
        if (data[field.name] != null) {

          fieldValue = data[field.name];
        }
        details += `,${fieldValue}`;
      })
      details += `\n`;
    });
    this.usersForm.get('userDetails').setValue(details);
  }

  validateHeaders(headersPresent: string[]) {
    let headersExpected: string[] = ["Email", "Name", "Gender", "Mobile"]
    this.fields.forEach(field => {
      headersExpected.push(field.name);
    })
    this.unMatchedHeaders = headersExpected.filter(x => !headersPresent.includes(x));
    if (this.unMatchedHeaders.includes("Name") || this.unMatchedHeaders.includes("Email")) {
      this.showErrorIfNameOrEmailIsMissingAfterUpload = true;
      this.showWarningIfAFewFieldsAreMissing = false;
    } else if (this.unMatchedHeaders.length > 0) {
      this.showWarningIfAFewFieldsAreMissing = true;
      this.showErrorIfNameOrEmailIsMissingAfterUpload = false;
    } else {
      this.showWarningIfAFewFieldsAreMissing = false;
      this.showErrorIfNameOrEmailIsMissingAfterUpload = false;
    }
  }

  addTags(tag) {
    this.loader = true;
    let listOfRecipients: any[] = [];
    if (!this.showNewRecipients) {
      if (this.searchResultSize > 0) {
        listOfRecipients = this.allUsers
          .map(recipient => recipient.id)
        this.userService.addTags(listOfRecipients, tag).subscribe(data => {
          this.loader = false;
          this.isSavedOrUpdated = false;
          this.tagged = true;
          this.showPreview = false;
          let div = this.renderer.createElement('div');
          div.innerHTML = `
            <div class="alert alert-success" role="alert">
              The tag is added. You can search again to view it.
            </div>
          `
          this.renderer.appendChild(this.message.nativeElement, div);
          // this.userService.getAllNewUsers().subscribe(data => {
          // })
        }, error => {
          this.loader = false;
        });
      }
    } else {
      if (this.usersForm.get('allUsers').valid) {
        listOfRecipients = this.usersForm.get("allUsers").value
          .map((v, i) => v.checkBox ? this.allUsers[i].id : null)
          .filter(v => v !== null);
        this.userService.addTags(listOfRecipients, tag).subscribe(data => {
          this.loader = false;
          this.isSavedOrUpdated = false;
          this.tagged = true;
          this.showPreview = false;
          let div = this.renderer.createElement('div');
          div.innerHTML = `
            <div class="alert alert-success" role="alert">
              The tag is added. You can search again to view it.
            </div>
          `;
          this.renderer.appendChild(this.message.nativeElement, div);
          // this.userService.getAllNewUsers().subscribe(data => {
          // })
        }, error => {
          this.loader = false;
        });
      }
    }

  }

  addTag() {

    if (!this.showNewRecipients) {
      if (this.searchResultSize > 0) {
        this.openDialog();
      }
    } else {
      if (this.usersForm.get('allUsers').valid) {
        this.openDialog();
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result && result.event == 'AddTag') {
        this.addTags(result.data);
      }
    });
  }

  changeArea() {
    this.expandedView = true;
  }


  exportToExcel() {
    let listOfRecipients: any[] = [];

    if (!this.showNewRecipients) {
      if (this.searchResultSize > 0) {
        listOfRecipients = this.allUsers;
        var allUserDetail = [];
        listOfRecipients.forEach(element => {
          var userData = {
            "Name": element.name,
            "Email": element.email,
            "Gender": element.gender,
            "Mobile": element.mobile_number
          };
          this.fields.forEach(field => {
            var fieldValue = "";
            if (element.fields != null) {
              fieldValue = element.fields[field.name];
            }
            userData[field.name] = fieldValue;
          });
          allUserDetail.push(userData);
        });

        const ws: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(allUserDetail);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'recipients.xlsx');
      }
    } else {

      if (this.usersForm.get('allUsers').valid) {
        listOfRecipients = this.usersForm.get("allUsers").value
          .map((v, i) => v.checkBox ? this.allUsers[i] : null)
          .filter(v => v !== null);
        var allUserDetail = [];
        listOfRecipients.forEach(element => {
          var userData = {
            "Name": element.name,
            "Email": element.email,
            "Gender": element.gender,
            "Mobile": element.mobile_number
          };
          this.fields.forEach(field => {
            var fieldValue = "";
            if (element.fields != null) {
              fieldValue = element.fields[field.name];
            }
            userData[field.name] = fieldValue;
          });
          allUserDetail.push(userData);
        });

        const ws: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(allUserDetail);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'recipients.xlsx');

      }
    }
  }

  ngOnDestroy() {
    if (this.subscription.length) {
      for (const i in this.subscription) {
        this.subscription[i].unsubscribe();
        delete this.subscription[i];
      }
    }
  }
}
