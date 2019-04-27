import Command from './Command.js';
import Value from '../model/Value';

export default class AddValueCommand extends Command {
  do() {
    this.value = new Value(this.payload.valueName, this.payload.model);
    this.payload.model.story.addStoryValue(this.value);
    for(let s of this.payload.model.story.getScenes()) {
      s.values.set(this.value, 0.5);
    }
  }

  undo(){
    this.payload.model.story.values.delete(this.value) ;
    for(let s of this.payload.model.story.getScenes()) {
      s.values.delete(this.value);
    }
  }
}
