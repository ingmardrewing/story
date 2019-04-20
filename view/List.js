import * as $ from 'jquery'
import ListItem from './ListItem.js';

export default class List {
  constructor($container, headline, entities, addLabel, addFunction, control){
    this.$container = $container;
    this.headline = headline;
    this.entities = entities;
    this.addLabel = addLabel;
    this.addFunction = addFunction;
    this.control = control;
  }

  render(){
    this.createHeadline();
    this.createList();
    this.createAdd();
  }

  createHeadline(){
    this.$container.append(`<h2 class="storyItem">${this.headline}</h2>`);
  }

  createList(){
    let $c = this.$container;
    let control = this.control;
    this.entities.forEach(function(k,v){
      let l = new ListItem(v.get ? v : k, control);
      $c.append(l.renderJQuery());
    });
  }

  createAdd(){
    let $btn = $(`<a class="storyItem storyItemAdd">${this.addLabel}</a>`)
    let control = this.control;
    $btn.click(this.addFunction.call(control));
    this.$container.append($btn);
  };
}
