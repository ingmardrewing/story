import * as $ from 'jquery';
import CommandQueue from './CommandQueue.js';
import AddValueCommand from './AddValueCommand.js';
import DeleteValueCommand from './DeleteValueCommand.js';
import DeleteCharacterCommand from './DeleteCharacterCommand.js';
import DeleteLocationCommand from './DeleteLocationCommand.js';
import AddCharacterCommand from './AddCharacterCommand.js';
import AddLocationCommand from './AddLocationCommand.js';
import AddSceneCommand from './AddSceneCommand.js';
import MoveSceneCommand from './MoveSceneCommand.js';
import RemoveSceneTypeCommand from './RemoveSceneTypeCommand.js';
import UpdateModelFieldCommand from './UpdateModelFieldCommand.js';
import ModalDialogue from '../view/ModalDialogue.js';
import Params from './Params.js';

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

  showReadData(data){

    this.model.story.name = data.name;
    this.model.story.description = data.description;
    this.model.initFields();
    var c = this;

    data.locations.forEach(function(location){
      c.addLocation(location.name);
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
    let params = this.getParams();
    params.valueName = valueName;
    this.commandQueue.addCommand(new AddValueCommand(params));
  }

  getLoadChangeListener() {
    let c = this;
    return function(e) {
      c.service.read.call(c.service,e);
    }
  }

  getSaveListener() {
    return this.service.save;
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
    }
  }

  addCharacter(params) {
    let charData = params || {};
    charData.id = "character_" + this.characterCount;
    charData.model = this.model;
    charData.view = this.view
    charData.control = this;

    this.commandQueue.addCommand(new AddCharacterCommand(charData));
    this.characterCount += 1;
  }

  addLocation(locationName) {
    let params = this.getParams();
    params.name = locationName ? locationName : "New Location";
    params.id = "location_" + this.locationCount++;

    this.commandQueue.addCommand(new AddLocationCommand(params));
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

  addScene (data) {
    console.log("adding scene", this);
    let params = this.getParams();
    params.characters = data.characters;
    params.locations = data.locations;
    params.type = data.type;
    params.values = data.values;
    params.throughlines = data.throughlines;
    this.commandQueue.addCommand(
      new AddSceneCommand(params)
    );
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
    console.log(this);
    for (let s of this.model.story.scenes) {
      if(s.type === sym) {
        let params = this.getParams()
        params.scene = s;
        this.commandQueue.addCommand(new RemoveSceneTypeCommand(params));
      }
    }
  }

  updateModelField(currentEntity, entityFieldName, newValue) {
    console.log(this)
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
    if(arr.length > 0 && arr.includes(item)){
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
}
