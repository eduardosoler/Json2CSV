import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CSV } from 'src/models/csv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'json2csv';

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      'json': ['', Validators.compose([Validators.required])],
      'showHeaders': [true],
      'csv': [{ value: '', disabled: true }]
    })
  }

  //Submit do form e gerador de CSV
  gerar(value: { json: string, showHeaders: boolean }) {
    if (this.form.valid) {
      let json: any;
      try{
        json = JSON.parse(value.json);
      }catch(err){
        console.error(err);
        this.form.get('json').setErrors({'json': true});
        return;
      }


      try {
        let csv = new CSV();
        if (Array.isArray(json))
          csv.addArray(json);
        else
          csv.addObject(json);

        this.form.get('csv').setValue(csv.toString(value.showHeaders));
      } catch (err) {
        console.error(err);
        this.form.get('json').setErrors({'error': true});
      }
    }else{
      this.form.get('json').markAsTouched();
      this.form.get('json').markAsDirty();
    }
  }
}
