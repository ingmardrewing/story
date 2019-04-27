import FieldContainer from './FieldContainer';
import Character from './Character';
import Model from './Model';
import Value from './Value';
import SceneSprite from '../view/SceneSprite';

export default class Scene extends FieldContainer{
  active :boolean;
  t :number;
  values :Map<Value, number>;
  characters :Array<Character>;
  sprite :SceneSprite;

  constructor(params :any,
            characters :Array<Character>,
            location :Location,
            type :any,
            throughline :any,
            image :string,
            values :Map<Value, number>,
            model :Model) {
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

  addCharacter(char :Character) {
    this.characters.push(char);
  }

  addValue(value :Value, amount :number){
    this.values.set(value, amount);
  }

  setSprite(sprite :SceneSprite) {
    this.sprite = sprite;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
