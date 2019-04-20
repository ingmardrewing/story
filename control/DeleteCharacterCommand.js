import Command from './Command.js';

export default class DeleteCharacterCommand extends Command {
  do () {
    this.scenes = [];

    this.payload.control.removeItemFromArray(
      this.payload.model.story.characters,
      this.payload.character);
    for (let s of this.payload.model.story.scenes) {
      if (s.characters.includes(this.payload.character)){
        this.scenes.push(s);
      }
      this.payload.control.removeItemFromArray(
        s.characters,
        this.payload.character);
    }
  }

  undo() {
    this.payload.model.story.characters.push(this.payload.character);
    for (let s of this.scenes) {
      s.characters.push(this.payload.character);
    }
  }
}
