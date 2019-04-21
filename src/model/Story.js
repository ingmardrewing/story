import FieldContainer from './FieldContainer.js';

export default class Story extends FieldContainer {
  constructor(name, description, model){
    super(model);
    this.set("name", name);
    this.set("description", description);

    this.scenes = [];
    this.characters = [];
    this.values = new Map();
    this.locations = new Map();
  }

  addStoryValue(storyValue) {
    this.values.set(storyValue, 0.5);
  }

  getValueByName(name) {
    let r = false;
    this.values.forEach(function(v, k){
     if( k.get("name") === name ){
       r = true;
      }
    });
    return r;
  }

  addLocation(location) {
    this.locations.set(location, location.id);
  }

  getLocationByName(locName){
    let loc;
    this.locations.forEach(function(v, l){
      if(l.get("name") === locName){
        loc = l;
      }
    });
    return loc;
  }

  addCharacter(char) {
    this.characters.push(char);
  }

  getCharacterByName(charName) {
    return this.lookUp(this.characters, charName);
  }

  addScene(scene) {
    this.scenes.push(scene);
  }

  getScenes() {
    return this.scenes;
  }

  lookUp(list, name) {
   for (let item of list) {
      if(item.get && name === item.get("name")) {
        return item;
      }
    }
  }
}
