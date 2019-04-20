import Command from './Command.js';

export default class DeleteValueCommand extends Command {
  do () {
    this.s2vmap = new Map();
    this.payload.model.story.values.delete(this.payload.value);
    for (let s of this.payload.model.story.scenes) {
      this.s2vmap.set(s, s.values.get(this.payload.value))
      s.values.delete(this.payload.value);
    }
  }

  undo() {
    this.payload.model.story.values.set(this.payload.value, 0.5);
    for (let s of this.payload.model.story.scenes) {
      s.values.set(this.payload.value, this.s2vmap.get(s))
    }
  }
}


