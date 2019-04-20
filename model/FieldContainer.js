export default class FieldContainer {
  constructor(model) {
    this.fields = new Map();
    this.model = model;
  }

  get(fieldName){
    return this.fields.get(this.model.fields.get(fieldName));
  }

  set(fieldName, value) {
    this.fields.set(this.model.fields.get(fieldName), value);
  }
}
