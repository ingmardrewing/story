import Command from './Command.js';
import Scene from '../model/Scene.js';

export default class AddSceneCommand extends Command {
  do() {
    let characters = [];
    for (let charName in this.payload.characters) {
      let char = this.payload.model.story.getCharacterByName(charName);
      if(char) {
        characters.push(char);
      }
    }
    let loc = this.payload.model.story.getLocationByName(this.payload.location);
    let type = this.payload.model.getSceneTypeByName(this.payload.type)

    let vmap = new Map();

    let self = this;

    this.payload.model.story.values
      .forEach(function(k, v){
        vmap.set(v, self.payload.values[v.get("name")] )
      });

    this.scene = new Scene(
      this.payload,
      characters,
      loc,
      type,
      this.payload.control.findByName(this.payload.throughline),
      "",
      vmap,
      this.payload.model);

    this.payload.model.story.addScene(this.scene);
  }

  undo() {
    removeItemFromArray(this.payload.model.story.scenes, this.scene);
    let i = view.sceneSprites.indexOf(this.scene.sprite);
    view.sceneSprites.splice(i, 1);
  }
}
