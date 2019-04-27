import Story from './Story';
import Enumish from './Enumish';

import Field from './ShortText';
import ShortText from './ShortText';
import LongText from './LongText';
import Image from './Image';
import MultipleValueList from './MultipleValueList';
import SingleValueList from './SingleValueList';

export default class Model {
  sceneTypeNames :any;
  story :Story;
  sceneTypes :any;
  characterArchetypes :any;
  throughlines :any;
  fields :Map<string, Field>;

  constructor() {
    this.sceneTypeNames = {
      REGULAR_SCENE: "Regular Scene",
      INCITING_INCIDENT: "Inciting Incident",
      PLOT_POINT_1: "Plot Point 1",
      CENTRAL_POINT: "Central Point",
      PLOT_POINT_2: "Plot Point 2",
      CLIMAX: "Climax"
    }
    this.initGenericFields();
    this.story = new Story("New Story", "...", this);
    this.initLists();
  }

  initLists() {
    this.sceneTypes = [
      new Enumish("st01",this.sceneTypeNames.REGULAR_SCENE),
      new Enumish("st02",this.sceneTypeNames.INCITING_INCIDENT),
      new Enumish("st03",this.sceneTypeNames.PLOT_POINT_1),
      new Enumish("st04",this.sceneTypeNames.CENTRAL_POINT),
      new Enumish("st05",this.sceneTypeNames.PLOT_POINT_2),
      new Enumish("st06",this.sceneTypeNames.CLIMAX)
    ];
    this.characterArchetypes = [
      new Enumish("ca01","Complex"),
      new Enumish("ca02","Protagonist"),
      new Enumish("ca03","Sidekick"),
      new Enumish("ca04","Guardian"),
      new Enumish("ca05","Reason"),
      new Enumish("ca06","Antagonist"),
      new Enumish("ca07","Sceptic"),
      new Enumish("ca08","Contagonist"),
      new Enumish("ca09","Emotional")
    ];
    this.throughlines = [
      new Enumish("tl01","Objective"),
      new Enumish("tl02","Relationship"),
      new Enumish("tl03","Main Character"),
      new Enumish("tl04","Influence Character")
    ];
  }

  initGenericFields() {
    this.fields = new Map<string, Field>();
    this.fields.set(
      "image",
      new Image(
        "image",
        "Image",
        "The url of an image or the image as data url",
        null));
    this.fields.set(
      "name",
      new ShortText(
        "name",
        "Name",
        "The name of this element of the story",
        null));
    this.fields.set(
      "description",
      new LongText(
        "description",
        "Description",
        "An elaborate description, containing details not conveyed by the name",
        null));
    this.fields.set(
      "conflict",
      new ShortText(
        "conflict",
        "Conflict",
        "The conflict shown within the scene",
        null));
  }

  initFields() {
        this.fields.set(
      "type",
      new SingleValueList(
        "type",
        "Scenetype",
        "The type of the scene as one of 'Inciting Incident', 'Plot Point I', 'Central Point', 'Plot Point II', 'Climax'",
        this.sceneTypes));
    this.fields.set(
      "characters",
      new MultipleValueList(
        "characters",
        "Characters",
        "The characters involved in the scene",
        this.story.characters));
    this.fields.set(
      "location",
      new SingleValueList(
        "location",
        "Location",
        "The location where a scenes takes place",
        this.story.locations));
    this.fields.set(
      "throughline",
      new SingleValueList(
        "throughline",
        "Throughline",
        "The throughline of the scene",
        this.throughlines));
    this.fields.set(
      "archetype",
      new SingleValueList(
        "archetype",
        "Archetype",
        "Character archetype",
        this.characterArchetypes));
    this.fields.set(
      "purpose",
      new LongText(
        "purpose",
        "Purpose",
        "The character's purpose",
        null));
    this.fields.set(
      "motivation",
      new LongText(
        "motivation",
        "Motivation",
        "The character's motivation,i.e. the emotions and their source driving the character",
        null));
    this.fields.set(
      "methodology",
      new LongText(
        "methodology",
        "Motivation",
        "The kind of methods the characters uses to achieve his goals",
        null));
    this.fields.set(
      "evaluation",
      new LongText(
        "evaluation",
        "Evaluation",
        "The way the character judges the outcome of events",
        null));
    this.fields.set(
      "biography",
      new LongText(
        "biography",
        "Biography",
        "The character's biography up to the starting point of the story",
        null));
    this.fields.set(
      "stressResponse",
      new LongText(
        "stressResponse",
        "Stress Response","The way the character acts under stress",
        null));
  }

  getScenes() {
    return this.story.getScenes();
  }

  getSceneTypeByName(name :string) {
    for(let type of this.sceneTypes) {
      if (type.name === name) {
        return type;
      }
    }
    return this.sceneTypes[0];
  }

  sort() {
    this.story.scenes.sort(function(a,b){
      return a.t - b.t;
    });
  }
}
