import * as $ from 'jquery'

export default class ListItem {
  constructor(entity, control){
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

  createButtonFor(action) {
    let label = action === 'select' ? this.entity.get("name"): action;
    let button = $(`<a class="${action}">${label}</a>`)
    let entity = this.entity;
    let control = this.control

    button.click(function(){ 
      control[action](entity); 
    });
    return button;
  }
}
