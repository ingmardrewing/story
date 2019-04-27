import Model from './Model';
import Field from './Field';

export default class FieldContainer {
  fields :Map<Field, any>;
  model :Model;
  className :string;
  id :string;

  constructor(model :Model) {
    this.fields = new Map<Field, any>();
    this.model = model;
  }

  get(fieldName :string){
    return this.fields.get(this.model.fields.get(fieldName));
  }

  set(fieldName :string, value :any) {
    this.fields.set(this.model.fields.get(fieldName), value);
  }
}
