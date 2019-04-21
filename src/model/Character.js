import FieldContainer from './FieldContainer.js';

export default class Character extends FieldContainer {
  constructor (params, archetype, model) {
    super(model);
    this.id = params.id;
    this.set("image", params.image);
    this.set("archetype", archetype);
    this.set("name", params.name);
    this.set("description", params.description);
    this.set("purpose", params.purpose);
    this.set("motivation", params.motivation);
    this.set("methodology", params.methodology);
    this.set("evaluation", params.evaluation);
    this.set("biography", params.biography);
  }
}
