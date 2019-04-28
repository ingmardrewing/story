import Command from './Command';
import Value from '../model/Value';

export default class AddValueCommand extends Command {
  value :Value;

  public do() :void {
    this.value = this.createValue();
    this.payload.model.story.addStoryValue(this.value);
    for(let s of this.payload.model.story.getScenes()) {
      s.values.set(this.value, 0.5);
    }
  }

  private createValue() :Value {
    let value :Value
      = new Value(this.payload.valueName, this.payload.model);
    if (this.payload.persistent){
      value.makePersistent();
    }
    if (this.payload.colorKey){
      value.setColorKey();
    }
    return value;
  }

  public undo() :void {
    this.payload.model.story.values.delete(this.value) ;
    for(let s of this.payload.model.story.getScenes()) {
      s.values.delete(this.value);
    }
  }
}
