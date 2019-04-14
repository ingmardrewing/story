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

class Field {
  name;
  label;
  description;
  characteristic;

  constructor(name, label, description, characteristic) {
    this.name = name;
    this.label = label;
    this.description = description;
    this.characteristic = characteristic;
  }
}

class ShortText extends Field {}
class LongText extends Field {}
class SingleValueList extends Field {}
class MultipleValueList extends Field {}

class Model {
  story;
  fields;

  constructor() {
    this.story = new Story();
    this.initFields();
  }

  initFields() {
    this.fields = new Map();
    this.fields.set("image", new ShortText("image", "Image", "The url of an image or the image as data url"));
    this.fields.set("name", new ShortText("name", "Name", "The name of this element of the story"));
    this.fields.set("description", new LongText("description", "Description", "An elaborate description, containing details not conveyed by the name"));

    this.fields.set("conflict", new ShortText("conflict", "Conflict", "The conflict shown within the scene"));
    this.fields.set("type", new SingleValueList("type", "Scenetype", "The type of the scene as one of 'Inciting Incident', 'Plot Point I', 'Central Point', 'Plot Point II', 'Climax'", SceneTypeNames));
    this.fields.set("characters", new MultipleValueList("characters", "Characters", "The characters involved in the scene", this.story.characters));
    this.fields.set("location", new SingleValueList("location", "Location", "The location where a scenes takes place", this.story.locations));
    this.fields.set("throughline", new SingleValueList("throughline", "Thgroughline", "The throughline of the scene", throughlines));

    this.fields.set("archetype", new SingleValueList("archetype", "Archetype", "Character archetype", characterArchetypes));
    this.fields.set("purpose", new LongText("purpose", "Purpose", "The character's purpose"));
    this.fields.set("motivation", new LongText("motivation", "Motivation", "The character's motivation, i.e. the emotions and their source driving the character"));
    this.fields.set("methodology", new LongText("methodology", "Motivation", "The kind of methods the characters uses to achieve his goals"));
    this.fields.set("evaluation", new LongText("evaluation", "Evaluation", "The way the character judges the outcome of events"));
    this.fields.set("biography", new LongText("biography", "Biography", "The character's biography up to the starting point of the story"));
    this.fields.set("stressResponse", new LongText("stressResponse", "Stress Response", "The way the character acts under stress"));
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
  values;
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

  fields = new Map();

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
    this.fields.set()

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

  fields = new Map();

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

    this.fields.set(model.fields.get("image"), params.image);
    this.fields.set(model.fields.get("archetype"), archetype);
    this.fields.set(model.fields.get("name"), params.name);
    this.fields.set(model.fields.get("description"), params.description);
    this.fields.set(model.fields.get("purpose"), params.purpose);
    this.fields.set(model.fields.get("motivation"), params.motivation);
    this.fields.set(model.fields.get("methodology"), params.methodology);
    this.fields.set(model.fields.get("evaluation"), params.evaluation);
    this.fields.set(model.fields.get("biography"), params.biography);
  }
}

