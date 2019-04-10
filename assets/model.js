class Model {
  story;

  constructor(){
    this.story = new Story();
  }

  addCharacter(char) {
    this.story.addCharacter(char);
  }

  getCharacterByName(charName) {
    return this.story.getCharacterByName(charName);
  }

  addStoryValue(value) {
    this.story.addStoryValue(value);
  }

  getStoryValueByName(valName) {
    return this.story.getStoryValueByName(valName);
  }

  getValuesObject() {
    let vo = {};
    for(let v of this.story.values) {
      vo[v.name] = 0;
    }
    return vo;
  }

  addLocation(location) {
    this.story.addLocation(location)
  }

  getLocationByName(locName) {
    return this.story.getLocationByName(locName);
  }

  addScene(scene) {
    this.story.addScene(scene);
  }

  getScenes() {
    return this.story.getScenes();
  }
}

class Location {
  name;
  constructor (name) {
    this.name = name;
  }
}

class Story {
  title;
  description;

  scenes;
  characters;
  values;
  locations;

  constructor(){
    this.locations = [];
    this.scenes = [];
    this.values = [];
    this.characters = [];
  }

  addStoryValue(storyValue) {
    this.values.push(storyValue);
  }

  getStoryValueByName(valName) {
    return this.lookUp(this.values, valName);
  }

  addLocation(location) {
    this.lcoation.push(location);
  }

  getLocationByName(locName){
    return this.lookUp(this.locations, locName);
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

class StoryValue {
  name;
  constructor(name) {
    this.name = name;
  }
}

class Scene {
  t;
  title;
  description;
  location;
  characters;
  values;
  conflict;
  dragged = false;

  constructor(params, characters, location) {
    this.title = params.title;
    this.description= params.description;
    this.t = params.t;
    this.location = location;
    this.characters = characters;
    this.values = params.values;
  }

  addCharacter(char) {
    this.characters.push(char);
  }
}

const characterArchetypes = {
      COMPLEX: Symbol("complex"),

      PROTAGONIST: Symbol("protagonist"),
      SIDEKICK: Symbol("sidekick"),
      GUARDIAN: Symbol("guardian"),
      REASON: Symbol("reason"),

      ANTAGONIST: Symbol("antagonist"),
      SCEPTIC: Symbol("sceptic"),
      CONTAGONIST: Symbol("contagonist"),
      EMOTIONAL: Symbol("emontional")
}
Object.freeze(characterArchetypes);

class Character {
  archetype;
  name;
  purpose;
  evaluation;
  methodology;
  motivation;
  biogaphy;

  contructor (params) {
    ch.name = params.name;
    ch.purpose = params.purpose;
    ch.motivation = params.motivation;
    ch.methodology= params.methodology;
    ch.evaluation = params.evaluation;
    ch.biography = params.biography;
    ch.archetype = ch.selectArchetypeByString(params.achetype)
  }

  static archetypeByString(archName) {
    for (let at in characterArchetypes) {
      if(at === archName) {
        return at;
      }
    }
  }
}

