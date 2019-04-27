import FieldContainer from './FieldContainer';
import Model from './Model';
import Value from './Value';
import Location from './Location';
import Character from './Character';
import Scene from './Scene';

export default class Story extends FieldContainer {
  values :Map<Value, number>;
  locations :Map<Location, string>;
  characters :Array<Character>;
  scenes :Array<Scene>;

  constructor(name :string, description :string, model :Model){
    super(model);
    this.set("name", name);
    this.set("description", description);

    this.scenes = [];
    this.characters = [];
    this.values = new Map<Value, number>();
    this.locations = new Map<Location, string>();
  }

  addStoryValue(storyValue :Value) {
    this.values.set(storyValue, 0.5);
  }

  getValueByName(name :string) {
    let r = false;
    this.values.forEach(function(n :number, v :Value, m :Map<Value, number>){
     if( v.get("name") === name ){
       r = true;
      }
    });
    return r;
  }

  addLocation(location :Location) {
    this.locations.set(location, location.id);
  }

  getLocationByName(locName :string){
    let loc;
    this.locations.forEach(function(v, l){
      if(l.get("name") === locName){
        loc = l;
      }
    });
    return loc;
  }

  addCharacter(char :Character) {
    this.characters.push(char);
  }

  getCharacterByName(charName :string) {
    return this.lookUp(this.characters, charName);
  }

  addScene(scene :Scene) {
    this.scenes.push(scene);
  }

  getScenes() {
    return this.scenes;
  }

  lookUp(list :Array<any>, name :string) {
   for (let item of list) {
      if(item.get && name === item.get("name")) {
        return item;
      }
    }
  }
}
