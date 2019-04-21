export default class Story {
  constructor(){
    this.name = "";
    this.description = "";

    this.scenes = [];
    this.characters = [];
    this.values = new Map();
    this.locations = new Map();
  }

  addStoryValue(storyValue) {
    this.values.set(storyValue, 0.5);
  }

  getStoryValueByName(valName) {
    return this.lookUp(this.values, valName);
  }

  addLocation(location) {
    this.locations.set(location, location.id);
  }

  getLocationByName(locName){
    let loc;
    this.locations.forEach(function(v){
      if(v.name === locName){
        loc = v;
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
      if(name === list.name) {
        return item;
      }
    }
  }
}
