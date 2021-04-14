import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from 'src/app/_services/certificate.service';
import { ErrorService } from 'src/app/_services/error.service';
import { validateField } from 'src/app/_custome-validators/certificateForm.validator';
import { ConfigService } from 'src/app/_services/config.service';

@Component({
  selector: 'app-certificate-template',
  templateUrl: './certificate-template.component.html',
  styleUrls: ['./certificate-template.component.css']
})
export class CertificateTemplateComponent implements OnInit {
  assets_loc;
  templateData;
  imageData;
  editable_fields_array: any[];
  instructions;
  fields;
  fontThemes: any[] = [];
  editable_fields: any[] = [];
  certificateTemplateForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private certificateService: CertificateService, private errorService: ErrorService, private configService: ConfigService) {
    this.configService.loadConfigurations().subscribe(data => {
      this.assets_loc = data.assets_location;
    })
  }

  ngOnInit() {

    this.templateData = this.route.snapshot.data.templateData;

    this.imageData = this.templateData.certificate_image.data;
    this.instructions = this.templateData.instructions;
    this.editable_fields_array = this.templateData.instructions.editable_fields;
    this.fields = this.route.snapshot.data.fields;
    this.fontThemes = this.templateData.instructions.themes;

    this.certificateTemplateForm = this.fb.group({
      name: [this.templateData.name, []],
      fontTheme: ['1']
    });
    this.editable_fields_array.forEach(element => {
      if (element.type != "logo" && element.type != "signature") {
        let type: string = element.type;
        let label = element.label;
        let valueString: string = element.value;
        let path: any[] = valueString.split(".");
        let value = this.instructions[path[0]][path[1]];
        let formControl: FormControl = new FormControl(value, []);
        if (type == "body") {
          value = this.instructions[path[0]][path[1]][path[2]][path[3]];
          formControl = new FormControl(value, [validateField(this.fields)]);
        }


        this.editable_fields.push({
          "type": element.type,
          "value": value,
          "label": label,
          "instruction": element.instruction
        })

        this.certificateTemplateForm.addControl(label, formControl);

      } else {
        let formControl: FormControl = new FormControl('', []);
        this.certificateTemplateForm.addControl(element.label, formControl);
        this.editable_fields.push({
          "type": element.type,
          "instruction": element.instruction
        })
      }
    });
  }

  update() {
    this.editable_fields_array.forEach(element => {
      if (element.type != "logo" && element.type != "signature") {
        let type: string = element.type;
        let label = element.label;
        let valueString: string = element.value;
        let path: any[] = valueString.split(".");
        if (type == "body") {
          this.instructions[path[0]][path[1]][path[2]][path[3]] = this.certificateTemplateForm.controls[label].value;
        } else {
          this.instructions[path[0]][path[1]] = this.certificateTemplateForm.controls[label].value;
        }
      }


    });
    let id = this.route.snapshot.paramMap.get('id');
    let data = {
      "name": this.certificateTemplateForm.controls['name'].value,
      "instructions": this.instructions
    };

    this.certificateService.updateCertificateTemplate(id, data).subscribe(data => {
      this.templateData = data;
      this.imageData = data.certificate_image.data;
      this.errorService.setErrorVisibility(false, "");
    })
  }

  handleLogoUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      let data = {
        "type": 0,
        "data": btoa(reader.result.toString())
      }
      this.instructions['logo']['image']['data'] = btoa(reader.result.toString());

    };
  }

  handleSignUpload(event) {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {

      let data = {
        "type": 0,
        "data": btoa(reader.result.toString())
      }

      this.instructions['signature']['image']['data'] = btoa(reader.result.toString());

    };

  }


  updateTheme() {
    let templateId = this.route.snapshot.paramMap.get('id');
    let fontThemeId = this.certificateTemplateForm.controls['fontTheme'].value
    this.certificateService.updateTheme(templateId, fontThemeId).subscribe(data => {
      this.templateData = data;
      this.instructions = this.templateData.instructions;
      this.imageData = data.certificate_image.data;
      this.errorService.setErrorVisibility(false, "");
    })
  }

}
