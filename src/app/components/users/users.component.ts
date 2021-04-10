// import { Component, OnInit, ViewChild, Inject } from '@angular/core';
// import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
// import { UserService } from '../../_services/user.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MatTableDataSource } from '@angular/material/table';
// import { SelectionModel } from '@angular/cdk/collections';
// import { COMMA, ENTER } from '@angular/cdk/keycodes';
// import { UserDetail } from '../../userDetail';
// import { CertificateService } from '../../_services/certificate.service';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import * as XLSX from 'xlsx';
// import { TagService } from '../../_services/tag.service';
// import { validateUserDetail, validateCheckBox, validateSaveAndUpdate, validateTag } from '../../_custome-validators/certificateForm.validator';
// import { EmailService } from '../../_services/email.service';
// import { environment } from 'src/environments/environment';
// import { NavbarService } from 'src/app/_services/navbar.service';
//
//
// export interface UserData {
//   checkBox,
//   id,
//   name,
//   email,
//   user_tags
// };
// @Component({
//   selector: 'app-users',
//   templateUrl: './users.component.html',
//   styleUrls: ['./users.component.css']
// })
// export class UsersComponent implements OnInit {
//   loader = false;
//   allUsers;
//   usersForm: FormGroup;
//   displayedColumns: string[];
//   dataSource;
//   selection = new SelectionModel<UserData>(true, []);
//   visible = true;
//   selectable = true;
//   removable = true;
//   addOnBlur = true;
//   selectedFileName = '';
//   assets_loc;
//   expandedView;
//   tagged:boolean;
//   isSavedOrUpdated:boolean;
//   icons = new Array();
//   readonly separatorKeysCodes: number[] = [ENTER, COMMA];
//   constructor(private userService: UserService,
//     private fb: FormBuilder,
//     private certificateService: CertificateService,
//     private route: ActivatedRoute,
//     private router: Router,
//     public dialog: MatDialog,
//     private tagService: TagService,
//     private emailService: EmailService,
//
//   ) { }
//   ngOnInit() {
//     this.tagged = false;
//     this.isSavedOrUpdated = false;
//     this.assets_loc = environment.assets_location;
//     this.expandedView = false;
//     this.usersForm = this.fb.group({
//       userDetails: [''],
//       filterValue: [],
//       allUsers: new FormArray([], [validateCheckBox()])
//     });
//
//     if (this.route.snapshot.paramMap.get('id') != null) {
//       // console.log("hi");
//       this.allUsers = (this.route.snapshot.data.users);
//       this.addCheckboxes();
//
//     }
//     else{
//       this.allUsers = (this.route.snapshot.data.newUsers);
//       this.addCheckboxes();
//     }
//
//     this.dataSource = new MatTableDataSource<UserData>(this.allUsers);
//     this.displayedColumns = ['select', 'id', 'name', 'email', 'user_tags', 'profileLink'];
//     // if (this.tagService.getFilterTag() !== undefined) {
//
//     // //   setTimeout(() => {
//     // // //    this.dataSource = new MatTableDataSource<UserData>();
//     // //     this.applyFilterAfterSelection(this.tagService.getFilterTag());
//     // //   },
//     // //     1000);
//     // }
//     this.pload(
//      this.assets_loc+"assets/upload.svg",
//      this.assets_loc+"assets/filter.svg",
//      this.assets_loc+"assets/certificate.svg",
//      this.assets_loc+"assets/tag.svg",
//      this.assets_loc+"assets/send-email-recipients.svg"
//     );
//
//     document.getElementById("filter").appendChild(this.icons[1]);
//     document.getElementById("certificate").appendChild(this.icons[2]);
//     document.getElementById("tag").appendChild(this.icons[3]);
//     document.getElementById("email").appendChild(this.icons[4]);
//   }
//   private addCheckboxes() {
//     this.allUsers.map((o, i) => {
//       (this.usersForm.controls.allUsers as FormArray).push(this.setUsersFormArray(o));
//     });
//   }
//   private setUsersFormArray(user) {
//     let formGroup = this.fb.group({
//       checkBox: [false],
//       id: [user.id],
//       userTags: new FormArray([])
//     });
//     user.user_tags.forEach(element => {
//       let Tags: FormControl = new FormControl(element.name);
//       (formGroup.controls.userTags as FormArray).push(Tags);
//     }
//     );
//     return formGroup;
//   }
//   applyFilter(filterValue: string) {
//     this.selection.clear();
//     this.usersForm.value.allUsers.forEach(element => {
//       element.checkBox = false;
//     });
//     this.dataSource.filterPredicate =
//       (data: UserData, filter: string) => data.user_tags
//         .map(data => filter.split(",").map(filterV =>
//           data.tag.name.toString().trim().toLowerCase().indexOf(filterV) !== -1).some(data => data)).some(data => data);
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
//
//   applyFilterAfterSelection(filterValue: string) {
//
//     this.selection.clear();
//     this.dataSource.filterPredicate =
//       (data: UserData, filter: string) => data.user_tags.map(data => data.tag.name.toString().trim().toLowerCase().indexOf(filter) !== -1).some(data => data)
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//     this.tagService.setFilterTag(undefined);
//     // this.dataSource = this.dataSource.filteredData;
//
//   }
//
//   async searchUsers(filterValue: string) {
//     if (filterValue != "") {
//       (this.usersForm.controls.allUsers as FormArray).clear();
//       let emails = [];
//       filterValue.split("\n").map(data =>
//         emails.push(data.split(",")[0])
//
//       );
//       this.allUsers = await this.userService.getByEmails(emails);
//       this.addCheckboxes();
//       this.dataSource = new MatTableDataSource<UserData>(this.allUsers);
//       this.uncheckAll();
//     }
//   }
//   isAllSelected() {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.dataSource.filteredData.length;
//     return numSelected === numRows;
//   }
//   uncheckAll() {
//     this.selection.clear();
//     this.usersForm.value.allUsers.forEach(element => {
//       element.checkBox = false;
//       this.usersForm.get('allUsers').setValidators([validateCheckBox()]);
//       this.usersForm.get('allUsers').updateValueAndValidity();
//     });
//   }
//   checkAll() {
//     this.dataSource.filteredData.forEach(row => {
//       let index = (<FormArray>this.usersForm.get('allUsers')).controls.findIndex(x => x.value.id == row.id);
//       (this.usersForm.get('allUsers').value)[index].checkBox = true;
//       this.selection.select(row);
//       this.usersForm.get('allUsers').setValidators([validateCheckBox()]);
//       this.usersForm.get('allUsers').updateValueAndValidity();
//     });
//   }
//   masterToggle() {
//     this.isAllSelected() ?
//       this.uncheckAll() : this.checkAll();
//   }
//   generateCertificate() {
//     if (this.usersForm.get('allUsers').valid) {
//       console.log(this.usersForm.get("allUsers").value);
//       const selectedIds = this.usersForm.get("allUsers").value
//         .map((v, i) => v.checkBox ? this.allUsers[i] : null)
//         .filter(v => v !== null);
//       let usersList: UserDetail[] = [];
//       let userIds: number[] = [];
//       selectedIds.forEach(data => {
//         usersList.push(new UserDetail(data.id,data.name, data.email, data.gender));
//         userIds.push(data.id);
//       });
//       this.certificateService.setSelectedUsers(usersList);
//       this.certificateService.setSelectedIds(userIds);
//       this.router.navigate(['/GenerateCertificate'])
//     }
//   }
//   sendEmail() {
//     const selectedIds = this.usersForm.get("allUsers").value
//       .map((v, i) => v.checkBox ? this.allUsers[i] : null)
//       .filter(v => v !== null);
//     let usersList: UserDetail[] = [];
//     let emails: string[] = [];
//     selectedIds.forEach(data => {
//       usersList.push(new UserDetail(data.id,data.name, data.email, data.gender));
//       emails.push(data.email);
//     });
//     this.emailService.setSelectedUsers(usersList);
//     this.emailService.setEmails(emails);
//     this.router.navigate(['/SendEmail']);
//   }
//   checkboxLabel(row?: UserData): string {
//     if (!row) {
//       return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
//     }
//     return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
//   }
//   saveAllAndSearch(userDetail: string) {
//     this.usersForm.get('userDetails').setValidators([Validators.required, validateSaveAndUpdate()]);
//     this.usersForm.get('userDetails').updateValueAndValidity();
//     if (this.usersForm.get('userDetails').valid) {
//       this.loader = true;
//       let users = userDetail.split("\n");
//       let userArray: any[] = [];
//       let splitValue = ",";
//       users.forEach(
//         data => {
//           if (data != "") {
//             let data1 = data.split(splitValue);
//             let user = {
//               "email": (data1[0]).trim(),
//               "name": (data1[1]).trim()
//             };
//             if (data1.length == 3) {
//               user["gender"] = (data1[2]).trim();
//             }
//             if (data1.length == 4) {
//               user["mobile"] = (data1[3]).trim();
//             }
//             userArray.push(user);
//           }
//         });
//       this.userService.saveUsers(userArray).subscribe((data) => {
//         this.loader = false;
//         this.tagged = false;
//         this.isSavedOrUpdated = true;
//         // window.alert("Following users are saved  \r\n" + data.map(data => data.email) + "\r\n");
//
//       }, error => {
//         this.loader = false
//       });
//     }
//   }
//   onFileChange(evt: any) {
//     let data = [];
//     const target: DataTransfer = <DataTransfer>(evt.target);
//     if (target.files.length == 1 && evt.target.accept === ".xlsx") {
//       const reader: FileReader = new FileReader();
//       reader.onload = (e: any) => {
//         const bstr: string = e.target.result;
//         const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
//         const wsname: string = wb.SheetNames[0];
//         const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//         data = <any>(XLSX.utils.sheet_to_json(ws));
//         this.loadUserDetails(data);
//       };
//       reader.readAsBinaryString(target.files[0]);
//     }
//
//     this.selectedFileName = evt.target.files[0].name;
//   }
//   loadUserDetails(users: any[]) {
//     let details = "";
//     users.forEach(data => {
//       details += `${data.Email},${data.Name}\n`;
//     });
//     this.usersForm.get('userDetails').setValue(details);
//   }
//   addTags(tag) {
//     this.loader = true;
//     const selectedIds = this.usersForm.get("allUsers").value
//       .map((v, i) => v.checkBox ? this.allUsers[i].id : null)
//       .filter(v => v !== null);
//     this.userService.addTags(selectedIds, tag).subscribe(data => {
//       this.loader = false;
//       this.isSavedOrUpdated = false;
//       this.tagged = true;
//     }, error => {
//       this.loader = false;
//       window.alert("Server Error!");
//     });
//   }
//   openDialog(): void {
//     const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
//       width: '250px'
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//
//       if (result.event == 'AddTag') {
//         this.addTags(result.data);
//       }
//     });
//   }
//
//   changeArea(){
//     this.expandedView = true;
//   }
//
//   pload(...args: any[]):void {
//     for (var i = 0; i < args.length; i++) {
//       this.icons[i] = new Image();
//       this.icons[i].src = args[i];
//      // console.log('loaded: ' + args[i]);
//     }
//   }
// }
//
// @Component({
//   selector: 'dialog-overview-example-dialog',
//   templateUrl: 'dialog-overview-example-dialog.html',
// })
// export class DialogOverviewExampleDialog {
//   action: string;
//   local_data: any;
//   tagForm: FormGroup;
//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData,
//     private userService: UserService,
//     private fb: FormBuilder) {
//     this.tagForm = this.fb.group({
//       tagInput: ['', [Validators.required, validateTag()]]
//     });
//   }
//   selection = new SelectionModel<UserData>(true, []);
//   onNoClick(): void {
//     this.action = "close";
//     this.dialogRef.close();
//   }
//   addtag(tag) {
//     this.local_data = this.tagForm.get('tagInput').value;
//     this.action = "AddTag";
//     this.dialogRef.close({ event: this.action, data: this.local_data });
//   }
// }
// export interface DialogData {
//   tag;
//   userForm;
//   allUsers: any[];
// }
