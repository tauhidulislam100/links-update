import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Page } from 'src/app/pagination/page';
import { slideUpAnimation } from 'src/app/_animations/slideUp';
import { ConfigService } from 'src/app/_services/config.service';
import { CustomPaginationService } from 'src/app/_services/custom-pagination.service';
import { DialogService } from 'src/app/_services/dialog.service';
import { FieldService } from 'src/app/_services/field.service';
import { SelectedTabService } from 'src/app/_services/selected-tab.service';
import { FieldType } from 'src/app/_types';
import { TagService } from '../../_services/tag.service';
import { DialogOverview } from '../dialog-overview/dialog-overview.component';

export interface JobData {
  id,
  name,
  created_at
}

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  animations: [slideUpAnimation],
  host: { '[@slideUpAnimation]': '' },
})
export class TagsComponent implements OnInit {
  loader = false;
  allTags: JobData[] = [];
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
  allFields: FieldType[] = [];
  tagsPage: Page<any> = new Page();
  fieldsPage: Page<any> = new Page();
  isFieldDeleted;
  fieldDeletePopoverTitle = "Delete Field";
  fieldDeletePopoverMessage = "Please raise a support ticket to delete the selected field";
  selection = new SelectionModel<JobData>(true, []);
  selectedTab = 0;
  compName = 'tags';

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private fieldService: FieldService,
    private configService: ConfigService,
    private paginationService: CustomPaginationService,
    private selectedTabService: SelectedTabService,
  ) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })

    this.selectedTab = this.selectedTabService.getTab(this.compName);
    console.log("selected Tab ", this.selectedTab);
  }

  ngOnInit() {
    this.isTagUpdated = false;
    this.isFieldDeleted = false;
    this.tagsForm = this.fb.group({});
    this.fieldsForm = this.fb.group({});

    this.tagService.getAllTagsPage(this.tagsPage.pageable).subscribe(data => {
      this.allTags = data.content;
      this.tagsPage = data;
      this.dataSource = new MatTableDataSource<JobData>(this.allTags);
    });

    this.fieldService.getAllFieldsPage(this.fieldsPage.pageable).subscribe(data => {
      this.allFields = data.content;
      this.fieldsPage = data;
      this.fieldsDataSource = new MatTableDataSource<FieldType>(this.allFields);
    });

    this.displayedColumnsTags = ['name', 'no_of_recipients', 'last_used', 'created_on', 'view_users'];

    this.displayedColumnsFields = ['fields', 'created_on', 'recipients_filled', 'recipients_empty', 'view_users'];
  }

  handleTabChange(e) {
    this.selectedTabService.setTab(this.compName, e.index);
  }

  updateTag(id) {
    this.dialogService.setTitle("tag");
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '415px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == 'AddTag') {
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
        }, error => {

          this.isFieldDeleted = false;
          this.isTagAdded = false;
          this.isFieldAdded = false;
          this.isTagUpdated = false;
          this.loader = false
        });
      }
    });
  }

  clicked(row) {
    console.log("row ", row);
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
    this.dialogService.setTitle("field");
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '415px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == 'AddTag') {
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
        }, error => {
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
    this.dialogService.setTitle("Create/ Edit Tags");
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '415px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == 'AddTag') {
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
        }, error => {
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
    this.dialogService.setTitle("Create/ Edit Field");
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '415px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event == 'AddTag') {
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
        }, error => {
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

