import FieldContainer from './FieldContainer';
import Model from './Model';

export default class Location extends FieldContainer {
  constructor (params :any, model :Model) {
    super(model);
    this.id = params.id;
    this.className = "Location";
    this.set("name", params.name);
    this.set("image", params.image);
    this.set("description", params.description);
  }
}
