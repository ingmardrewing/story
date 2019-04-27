import Command from './Command';

export default class MoveSceneCommand extends Command {
  do() {
      this.payload.scene.t = this.payload.newT;
      this.payload.scene.values.set(this.payload.view.scope, this.payload.newY);

      this.payload.scene.sprite.readDestinationFromModel();
      this.payload.scene.sprite.syncPosition();
  }

  undo() {
      this.payload.scene.t = this.payload.oldT;
      this.payload.scene.values.set(this.payload.view.scope, this.payload.oldY);

      this.payload.scene.sprite.readDestinationFromModel();
      this.payload.scene.sprite.syncPosition();
  }
}
