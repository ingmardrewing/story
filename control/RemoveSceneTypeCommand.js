import Command from './Command.js';

export default class RemoveSceneTypeCommand extends Command {
  do() {
    this.payload.oldSceneType = this.payload.scene.type;
    this.payload.scene.type = this.payload.model.sceneTypes[0];
  }

  undo() {
    this.payload.scene.type = this.payload.oldSceneType;
  }
}
