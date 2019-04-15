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
  MAIN_CHARACTER: Symbol("Main Character"),
  INFLUENCE_CHARACTER: Symbol("Influence Character")
};
Object.freeze(throughlines);

class FieldContainer {
  constructor() {
    this.fields = new Map();
  }

  get(fieldName){
    return this.fields.get(model.fields.get(fieldName));
  }

  set(fieldName, value) {
    this.fields.set(model.fields.get(fieldName), value);
  }
}

class Field {
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
    this.locations.set(location.id, location);
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

class Location extends FieldContainer {
  constructor (params) {
    super();
    this.id = params.id;
    this.set("name", params.name);
    this.set("image", params.image);
    this.set("description", params.description);
  }
}

class Value extends FieldContainer {
  constructor(name) {
    super();
    this.set("name", name);
  }
}

class Scene extends FieldContainer{
  constructor(params,
            characters,
            location,
            type,
            throughline,
            image,
            values) {
    super();

    this.active = false;
    this.t = params.t || 0.5;
    this.values = values || new Map();

    this.set("name", params.name);
    this.set("description", params.description);
    this.set("conflict", params.description);
    this.set("location", location );
    this.set("characters", characters || []);
    this.set("throughline", throughline || throughlines.OBJECTIVE);
    this.set("type", type || SceneTypeNames.REGULAR_SCENE);
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

class Character extends FieldContainer {
  constructor (params, archetype) {
    super();
    this.id = params.id;
    this.set("image", params.image);
    this.set("archetype", archetype);
    this.set("name", params.name);
    this.set("description", params.description);
    this.set("purpose", params.purpose);
    this.set("motivation", params.motivation);
    this.set("methodology", params.methodology);
    this.set("evaluation", params.evaluation);
    this.set("biography", params.biography);
  }
}
