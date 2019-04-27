import * as $ from 'jquery'
import Control from '../control/Control';
import FieldContainer from '../model/FieldContainer';

export default class ListItem {
  entity :FieldContainer;
  control: Control;

  constructor(entity :FieldContainer, control :Control){
    this.entity = entity;
    this.control = control;
  }

  renderJQuery() {
    let $item = $(`<div class="storyItem"></div>`);
    for (let action of ['select', 'edit', 'delete']) {
      $item.append(this.createButtonFor(action));
    }
    return $item;
  }

  createButtonFor(action :string) {
    let label = action === 'select' ? this.entity.get("name"): action;
    let button = $(`<a class="${action}">${label}</a>`)
    let entity = this.entity;
    let control :Control = this.control

    button.click(function(){
      if (action === "select"){
        control.select(entity);
      }
      if (action === "edit"){
        control.edit(entity);
      }
      if (action === "delete"){
        control.delete(entity);
      }
    });
    return button;
  }
}
