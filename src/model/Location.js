import FieldContainer from './FieldContainer.js';

export default class Location extends FieldContainer {
  constructor (params, model) {
    super(model);
    this.id = params.id;
    this.set("name", params.name);
    this.set("image", params.image);
    this.set("description", params.description);
  }
}
