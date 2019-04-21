import * as $ from 'jquery';
import CommandQueue from './CommandQueue.js';
import AddValueCommand from './AddValueCommand.js';
import DeleteValueCommand from './DeleteValueCommand.js';
import DeleteCharacterCommand from './DeleteCharacterCommand.js';
import DeleteSceneCommand from './DeleteSceneCommand.js';
import DeleteLocationCommand from './DeleteLocationCommand.js';
import AddCharacterCommand from './AddCharacterCommand.js';
import AddLocationCommand from './AddLocationCommand.js';
import AddSceneCommand from './AddSceneCommand.js';
import MoveSceneCommand from './MoveSceneCommand.js';
import RemoveSceneTypeCommand from './RemoveSceneTypeCommand.js';
import UpdateModelFieldCommand from './UpdateModelFieldCommand.js';
import ModalDialogue from '../view/ModalDialogue.js';
import Params from './Params.js';
import Story from '../model/Story.js';
import Location from '../model/Location.js';

export default class Control {
  constructor(model, service) {
    if (!model){
      console.error("Model missing")
    }
    this.model = model;
    this.service = service;
    this.characterCount = 0;
    this.locationCount = 0;
  }

  setView(view){
    if (!view) {
      console.error("View missing")
    }
    this.view = view;
    this.commandQueue = new CommandQueue(this.view);
  }

  

  select(entity){
    let v = this.view;
    switch(entity.constructor.name){
      case "Value": {
        v.scope = entity;
        v.updateDetailView(entity);
        v.update();
        break;
      }
      default: {
        v.updateDetailView(entity);
      }
    }
  }

  addValue(valueName) {
    if(this.model.story.getValueByName(valueName)) {
      return;
    }
    let params = this.getParams();
    params.valueName = valueName ? valueName : "New Value";
    this.commandQueue.addCommand(new AddValueCommand(params));
  }

  getLoadChangeListener() {
    let c = this;
    return function(e) {
      c.service.read.call(c.service,e);
    }
  }

  getLoadChangeListenerForImages() {
    let c = this;
    return function(e) {
      c.service.readImage.call(c.service,e);
    }
  }

  getSaveListener() {
		let service = this.service;
		let control = this;
		return function(e) {
			service.save(control.getStoryAsJson());
		}
  }

  delete(entity) {
    let params = this.getParams();
    switch(entity.constructor.name) {
      case "Value":{
        params.value = entity;
        this.commandQueue.addCommand(new DeleteValueCommand(params));
        break;
      }
      case "Character":{
        params.character= entity;
        this.commandQueue.addCommand(new DeleteCharacterCommand(params));
        break;
      }
      case "Location":{
        params.location = entity;
        this.commandQueue.addCommand(new DeleteLocationCommand(params));
        break;
      }
      case "Scene":{
        params.scene = entity;
        this.commandQueue.addCommand(new DeleteSceneCommand(params));
        break;
      }
    }
  }

  edit(entity) {
    if(!(entity && entity.constructor)){
      return;
    }

    let md = new ModalDialogue(
      `Edit ${entity.constructor.name}`,
      $('body'),
      entity,
      this);
    md.open();
  }

  getParams(){
    return new Params(this.model, this.view, this, this.service);
  }

  addCharacter(params) {
    let charData = params || {};
    if (params){
      charData.image = params.image;
      charData.motivation= params.motivation;
      charData.evaluation = params.evaluation;
      charData.methodology = params.methodology;
      charData.purpose = params.purpose;
    }
    charData.name = params && params.name ? params.name : "New Character" ;
    charData.id = "character_" + this.characterCount;
    charData.model = this.model;
    charData.view = this.view
    charData.control = this;

    this.commandQueue.addCommand(new AddCharacterCommand(charData));
    this.characterCount += 1;
  }

  addLocation(data) {
    let params = this.getParams();
    params.name = data.name ? data.name : "New Location";
    params.id = "location_" + this.locationCount++;
    params.image = data.image;
    params.description = data.description;

    this.commandQueue.addCommand(new AddLocationCommand(params));
  }

  addScene (data) {
    let params = this.getParams();
    if (data){
      params.characters = data.characters;
      params.image = data.image;
      params.location = data.location;
      params.type = data.type;
      params.values = data.values;
      params.throughlines = data.throughlines;
      params.t = data.t;
      params.name = data.name;
      params.description = data.description;
      params.conflict = data.conflict;
    }
    this.commandQueue.addCommand( new AddSceneCommand(params));
  }

  moveScene(scene, x, y) {
    let params  = this.getParams();
    params.scene= scene;
    params.oldT = scene.t;
    params.oldY = scene.values.get(this.view.scope);
    params.newT = x / this.view.w;
    params.newY = y / this.view.h;

    this.commandQueue.addCommand(new MoveSceneCommand(params));
  }

  removeSceneTypeFromScenes(sym) {
    for (let s of this.model.story.scenes) {
      if(s.type === sym) {
        let params = this.getParams()
        params.scene = s;
        this.commandQueue.addCommand(new RemoveSceneTypeCommand(params));
      }
    }
  }

  updateModelField(currentEntity, entityFieldName, newValue) {
    let params = this.getParams();
    params.entity = currentEntity;
    params.fieldName = entityFieldName;
    params.newValue = newValue;
    this.commandQueue.addCommand(new UpdateModelFieldCommand(params));
  }

  undo() {
    this.commandQueue.undo();
    view.updateSceneSprites();
    view.update();
  }

  redo() {
    this.commandQueue.redo();
    this.view.updateSceneSprites();
    this.view.update();
  }

  findByName(name){
    for( let type in this.model.sceneTypes) {
      if (name === type.name){
        return type;
      }
    }
    for( let archetype in this.model.characterArchetypes) {
      if (name === archetype.name){
        return archetype;
      }
    }
    for( let throughline in this.model.throughlines) {
      if (name === throughline.name){
        return throughline;
      }
    }
    return {};
  }

  removeItemFromArray(arr, item) {
    if(arr && arr.length > 0 && arr.includes(item)){
      let i = arr.indexOf(item);
      arr.splice(i, 1);
    }
  }

  createSceneAt(x, y) {
    if (x < 0 || y < 0 || x > this.view.w || y > this.view.h) {
      return;
    }

    let vertical = y / this.view.h;
    let vo = {};
    let scope = this.view.scope;
    this.model.story.values.forEach(function(v,k,m) {
      vo[k.get("name")] = k === scope ? vertical : 0.5;
    });

    this.addScene({
      name: "",
      description: "...",
      location: "",
      t: x / this.view.w,
      values: vo,
      conflict: "",
      characters: []
    })
  }

	getStoryAsJson() {
		let jsn = {
			name: this.model.story.get("name"),
			description: this.model.story.get("description"),
			locations: [],
			characters: [],
			values: [],
			scenes: []
		};

		this.model.story.locations.forEach((l, k) => {
			jsn.locations.push({
				name: k.get("name"),
				image: k.get("image"),
			});
		});

		this.model.story.values.forEach((v, k) => {
			jsn.values.push( k.get("name") );
		});

		this.model.story.characters.forEach((c, k)=>{
			jsn.characters.push({
				archetype: c.get("archetype"),
				name: c.get("name"),
				description: c.get("description"),
				image: c.get("image")
			});
		});

		this.model.story.scenes.forEach((s, k) => {
			let characters = [];
			s.get("characters").forEach((v, l) => {
        characters.push(v.get("name"));
			});
			let values = {};
			s.values.forEach((v, l) => {
        values[l.get("name")] = v;
			})

      let location = "";
      if (s.get("location") && s.get("location") instanceof Location){
        location = s.get("location").get("name");
      }

			jsn.scenes.push({
        characters: characters,
				name: s.get("name"),
        conflict: s.get("conflict"),
				description: s.get("description"),
				location: location,
				t: s.t,
				type: s.get("type").get("name"),
        image: s.get("image"),
        values: values
			});
		});

		return jsn;
	}

	init() {
		let json = {"name":"Red Riding Hood","description":"A food delivery service employee gets eaten by a wolf and reemerges from his belly once the wolf gets killed and cut open.","locations":[{"name":"Forest","image":""},{"name":"Granny's Home","image":""}],"values":["Suspense","Life"],"characters":[{"name":"Red Riding Hood","archetype":"PROTAGONIST"},{"name":"Wolf","archetype":"ANTAGONIST"},{"name":"Granny","archetype":"REASON"},{"name":"Hunter","archetype":"GUARDIAN"}],"scenes":[{"type":"Inciting Incident","name":"Start delivery","description":"...","t":0.2,"location":"Forest","throughline":"Main Character","values":{"Suspense":0.3,"Life":0.6},"conflict":"RRH begins her travel in order to deliver the food","characters":["Red Riding Hood"]},{"type":"Regular Scene","name":"A short intermission","description":"...","t":0.3,"location":"Ad Space","throughline":"Objective","values":{"Suspense":0.7,"Life":0.4},"conflict":"","characters":[]},{"type":"Regular Scene","name":"Monologue of the wolf","description":"...","t":0.4,"location":"Forest","throughline":"Influence Character","values":{"Suspense":0.4,"Life":0.7},"conflict":"","characters":["Wolf"]},{"type":"Central Point","name":"Wolf attacks","description":"...","t":0.7,"location":"Forest","throughline":"Relationship","values":{"Suspense":0.7,"Life":0.3},"conflict":"RRH wants to deliver food; Wolf eats her first.","characters":["Red Riding Hood","Wolf"]},{"type":"Climax","name":"Hunter guts wolf","description":"...","t":0.8,"location":"Granny's Home","throughline":"Relationship","values":{"Suspense":0.4,"Life":0.7},"conflict":"Wolf wants to stay alive; Hunter cuts wolf open","characters":["Hunter","Wolf","Granny","Red Riding Hood"]}]};
		this.showReadData(json);
	}

  clearData() {
    // clear command queue
    this.commandQueue.clear();

    // create minimum config
    this.createMinimumConfig();
  }

  createMinimumConfig() {
    this.model.story = new Story("New Story", "...", this.model);
    this.addValue("Suspense");
  }

  showReadData(data){
    this.clearData();

    this.model.story.set("name", data.name)
    this.model.story.set("description", data.description);
    this.model.initFields();
    var c = this;

    data.locations.forEach(function(location){
      c.addLocation(location);
    });

    data.values.forEach(function(valueName){
      c.addValue(valueName);
    });

    data.characters.forEach(function(params){
      c.addCharacter(params);
    });

    this.view.scope = this.model.story.values.entries().next().value[0];

    data.scenes.forEach(function(params){
      c.addScene(params);
    });

    this.model.story.scenes[0].active = true;
    this.view.updateSceneSprites();
    this.view.updateGui();
    this.view.updateDetailView(this.view.getActiveScene());
  }
}
