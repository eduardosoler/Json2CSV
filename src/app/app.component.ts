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
    //Se o formulário estiver válido
    if (this.form.valid) {

      //#region JSON para objeto

      let json: any;
      try{
        json = JSON.parse(value.json);
      }catch(err){
        console.error(err);
        this.form.get('json').setErrors({'json': true});
        return;
      }

      //#endregion

      //#region Objeto para CSV

      try {
        /* Estas classes que escrevi servem para converter uma matriz de valores
           em CSV os detalhes de como fiz estão comentados nela */
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

      //#endregion
    }else{
      this.form.get('json').markAsTouched();
      this.form.get('json').markAsDirty();
    }
  }
}
