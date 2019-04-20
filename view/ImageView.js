import * as $ from 'jquery'
import FieldView from './FieldView.js'

export default class ImageView extends FieldView {
  assembleInput(){
    let id = this.id + "picker";
    let $imagePicker = $(`<input type="file" id="${id}">`);

    $imagePicker.change(function(){
      let r = new FileReader();
      r.addEventListener("load"),function() {
        $(id).val(r.result)
      }
      r.readAsDataUrl(this.files[0]);
    });

    //$imagePicker.add(`<input class="formInput" name="${this.id}" id="${this.id}" type="text" value="${this.fieldValue() || ''}" />`);
    return $imagePicker;
  }

  assembleView() {
    if (this.fieldValue()){
     $(`<div class="imgContainer"><img src="${this.fieldValue()}"></div>`);
    }
    return "";
  }
}
