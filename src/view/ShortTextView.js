import * as $ from 'jquery'
import FieldView from './FieldView.js'

export default class ShortTextView extends FieldView {
  assembleInput(){
    return `<input class="formInput" name="${this.id}" id="${this.id}" type="text" value="${this.fieldValue() || ''}" />`;
  }
}
