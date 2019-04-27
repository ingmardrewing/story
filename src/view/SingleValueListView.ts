import * as $ from 'jquery'
import FieldView from './FieldView'

export default class SingleValueListView extends FieldView {
  assembleInput(){
    return `<select id="${this.id}" name="${this.id}">${this.options()}</select>`
  }

  options() {
    let options = "";
    let self = this;

    this.dataField.characteristic.forEach(function(v:any, k:any){
      let obj = v.id ? v : k;
      let selected = '';
      if(self.fieldValue()){
        selected = self.fieldValue().id === obj.id ? ' selected="selected"' : '';
      }
      options += `<option value="${obj.id}"${selected}>${obj.get("name")}</option>`
    });
    return options;
  }

  findSelected() {
    let identifier = $('#' + this.id).val();
    let res;
    this.dataField.characteristic.forEach(function(v:any,k:any){
      let obj = v.id ? v : k;
      if(obj.id === identifier) {
        res = obj;
      }
    });
    return res;
  }

  save() {
    let selection = this.findSelected();
    this.control.updateModelField(
      this.entity,
      this.dataField,
      selection);
  }

  assembleView() {
    if(this.fieldValue()) {
      let val = this.fieldValue().get ? this.fieldValue().get("name") : '';
      if (val){
        return $(this.layout(this.dataField.label, val));
      }
    }
    return $('');
  }
}
