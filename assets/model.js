const SceneTypeNames = {
  INCITING_INCIDENT: Symbol("Inciting Incident"),
  PLOT_POINT_I: Symbol("Plot Point 1"),
  CENTRAL_POINT: Symbol("Central Point"),
  PLOT_POINT_II: Symbol("Plot Point 2"),
  CLIMAX: Symbol("Climax"),
  REGULAR_SCENE: Symbol("Regular Scene")
};
Object.freeze(SceneTypeNames);

const characterArchetypes = {
  COMPLEX: Symbol("Complex"),

  PROTAGONIST: Symbol("Protagonist"),
  SIDEKICK: Symbol("Sidekick"),
  GUARDIAN: Symbol("Guardian"),
  REASON: Symbol("Reason"),

  ANTAGONIST: Symbol("Antagonist"),
  SCEPTIC: Symbol("Sceptic"),
  CONTAGONIST: Symbol("Contagonist"),
  EMOTIONAL: Symbol("Emotional")
}
Object.freeze(characterArchetypes);

const throughlines = {
  OBJECTIVE: Symbol("Objective"),
  RELATIONSHIP: Symbol("Relationship"),
  MAIN_CHARACTER: Symbol("Main Charachter"),
  INFLUENCE_CHARACTER: Symbol("Influence Character")
};
Object.freeze(throughlines);

class Model {
  story;

  constructor(){
    this.story = new Story();
  }

  getScenes() {
    return this.story.getScenes();
  }

  getSceneTypeByName(sceneTypeName) {
    for( let typeName in SceneTypeNames) {
      if (typeName === sceneTypeName) {
        return SceneTypeNames[sceneTypeName];
      }
    }
    return SceneTypeNames.REGULAR_SCENE;
  }

  sort() {
    this.story.scenes.sort(function(a,b){
      return a.t - b.t;
    });
  }
}

class Story {
  name;
  description;

  scenes;
  characters;
  values = new Map();
  locations;

  constructor(){
    this.locations = [];
    this.scenes = [];
    this.values = new Map();
    this.characters = [];
  }

  addStoryValue(storyValue) {
    this.values.set(storyValue, 0.5);
  }

  getStoryValueByName(valName) {
    return this.lookUp(this.values, valName);
  }

  addLocation(location) {
    this.locations.push(location);
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

class Location {
  name;
  image;
  description;

  constructor (params) {
    this.name = params.name;
    this.image = params.image;
    this.description = params.description;
  }
}

class Value {
  name;
  constructor(name) {
    this.name = name;
  }
}

class Scene {
  t;
  values = new Map();
  active = false;

  name;
  description;
  conflict;
  image;

  location ;
  throughline;
  characters = [];

  type = SceneTypeNames.REGULAR_SCENE;

  sprite;

  constructor(params,
            characters,
            location,
            type,
            throughline,
            image,
            values) {
    this.name = params.name;
    this.description= params.description;
    this.t = params.t;
    this.location = location;
    this.characters = characters;
    this.throughline = params.throughline;
    this.values = values;
    this.type = type;
    this.image = image;
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

class Character {
  archetype;
  name;
  purpose;
  evaluation;
  methodology;
  motivation;
  biogaphy;
  image;

  constructor (params, archetype) {
    this.id = params.id;
    this.name = params.name;
    this.purpose = params.purpose;
    this.motivation = params.motivation;
    this.methodology= params.methodology;
    this.evaluation = params.evaluation;
    this.biography = params.biography;
    this.image = params.image;
    this.archetype = archetype ;
  }
}

