import * as $ from 'jquery';
import FieldView from './FieldView';

export default class MultipleValueListView extends FieldView {
  assembleInput(){
    let html = `<div>`;
    let preselected = this.fieldValue();
    this.dataField.characteristic.forEach(function(v :any, k:any, m:any){
      let checked = preselected.includes(v) ? ` checked="checked"` : '';
			if (v.get("name")) {
				html += `<div style="display:inline-block; margin-right: 10px; margin-bottom: 10px;"><input id="${v.id}" type="checkbox" name="${v.id}" value="${v.id}"${checked}><label for="${v.id}">${v.get("name")}</label></div>`
			}
    });
    html += `</div>`;

    return html;
  }

  assembleView() {
    let values = this.fieldValue();
    if (values && values.length > 0) {
      let names = [];
      for (let v of values) {
        names.push(v.get("name"));
      }
      return $(this.layout(this.dataField.label, names.join(', ')));
    }
    return $("");
  }

  save () {
    let newCharacters :Array<any>= [];
    this.dataField.characteristic.forEach(function(v:any, k:any, m:any){
      if($('#' + v.id).prop("checked")){
        newCharacters.push(v);
      }
    });
    this.control.updateModelField(
      this.entity,
      this.dataField,
      newCharacters
    );
  }
}
