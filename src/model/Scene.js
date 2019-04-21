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
    this.values = values || new Map();

    this.set("name", params.name);
    this.set("description", params.description);
    this.set("conflict", params.description);
    this.set("location", location );
    this.set("characters", characters || []);
    this.set("type", type || model.sceneTypes[0]);
    this.set("image", image || "");
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
