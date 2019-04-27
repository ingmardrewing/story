import Command from './Command';

export default class DeleteLocationCommand extends Command {
  do() {
    this.payload.control.removeItemFromArray(
      this.payload.model.story.locations,
      this.payload.location
    );
    this.payload.view.updateDetailView();
  }

  undo() {
    this.payload.model.story.addLocation(
      this.payload.character
    );
    this.payload.view.updateDetailView();
  }
}
