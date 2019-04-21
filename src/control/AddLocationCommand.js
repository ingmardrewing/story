import Command from './Command.js';
import Location from '../model/Location.js';

export default class AddLocationCommand extends Command {
  do() {
    this.loc = new Location(this.payload, this.payload.model);
    this.payload.model.story.addLocation(this.loc);
  }

  undo() {
    this.payload.model.story.locations.delete(this.location);
  }
}
