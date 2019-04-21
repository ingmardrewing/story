import Command from './Command.js';

export default class UpdateModelFieldCommand extends Command {
  do(){
    let pl = this.payload;
    pl.oldValue = pl.entity.fields.get(pl.fieldName);
    pl.entity.fields.set(pl.fieldName, pl.newValue);
  }

  undo() {
    let pl = this.payload;
    pl.entity.fields.set(pl.fieldName, pl.oldValue);
  }
}
