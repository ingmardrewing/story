import * as $ from 'jquery'
import FieldViewFactory from './FieldViewFactory.js';
import DetailView from './DetailView.js';

export default class DetailViewConst extends DetailView {
  createHeadline(){
    let e = this.entity;
    let control = this.control;
    let $headlineContainer = $(`<h2 class="storyItem">${this.entity.constructor.name}: ${this.entity.get('name')}</h2>`);
    this.$htmlParent.append($headlineContainer);
  }
}
