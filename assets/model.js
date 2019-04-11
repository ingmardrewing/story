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
  COMPLEX: Symbol("complex"),

  PROTAGONIST: Symbol("protagonist"),
  SIDEKICK: Symbol("sidekick"),
  GUARDIAN: Symbol("guardian"),
  REASON: Symbol("reason"),

  ANTAGONIST: Symbol("antagonist"),
  SCEPTIC: Symbol("sceptic"),
  CONTAGONIST: Symbol("contagonist"),
  EMOTIONAL: Symbol("emotional")
}
Object.freeze(characterArchetypes);

const throughlines = {
  OBJECTIVE: Symbol("objective"),
  RELATIONSHIP: Symbol("relationship"),
  MAIN_CHARACTER: Symbol("main charachter"),
  INFLUENCE_CHARACTER: Symbol("influence character")
};
Object.freeze(throughlines);

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
  values;

  active = false;
  title;
  description;
  location;
  characters;
  conflict;
  throughline;
  type = SceneTypeNames.REGULAR_SCENE;

  constructor(params, characters, location, type, throughline) {
    this.title = params.title;
    this.description= params.description;
    this.t = params.t;
    this.location = location;
    this.characters = characters;
    this.throughline = params.throughline;
    this.values = params.values;
    this.type = type;
  }

  addCharacter(char) {
    this.characters.push(char);
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

  contructor (params) {
    this.name = params.name;
    this.purpose = params.purpose;
    this.motivation = params.motivation;
    this.methodology= params.methodology;
    this.evaluation = params.evaluation;
    this.biography = params.biography;
    this.archetype = this.selectArchetypeByString(params.achetype)
  }

  static archetypeByString(archName) {
    for (let at in characterArchetypes) {
      if(at === archName) {
        return at;
      }
    }
  }
}

