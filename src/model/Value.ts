import FieldContainer from './FieldContainer';
import Model from './Model';

export default class Value extends FieldContainer {
  constructor(name :any, model :Model) {
    super(model);
    this.set("name", name);
    this.className = "Value";
  }
}
