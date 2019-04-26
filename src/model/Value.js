import FieldContainer from './FieldContainer.js';

export default class Value extends FieldContainer {
  constructor(name, model) {
    super(model);
    this.set("name", name);
    this.className = "Value";
  }
}
