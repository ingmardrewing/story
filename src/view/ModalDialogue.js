import * as $ from 'jquery'
import FieldViewFactory from './FieldViewFactory.js';

export default class ModalDialogue {
  constructor(name, $htmlBody, entity, control){
    this.overlay = "";
    this.form = "";
    this.fields = [];
    this.idcounter = 0;
    this.name= name;
    this.$htmlBody = $htmlBody;

    let formFields = this.fields;
    let c = this.idcounter;
    entity.fields.forEach(function(v, fieldType){
      let id = "modalField_" + c++;
      formFields.push(
       FieldViewFactory.makeFormField(id, fieldType, entity, control)
      );
    });
  }

  open() {
    this.assembleForm();
    this.assembleOverlay();
    this.displayOverlay();
  }

  assembleForm() {
		let $div = $(`<div class="formGrid">`);
		this.$form = $(`<form class="overlayForm">`);
		this.$form.append($div);

    for (let f of this.fields) {
			let html = f.assembleHtml();
			console.log(html);
			$div.append(html);
    }
  }

  assembleOverlay() {
    let self = this;
    let $container = $(`<div class="formContainer">
      <h2>${this.name}</h2>
    </div>`);
		$container.append(this.$form);

    let $close = $(`<a class="close">cancel</a>`);
    $close.click(function(){
      self.removeOverlay();
    });
    $container.append($close)

    let $save = $(`<a class="save">save</a>`);
    $save.click(function(){
      self.save();
    });
    $container.append($save)

    this.$overlay = $(`<div class="overlay"></div>`);
    this.$overlay.append($container);
  }

  displayOverlay() {
    this.$htmlBody.append(this.$overlay);
  }

  removeOverlay() {
    this.$overlay.remove();
  }

  save(){
    for(let f of this.fields) {
      f.save();
    }
    this.removeOverlay();
  }
}
