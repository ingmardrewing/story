import Command from './Command';
import Location from '../model/Location';

export default class AddLocationCommand extends Command {
  loc :Location;

  do() {
    this.loc = new Location(this.payload, this.payload.model);
    this.payload.model.story.addLocation(this.loc);
  }

  undo() {
    this.payload.model.story.locations.delete(this.loc);
  }
}
