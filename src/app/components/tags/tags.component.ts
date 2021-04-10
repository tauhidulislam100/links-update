import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {TagService} from '../../_services/tag.service';
import {DialogOverviewExampleDialog} from '../recipients/recipients.component';
import {RecipientService} from '../../_services/recipient.service';
import {DialogService} from 'src/app/_services/dialog.service';
import {FieldService} from 'src/app/_services/field.service';
import {ConfigService} from 'src/app/_services/config.service';
import {Page} from 'src/app/pagination/page';
import {CustomPaginationService} from 'src/app/_services/custom-pagination.service';


export interface JobData {
  id,
  name,
  created_at
}

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  loader = false;
  allTags;
  assets_loc;
  tagsForm: FormGroup;
  displayedColumnsTags: string[];
  displayedColumnsFields: string[];
  dataSource;
  fieldsDataSource;
  fieldsForm;
  isTagUpdated: boolean;
  isFieldUpdated: boolean;
  isFieldAdded: boolean;
  isTagAdded: boolean;
  tagAlreadyExists: boolean = false;
  fieldAlreadyExists: boolean = false;
  allFields;
  tagsPage: Page<any> = new Page();
  fieldsPage: Page<any> = new Page();
  isFieldDeleted;
  fieldDeletePopoverTitle = "Delete Field";
  fieldDeletePopoverMessage = "Please raise a support ticket to delete the selected field";
  selection = new SelectionModel<JobData>(true, []);

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder, private tagService: TagService, private router: Router, private dialog: MatDialog, private userService: RecipientService, private dialogService: DialogService, private fieldService: FieldService
    , private configService: ConfigService, private paginationService: CustomPaginationService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {
    this.isTagUpdated = false;
    this.isFieldDeleted = false;
    this.tagsForm = this.fb.group({});
    this.fieldsForm = this.fb.group({});
    this.allTags = this.route.snapshot.data.tags.content;
    this.tagsPage = this.route.snapshot.data.tags;
    this.allFields = this.route.snapshot.data.fields.content;
    this.fieldsPage = this.route.snapshot.data.fields;
    this.fieldsDataSource = new MatTableDataSource<any>(this.allFields);
    this.dataSource = new MatTableDataSource<JobData>(this.allTags);
    this.displayedColumnsTags = ['id', 'name', 'created_on', 'no_of_recipients', 'update_tag', 'view_users'];
    this.displayedColumnsFields = ['id', 'fields', 'created_on', 'delete'];
  }

  clicked(row) {
  }

  updateTag(id) {
    this.dialogService.setTitle("tag");
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {


      if (result.event == 'AddTag') {
        this.loader = true;
        this.tagService.updateTag(id, result.data).subscribe(data => {
            this.loader = false;

            this.tagService.getAllTagsPage(this.tagsPage.pageable).subscribe(
              data => {
                this.allTags = data.content;
                this.dataSource = new MatTableDataSource<JobData>(this.allTags);
                this.isTagUpdated = true;
                this.isFieldDeleted = false;
                this.isTagAdded = false;
                this.isFieldAdded = false;
              }
            )
          }
          , error => {

            this.isFieldDeleted = false;
            this.isTagAdded = false;
            this.isFieldAdded = false;
            this.isTagUpdated = false;
            this.loader = false
          });
      }
    });
  }

  private getAllTags(): void {
    this.tagService.getAllTagsPage(this.tagsPage.pageable).subscribe(page => {
      this.tagsPage = page;
      this.dataSource = new MatTableDataSource<JobData>(this.tagsPage.content);

    });
  }

  public getNextTagsPage(): void {
    this.tagsPage.pageable = this.paginationService.getNextPage(this.tagsPage);
    this.getAllTags();
  }

  public getPreviousTagsPage(): void {
    this.tagsPage.pageable = this.paginationService.getPreviousPage(this.tagsPage);
    this.getAllTags();
  }


  private getAllFields(): void {
    this.fieldService.getAllFieldsPage(this.fieldsPage.pageable).subscribe(page => {

      this.fieldsPage = page;
      this.fieldsDataSource = new MatTableDataSource<JobData>(page.content);

    });
  }

  public getNextFieldsPage(): void {
    this.fieldsPage.pageable = this.paginationService.getNextPage(this.fieldsPage);
    this.getAllFields();
  }

  public getPreviousFieldsPage(): void {
    this.fieldsPage.pageable = this.paginationService.getPreviousPage(this.fieldsPage);
    this.getAllFields();
  }


  updateField(id) {
    this.dialogService.setTitle("tag");
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {


      if (result.event == 'AddTag') {
        this.loader = true;
        this.fieldService.updateField(id, result.data).subscribe(data => {
            this.loader = false;

            this.fieldService.getAllFieldsPage(this.fieldsPage.pageable).subscribe(
              data => {
                this.allFields = data.content;
                this.fieldsDataSource = new MatTableDataSource<any>(this.allFields);
                this.isTagUpdated = false;
                this.isFieldDeleted = true;
                this.isTagAdded = false;
                this.isFieldAdded = false;
              }
            )
          }
          , error => {
            this.isFieldDeleted = false;
            this.isTagAdded = false;
            this.isFieldAdded = false;
            this.isTagUpdated = false;
            this.loader = false
          });
      }
    });
  }


  addTag() {
    this.dialogService.setTitle("tag");
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'AddTag') {
        this.loader = true;
        this.tagService.addTag(result.data).subscribe(data => {
            this.loader = false;
            if (data != null) {
              this.tagService.getAllTagsPage(this.tagsPage.pageable).subscribe(
                data => {
                  this.allTags = data.content;
                  this.dataSource = new MatTableDataSource<JobData>(this.allTags);
                  this.tagsPage = data;
                  this.isFieldDeleted = false;
                  this.isTagAdded = true;
                  this.isFieldAdded = false;
                  this.isTagUpdated = false;
                  this.tagAlreadyExists = false;
                }
              )
            } else {
              this.tagAlreadyExists = true;
            }
          }
          , error => {
            this.isFieldDeleted = false;
            this.isTagAdded = false;
            this.isFieldAdded = false;
            this.isTagUpdated = false;
            this.tagAlreadyExists = false;
            this.loader = false
          });
      }
    });
  }

  addField() {
    this.dialogService.setTitle("field");
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'AddTag') {
        this.loader = true;
        this.fieldService.addField(result.data).subscribe(data => {
            this.loader = false;
            if (data != null) {
              this.fieldService.getAllFieldsPage(this.fieldsPage.pageable).subscribe(
                data => {
                  this.allFields = data.content;
                  this.fieldsPage = data;
                  this.fieldsDataSource = new MatTableDataSource<any>(this.allFields);
                  this.isFieldDeleted = false;
                  this.isTagAdded = false;
                  this.isFieldAdded = true;
                  this.isTagUpdated = false;
                  this.fieldAlreadyExists = false;

                }
              )
            } else {
              this.fieldAlreadyExists = true;
            }
          }
          , error => {
            this.isFieldDeleted = false;
            this.isTagAdded = false;
            this.isFieldAdded = false;
            this.isTagUpdated = false;
            this.fieldAlreadyExists = false;
            this.loader = false
          });
      }
    });
  }


  view(row) {
    this.tagService.setFilterTag(row.id);

    this.router.navigate(['/allUsers/' + row.id]);
  }

  deleteField(id) {
    let title = "Ticket to delete a FIELD with id " + id;
    this.router.navigate(['/FAQ', title]);



  }
}

