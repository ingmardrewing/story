import Command from './Command';
import Scene from '../model/Scene';

export default class DeleteCharacterCommand extends Command {
  scenes :Array<Scene>;

  do () {
    this.scenes = [];

    this.payload.control.removeItemFromArray(
      this.payload.model.story.characters,
      this.payload.character);
    for (let s of this.payload.model.story.scenes) {
      if (s.get("characters").includes(this.payload.character)){
        this.scenes.push(s);
      }
      this.payload.control.removeItemFromArray(
        s.characters,
        this.payload.character);
    }
    this.payload.view.updateDetailView();
  }

  undo() {
    this.payload.model.story.characters.push(this.payload.character);
    for (let s of this.scenes) {
    this.payload.view.updateDetailView();
      s.characters.push(this.payload.character);
    }
    this.payload.view.updateDetailView();
  }
}
