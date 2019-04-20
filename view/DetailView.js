import * as $ from 'jquery'
import FieldViewFactory from './FieldViewFactory.js';

export default class DetailView {
  constructor($htmlParent, entity, control){
    this.$htmlParent = $htmlParent;
    this.entity = entity;
    this.control = control;
  }

  display() {
    if (! this.entity) {
      return
    }
    this.createHeadline();
    this.createContent();
  }

  createHeadline(){
    this.$htmlParent.append(`<h2 class="storyItem">${this.entity.constructor.name}: ${this.entity.get('name')}</h2>`);
  }

  createContent() {
    let $storyItem = $(`<div class="storyItem"></div>`);
    let c = 0;
    let e = this.entity;
    let control = this.control;

    e.fields.forEach(function(v, fieldType ){
      let id = "viewField_" + c++;
      let fv = FieldViewFactory.makeFormField(id, fieldType, e, control);
      if ( fieldType.name === 'image'){
        $storyItem.prepend(fv.assembleView());
        $storyItem.addClass("withImage");
      }
      else {
        $storyItem.append(fv.assembleView());
      }
    });

    let $link = $(`<a class="edit">edit</a>`);
    $link.click(function(){ control.edit(e); });
    $storyItem.append($link);

    this.$htmlParent.append($storyItem);
  }
}
