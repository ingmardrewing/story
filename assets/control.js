class Control {

  commandQueue;
  characterCount = 0;

  init(s) {
    this.commandQueue = new CommandQueue();

    model.story = new Story();
    model.story.title = s.title;
    model.story.description = s.description;
    let c = this

    s.values.forEach(function(valueName){
      c.addValue(valueName);
    });

    s.characters.forEach(function(params){
      c.addCharacter(params);
    });

    s.scenes.forEach(function(params){
      c.addScene(params);
    });

    model.story.scenes[0].active = true;
    view.updateSceneSprites();
    view.setupGui();
    view.updateGui();
  }

  selectValue(val){
    view.scope = val;
    view.update();
  }

  addValue(valueName) {
    this.commandQueue.addCommand(new AddValueCommand(valueName));
  }

  addCharacter(params) {
    params.id = "character_" + this.characterCount;
    this.commandQueue.addCommand(new AddCharacterCommand(params));
    this.characterCount += 1;
  }

  addLocation(locationName) {
    this.commandQueue.addCommand(new AddLocationCommand(params));
  }

  addScene (params) {
    this.commandQueue.addCommand(new AddSceneFromJSONCommand(params));
  }

  editScene(scene) {
    let md = new ModalDialogue(
      "Edit Scene",
      $('body'),
      scene,
      ["title", "description", "image", "conflict", "type", "characters"]
    );
    md.open();
  }

  moveScene(scene, x, y) {
    this.commandQueue.addCommand(new MoveSceneCommand({
      scene: scene,
      oldT: scene.t,
      oldY: scene.values[view.scope],
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
  history = [];
  queue = [];

  addCommand(command) {
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
  payload;

  constructor(payload){
    this.payload = payload;
  }
}

class AddCharacterCommand extends Command {
  char;

  do(){
    let newArchetype ;
    for (let at in characterArchetypes) {
      if(at === this.payload.archetype) {
        newArchetype = at;
        break;
      }
    }
    this.char = new StoryCharacter(this.payload, newArchetype);
    model.story.addCharacter(this.char);
  }

  undo() {
    removeItemFromArray(model.story.characters, this.char);
  }
}

class AddValueCommand extends Command {
  value;

  do() {
    this.value = new StoryValue(this.payload);
    model.story.addStoryValue(this.value);
    for(let s of model.story.getScenes()) {
      s.addValue(this.value.name, 0.5);
    }
  }

  undo(){
    removeItemFromArray(model.story.values, this.value);
    for(let s of model.story.getScenes()) {
      removeItemFromArray(s.values, this.value);
    }
  }
}

class AddLocationCommand extends Command {
  loc;
  do() {
    this.loc = new Location(payload);
    model.story.addLocation(this.loc);
  }

  undo() {
    removeItemFromArray(model.story.locations, this.location);
  }
}

class AddSceneFromJSONCommand extends Command {
  scene;
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
    this.scene = new Scene(this.payload, characters, loc, type);
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
      this.payload.scene.values[view.scope] = this.payload.newY;

      this.payload.scene.sprite.readDestinationFromModel();
      this.payload.scene.sprite.syncPosition();
  }

  undo() {
      this.payload.scene.t = this.payload.oldT;
      this.payload.scene.values[view.scope] = this.payload.oldY;

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
    let pl = this.payload;
    pl.oldValue = pl.model[pl.fieldName]
    pl.model[pl.fieldName] = pl.newValue;
  }

  undo() {
    let pl = this.payload;
    pl.model[pl.fieldName] = pl.oldValue;
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
  let vo = model.getValuesObject();
  vo[view.scope] = mouseY / view.h;

  control.addScene({
    title: "",
    description: "...",
    location: "",
    t: mouseX / view.w,
    values: vo,
    conflict: "",
    characters: []
  })
}


