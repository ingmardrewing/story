import Command from './Command.js';

export default class DeleteLocationCommand extends Command {
  do() {
    this.payload.control.removeItemFromArray(
      this.payload.model.story.locations,
      this.payload.location
    );
  }

  undo() {
    this.payload.model.story.addLocation(
      this.payload.character
    );
  }
}
