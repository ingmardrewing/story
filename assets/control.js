class Control {
  constructor() {
    this.characterCount = 0;
    this.locationCount = 0;
    this.commandQueue = new CommandQueue();
  }

  select(entity){
    switch(entity.constructor.name){
      case "Value": {
        view.scope = entity;
        view.updateDetailView(entity);
        view.update();
        break;
      }
      default: {
        view.updateDetailView(entity);
      }
    }
  }

  addValue(valueName) {
    this.commandQueue.addCommand(new AddValueCommand(valueName));
  }

  delete(entity) {
    switch(entity.constructor.name) {
      case "Value":{
        this.commandQueue.addCommand(new DeleteValueCommand(entity));
        break;
      }
      case "Character":{
        this.commandQueue.addCommand(new DeleteCharacterCommand(entity));
        break;
      }
      case "Location":{
        this.commandQueue.addCommand(new DeleteLocationCommand(entity));
        break;
      }
    }
  }

  addCharacter(params) {
    let charData = params || {};
    charData.id = "character_" + this.characterCount;
    this.commandQueue.addCommand(new AddCharacterCommand(charData));
    this.characterCount += 1;
  }

  addLocation(locationName) {
    let params = locationName ? {name: locationName} :{name:"New Location"};
    params.id = "location_" + this.locationCount++;
    this.commandQueue.addCommand(new AddLocationCommand(params));
  }

  edit(entity) {
    if(!(entity && entity.constructor)){
      return;
    }

    let headline, fields;
    switch(entity.constructor.name){
      case "Character":{
        fields = ["archetype", "image", "name", "purpose", "motivation", "methodology", "evaluation", "biography"];
        break;
      }
      case "Scene":{
        fields = ["image", "name", "description", "conflict", "type", "characters", "location", "throughline" ];
        break;
      }
      case "Location":{
        fields = ["name", "description","image"];
        break;
      }
      case "Value":{
        fields = ["name" ];
        break;
      }
    }

    let md = new ModalDialogue(
      `Edit ${entity.constructor.name}`,
      $('body'),
      entity,
      fields // TODO: remove when new fields are ready
    );
    md.open();
  }


  addScene (params) {
    this.commandQueue.addCommand(new AddSceneFromJSONCommand(params));
  }


  moveScene(scene, x, y) {
    this.commandQueue.addCommand(new MoveSceneCommand({
      scene: scene,
      oldT: scene.t,
      oldY: scene.values.get(view.scope),
      newT: x / view.w,
      newY: y / view.h
    }));
  }

  removeSceneTypeFromScenes(sym) {
    for (let s of model.story.scenes) {
      if(s.type === sym) {
        this.commandQueue.addCommand(new RemoveSceneTypeCommand({
          scene: s
        }));
      }
    }
  }

  updateModelField(currentModel, modelFieldName, newValue) {
    this.commandQueue.addCommand(new UpdateModelFieldCommand({
      model: currentModel,
      fieldName: modelFieldName,
      newValue: newValue
    }));
  }

  undo() {
    this.commandQueue.undo();
    view.updateSceneSprites();
    view.update();
  }

  redo() {
    this.commandQueue.redo();
    view.updateSceneSprites();
    view.update();
  }

  // TODO: Remove after transition to new fieldtypes
  findSymbolSiblings(sym){
    for( let s in SceneTypeNames ) {
      if (sym === SceneTypeNames[s]){
        return SceneTypeNames;
      }
    }
    for( let s in characterArchetypes) {
      if (sym === characterArchetypes[s]){
        return characterArchetypes;
      }
    }
    for( let s in throughlines) {
      if (sym === throughlines[s]){
        return throughlines;
      }
    }
    return {};
  }
}

class CommandQueue {
  addCommand(command) {
    this.history = [];
    this.queue = [];
    this.do(command);
    view.updateSceneSprites();
    view.update()
  }

  do(cmd) {
    cmd.do();
    this.history.push(cmd);
  }

  redo() {
    if (this.queue.length > 0){
      let cmd = this.queue.pop();
      // console.log("redo:", cmd.constructor.name, cmd.payload);
      this.do(cmd);
    }
  }

  undo() {
    if (this.history.length > 0){
      let cmd = this.history.pop();
      // console.log("undo:", cmd.constructor.name, cmd.payload);
      cmd.undo();
      this.queue.push(cmd);
    }
  }
}

class Command {
  constructor(payload){
    this.payload = payload;
  }
}

class AddCharacterCommand extends Command {
  constructor(payload) {
    super(payload);
    this.char = undefined;
  }

  do(){
    let newArchetype ;
    for (let at in characterArchetypes) {
      if(at === this.payload.archetype) {
        newArchetype = characterArchetypes[at];
        break;
      }
    }
    this.char = new Character(this.payload, newArchetype);
    model.story.addCharacter(this.char);
  }

  undo() {
    removeItemFromArray(model.story.characters, this.char);
  }
}

class AddValueCommand extends Command {
  constructor(payload) {
    super(payload);
    this.value = undefined;
  }

  do() {
    this.value = new Value(this.payload);
    model.story.addStoryValue(this.value);
    for(let s of model.story.getScenes()) {
      s.values.set(this.value, 0.5);
    }
  }

  undo(){
    model.story.values.delete(this.value) ;
    for(let s of model.story.getScenes()) {
      s.values.delete(this.value);
    }
  }
}

class DeleteCharacterCommand extends Command {
  constructor(payload) {
    super(payload);
    this.scenes = undefined;
  }

  do () {
    this.scenes = [];

    removeItemFromArray(model.story.characters, this.payload);
    for (let s of model.story.scenes) {
      if (s.characters.includes(this.payload)){
        this.scenes.push(s);
      }
      removeItemFromArray(s.characters, this.payload);
    }
  }

  undo() {
    model.story.characters.push(this.payload);
    for (let s of this.scenes) {
      s.characters.push(this.payload);
    }
  }
}
class DeleteValueCommand extends Command {
  do () {
    this.s2vmap = new Map();
    model.story.values.delete(this.payload);
    for (let s of model.story.scenes) {
      this.s2vmap.set(s, s.values.get(this.payload))
      s.values.delete(this.payload);
    }
  }

  undo() {
    model.story.values.set(this.payload, 0.5);
    for (let s of model.story.scenes) {
      s.values.set(this.payload, this.s2vmap.get(s))
    }
  }
}

class AddLocationCommand extends Command {
  do() {
    this.loc = new Location(this.payload);
    model.story.addLocation(this.loc);
  }

  undo() {
    model.story.locations.delete(this.location);
  }
}

class DeleteLocationCommand extends Command {
  do() {
    removeItemFromArray(model.story.locations, this.payload);
  }

  undo() {
    model.story.addLocation(this.payload);
  }
}

function findSymbolByName(description){
  for( let s in SceneTypeNames ) {
    if (description === SceneTypeNames[s].description){
      return SceneTypeNames[s];
    }
  }
  for( let s in characterArchetypes) {
    if (description === characterArchetypes[s].description){
      return characterArchetypes[s];
    }
  }
  for( let s in throughlines) {
    if (description === throughlines[s].description){
      return throughlines[s];
    }
  }
  return {};
}

class AddSceneFromJSONCommand extends Command {
  do() {
    let characters = [];
    for (let charName in this.payload.characters) {
      let char = model.story.getCharacterByName(charName);
      if(char) {
        characters.push(char);
      }
    }
    let loc = model.story.getLocationByName(this.payload.location);
    let type = model.getSceneTypeByName(this.payload.type)

    let vmap = new Map();

    model.story.values
      .forEach((k, v, m) => vmap.set(v, this.payload.values[v.name] ))
    this.scene = new Scene(
      this.payload,
      characters,
      loc,
      type,
      findSymbolByName(this.payload.throughline),
      "",
      vmap);

    model.story.addScene(this.scene);
  }

  undo() {
    removeItemFromArray(model.story.scenes, this.scene);
    let i = view.sceneSprites.indexOf(this.scene.sprite);
    view.sceneSprites.splice(i, 1);
  }
}

class MoveSceneCommand extends Command {
  do() {
      this.payload.scene.t = this.payload.newT;
      this.payload.scene.values.set(view.scope, this.payload.newY);

      this.payload.scene.sprite.readDestinationFromModel();
      this.payload.scene.sprite.syncPosition();
  }

  undo() {
      this.payload.scene.t = this.payload.oldT;
      this.payload.scene.values.set(view.scope, this.payload.oldY);

      this.payload.scene.sprite.readDestinationFromModel();
      this.payload.scene.sprite.syncPosition();
  }
}

class RemoveSceneTypeCommand extends Command {
  do() {
    this.payload.oldSceneType = this.payload.scene.type;
    this.payload.scene.type = SceneTypeNames.REGULAR_SCENE;
  }

  undo() {
    this.payload.scene.type = this.payload.oldSceneType;
  }
}

class UpdateModelFieldCommand extends Command {
  do(){
    if (this.payload.model instanceof Character || this.payload.model instanceof Scene){
      let pl = this.payload;
      console.log(pl.fieldName, pl.newValue);
      pl.oldValue = pl.model.fields.get(pl.fieldName);
      pl.model.fields.set(pl.fieldName, pl.newValue);
    }
    else{
      let pl = this.payload;
      pl.oldValue = pl.model[pl.fieldName]
      pl.model[pl.fieldName] = pl.newValue;
    }
  }

  undo() {
    if (this.payload.model instanceof Character || this.payload.model instanceof Scene){
      let pl = this.payload;
      pl.model.fields.set(pl.fieldName, pl.oldValue);
    }
    else{
      let pl = this.payload;
      pl.model[pl.fieldName] = pl.oldValue;
    }
  }
}

function removeItemFromArray(arr, item) {
  if(arr.length > 0 && arr.includes(item)){
    let i = arr.indexOf(this.scene);
    arr.splice(i, 1);
  }
}

// addcharacter command, add scene command ... etc.

function createSceneAt(x, y) {
  if (x < 0 || y < 0 || x > view.w || y > view.h) {
    return;
  }

  let vertical = mouseY / view.h;
  let vo = {};
  model.story.values.forEach(function(v,k,m) {
      vo[k.name] = k === view.scope ? vertical : 0.5;
    });

  control.addScene({
    name: "",
    description: "...",
    location: "",
    t: mouseX / view.w,
    values: vo,
    conflict: "",
    characters: []
  })
}
