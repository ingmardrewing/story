import FieldView from './FieldView.js'

export default class LongTextView extends FieldView {
  assembleInput(){
    return `<textarea class="formInput" name="${this.id}" id="${this.id}" type="text">${this.fieldValue() || ''}</textarea>`;
  }
}
