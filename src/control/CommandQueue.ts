import Command from './Command';
import View from '../view/View';

export default class CommandQueue {
  queue :Array<Command>;
  history :Array<Command>;
  view :View;

  constructor(view :View) {
    if (!view) {
      console.error("View missing");
    }
    this.view = view;
    this.clear();
  }

  clear(){
    this.queue = [];
    this.history = [];
  }

  addCommand(command :Command) {
    this.do(command);
    this.view.updateSceneSprites();
    this.view.updateGui();
    this.view.update();
  }

  do(cmd :Command) {
    cmd.do();
    this.history.push(cmd);
  }

  redo() {
    if (this.queue.length > 0){
      let cmd = this.queue.pop();
      this.do(cmd);
    }
  }

  undo() {
    if (this.history.length > 0){
      let cmd = this.history.pop();
      cmd.undo();
      this.queue.push(cmd);
    }
  }
}
