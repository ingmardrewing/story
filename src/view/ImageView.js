import * as $ from 'jquery'
import FieldView from './FieldView.js'

export default class ImageView extends FieldView {


  assembleHtml(){
    let $html = $(`<label class="formLabel" for="${this.id}">${this.dataField.label}</label><input class="formInput" name="${this.id}" id="${this.id}" type="text" value="${this.fieldValue() || ''}" /><div></div>`);
    let id = this.id + "picker";
    let txtid = this.id;
    let $imagePicker = $(`<input type="file" id="${id}">`);
    $imagePicker.change(function(e){
      let reader = new FileReader();
      reader.addEventListener("load", function(loaded){
        $('#' + txtid).val(reader.result);
      }, false)
      reader.readAsDataURL(e.target.files[0]);
    });
    return $html.add($imagePicker);
  }

  assembleView() {
    if (this.fieldValue()){
     return $(`<div class="imgContainer"><img src="${this.fieldValue()}"></div>`);
    }
    return "";
  }
}
