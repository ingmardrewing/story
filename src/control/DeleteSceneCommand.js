import Command from './Command.js';

export default class DeleteSceneCommand extends Command {
  do () {
    this.payload.control.removeItemFromArray(
      this.payload.model.story.scenes,
      this.payload.scene);
    this.payload.view.updateDetailView();
  }

  undo() {
    this.payload.model.story.scenes.push(
      this.payload.scene);
    this.payload.view.updateDetailView();
  }
}
