import Model from './Model';
import Field from './Field';

export default class FieldContainer {
  fields :Map<Field, any>;
  model :Model;
  className :string;
  id :string;
  persistent: boolean;
  colorKey: boolean;

  constructor(model :Model) {
    this.fields = new Map<Field, any>();
    this.model = model;
    this.persistent = false;
    this.colorKey= false;
  }

  get(fieldName :string){
    return this.fields.get(this.model.fields.get(fieldName));
  }

  set(fieldName :string, value :any) {
    this.fields.set(this.model.fields.get(fieldName), value);
  }

  makePersistent() {
    this.persistent = true;
  }

  setColorKey() {
    this.colorKey = true;
  }

  removeColorKey() {
    this.colorKey = false;
  }

  toggleColorKey() {
    this.colorKey = !this.colorKey;
  }
}
