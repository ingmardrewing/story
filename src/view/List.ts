import * as $ from 'jquery'
import ListItem from './ListItem';
import ListItemConst from './ListItemConst';
import Control from '../control/Control';
import FieldContainer from '../model/FieldContainer';

export default class List {
  $container :any;
  headline :string;
  entities :Map<any, any>;
  addLabel :string;
  addFunction :any;
  control :Control;

  constructor(
      $container :any,
      headline :string,
      entities :Map<any, any>,
      addLabel :string,
      addFunction :any,
      control :Control){
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
    this.entities.forEach(function(obj:FieldContainer, value:number){
      let l;
      if (obj.get("name") === "Suspense"){
        l = new ListItemConst(obj, control);
      }
      else {
        l = new ListItem(obj, control);
      }
      $c.append(l.renderJQuery());
    });
  }

  createAdd(){
    let $btn = $(`<a class="storyItem storyItemAdd">${this.addLabel}</a>`)
    let control = this.control;
    let addFn = this.addFunction;
    $btn.click(function(){
      addFn.call(control);
    });

    this.$container.append($btn);
  };
}
