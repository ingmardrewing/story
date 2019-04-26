import * as $ from 'jquery';

export default class FieldView {
  constructor(id, dataField, entity, control){
    this.id = id;
    this.dataField = dataField;
    this.entity = entity;
    this.control = control;
  }

  fieldValue() {
    return this.entity.fields.get(this.dataField);
  }

  assembleHtml() {
    let input = this.assembleInput();
    return `<label class="formLabel" for="${this.id}">${this.dataField.label}</label>
          ${input}`;
  }

  assembleInput(){ return ""; }

  assembleView() {
    if(this.fieldValue()){
      return this.layout(this.dataField.label, this.fieldValue());
    }
    return '';
  }

  layout(label, value){
    return `<div>
        <div class="fieldLabel">${label}:</div>
        <div class="fieldValue">${value || ''}</div>
      </div>`;
  }

  save() {
    let value = $('#' + this.id).val();
    this.control.updateModelField(
      this.entity,
      this.dataField,
      value
    );
  }
}
