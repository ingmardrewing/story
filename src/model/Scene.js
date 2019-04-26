import FieldContainer from './FieldContainer.js';

export default class Scene extends FieldContainer{
  constructor(params,
            characters,
            location,
            type,
            throughline,
            image,
            values,
            model) {
    super(model);

    this.active = false;
    this.t = params.t || 0.5;
    this.className = "Scene";

    this.set("name", params.name);
    this.set("image", params.image);
    this.set("description", params.description);
    this.set("conflict", params.conflict);
    this.set("methodology", params.methodology);
    this.set("evaluation", params.evaluation);
    this.set("purpose", params.purpose);
    this.set("motivation", params.motivation);
    this.set("biography", params.biography);

    this.set("characters", characters || []);
    this.set("location", location );
    this.set("type", type || model.sceneTypes[0]);
    this.set("throughline", throughline || "");
    this.values = values || new Map();
  }

  addCharacter(char) {
    this.characters.push(char);
  }

  addValue(valueObj, value){
    this.values.set(valueObj, value)
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
