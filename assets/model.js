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
    console.log(scene.type);
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

  throughlines = {
    OBJECTIVE: Symbol("objective"),
    RELATIONSHIP: Symbol("relationship"),
    MAIN_CHARACTER: Symbol("main charachter"),
    INFLUENCE_CHARACTER: Symbol("influence character")
  };

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

  limitKeyScenes() {

  }
}

class StoryValue {
  name;
  constructor(name) {
    this.name = name;
  }
}

const TypeNames = {
  INCITING_INCIDENT: "Inciting Incident",
  PLOT_POINT_I: "Plot Point 1",
  CENTRAL_POINT: "Central Point",
  PLOT_POINT_II: "Plot Point 2",
  CLIMAX: "Climax",
  REGULAR_SCENE: "Regular Scene"
};
Object.freeze(TypeNames);

class Scene {
  lowerLimit = 0;
  upperLimit = 1;

  t;
  values;
  dragged = false;

  title;
  description;
  location;
  characters;
  conflict;
  throughline;
  type = TypeNames.REGULAR_SCENE;

  constructor(params, characters, location) {
    this.title = params.title;
    this.description= params.description;
    this.t = params.t;
    this.location = location;
    this.characters = characters;
    this.throughline = params.throughline;
    this.values = params.values;
  }

  addCharacter(char) {
    this.characters.push(char);
  }
}

class IncitingIncident extends Scene { 
  type = TypeNames.INCITING_INCIDENT;
  lowerLimit = 0;
  upperLimit = 0.25;
}

class PlotPoint1 extends Scene { 
  type = TypeNames.PLOT_POINT_I;
  lowerLimit = 0.25;
  upperLimit = 0.25;
}

class CentralPoint extends Scene { 
  type = TypeNames.CENTRAL_POINT;
  lowerLimit = 0.5;
  upperLimit = 0.5;
}

class PlotPoint2 extends Scene { 
  type = TypeNames.PLOT_POINT_II;
  lowerLimit = 0.75;
  upperLimit = 0.75;
}

class Climax extends Scene { 
  type = TypeNames.CLIMAX;
  lowerLimit = 0.75;
  upperLimit = 1;
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

