export default class CommandQueue {
  constructor(view) {
    if (!view) {
      console.error("View missing");
    }
    this.view = view;
  }

  clear(){
    this.queue = [];
    this.history = [];
  }

  addCommand(command) {
    this.history = [];
    this.queue = [];
    this.do(command);
    this.view.updateSceneSprites();
    this.view.updateGui();
    this.view.update();
  }

  do(cmd) {
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
