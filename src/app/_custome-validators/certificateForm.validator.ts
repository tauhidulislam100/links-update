import {AbstractControl, ValidatorFn} from "@angular/forms";
import {formatDate} from '@angular/common';

export function compareDates(control: AbstractControl): { [key: string]: string } | null {
  const startDate = control.get("endDate").value;
  const endDate = control.get("cocDate").value;
  if (startDate !== null && endDate !== null) {
    const s = formatDate(startDate, 'MM/dd/yyyy', 'en-US');
    const e = formatDate(endDate, 'MM/dd/yyyy', 'en-US');


    return (s >= e) ? {"value": "End date must be less then Release Date"} : null
  }
  return null;
}

export function validateUserDetail(template): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    let msg = "";
    let details = control.value;
    let detailList: string[] = details.split("\n");
    detailList.map(
      (data, i) => {
        let user: string[] = data.split(",");
        // if (template == 100003 || template >= 100008) {
        if (data !== "") {
          if (user.length !== 3) {
            msg += `Check data at ${i + 1} <br>`;
          }
          if (user[0] !== "") {
            if (!validateEmail(user[0])) {
              msg += `Check email at ${i + 1} <br>`;
            }
          } else {
            msg += `Email required at row No. ${i + 1} <br>`
          }
          if (user[1] == "") {

            msg += `Name required at row No. ${i + 1} <br>`
          }
          // if (user[2] !== "") {
          //     if (user[2] == "Male" || user[2] == "male" || user[2] == "female" || user[2] == "Female") {
          //
          //     }
          //     else {
          //         msg += `Gender should be Male/Female at row No. ${i + 1} <br>`;
          //     }
          // }

        }
        // }
        // else {
        //     if (data !== "") {
        //         if (user.length < 2) {
        //             msg += `Check data at row No. ${i + 1} <br>`;
        //         }
        //         else {
        //             if (user[1] == "") {
        //                 msg += `Name required at row No. ${i + 1} <br>`
        //             }
        //             if (user[0] !== "") {
        //                 if (!validateEmail(user[0])) {
        //                     msg += `Check Email at row No. ${i + 1} <br>`;
        //                 }
        //             }
        //             else {
        //                 msg += `Email required at ${i + 1} <br>`
        //             }
        //         }
        //     }
        // }
      });
    return (msg == "") ? null : {"value": msg};
  }
}

export function validateSaveAndUpdate(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let msg = "";
    let details = control.value;
    let detailList: string[] = details.split("\n");
    detailList.map(
      (data, i) => {
        let user: string[] = data.split(",");
        if (data !== "") {
          if (user.length < 2) {
            msg += `Check data at row No. ${i + 1} <br>`;
          } else {
            if (user[1] !== "") {
              if (!validateName(user[1].trim())) {
                msg += `Invalid name at row ${i + 1}. In special characters, only [dot] is allowed. <br>`;
              }
            } else {
              msg += `Name required at row No. ${i + 1} <br>`;
            }
            if (user[0] !== "") {
              if (!validateEmail(user[0].trim())) {
                msg += `Invalid email at row ${i + 1}. Please make sure the details are in the same order as of the Fields. <br>`;
              }
            } else {
              msg += `Email required at row No.  ${i + 1} <br>`;
            }
            if (user.length >= 3) {
              if (user[2] !== "") {
                if (user[2].trim() == "Male" || user[2].trim() == "male" || user[2].trim() == "female" || user[2].trim() == "Female") {

                } else {
                  msg += `Invalid Gender at row ${i + 1}. You can use either Male or Female. <br>`;
                }
              } else {
                // msg += `Gender required at row No. ${i + 1} <br>`
              }
            }

            if (user.length >= 4) {
              if (user[3] !== "") {
                if (!validateMobile(user[3].trim())) {
                  msg += `Looks like you have an invalid value at row ${i + 1}. Mobile numbers should be of 10 digits. <br>`
                }

              } else {
                //  msg += `Mobile Number required at row No. ${i + 1} <br>`
              }
            }
          }
        }
      });

    return (msg == "") ? null : {"value": msg};
  }
}

export function validateField(fields: any []): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    let msg = "";
    let body = control.value;
    let res: string[] = body.match(/{.*?}/g);
    let fixedFields: string [] = ["FirstName", "Name", "Gender", "Phone", "Email", "CertificateNumber", "Organization", "SenderEmail", "keyToUnsubscribe"];
    if (res != null) {
      res.forEach(data => {
        let flag = false;
        let r = data.replace(/{/, "").replace(/}/, "");
        fields.forEach(field => {
          if (r.toLowerCase() ===  (field.name).toLowerCase() ) {
            flag = true;
          }

        });

        if (flag == false) {
          fixedFields.forEach(field => {
            if (r.toLowerCase() === field.toLowerCase()) {
              flag = true
            }          
          });
        }
        if (flag == false) {
          msg += "Field " + r + " is not allowed.<br>"
        }

      });
    }
    return (msg == "") ? null : {"value": msg};
  }
}

export function validateCheckBox(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let checked = false;
    control.value.forEach(element => {
      if (element.checkBox == true) {
        checked = true;
      }
    });
    return checked ? null : {"value": "please select a user"};
  }
}

export function validateTag(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let error = false;
    if (control.value !== "") {
      if (!validateTagInput(control.value)) {
        error = true;
      }
    }
    return error ? {"value": "Invalid Tag"} : null;
  }
}

export function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validateName(name) {
  let re = /^[a-zA-Z\-'\s.']+$/;
  return re.test(name);
}

export function validateMobile(mobile) {
  let re = /^(\+\d{1,3}[- ]?)?\d{8,10}$/;
  return re.test(mobile);
}

export function validateTagInput(tag) {

  let re = /^[a-zA-Z0-9_\s]+$/;
  return re.test(tag);
}

export function validateFields(body, field) {
  let re = /^\\{(.*?)\\}$/;
  console.log(re.test(" ${field}"));
}
