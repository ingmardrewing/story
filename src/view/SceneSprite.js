export default class SceneSprite {
  constructor(scene, restriction, view){
    this.view = view;
    this.scene = scene;
    this.restriction = restriction;
    this.x = 0;
    this.y = 0;

    this.destX = 0;
    this.destY = 0;

    this.dragged = false;
  }

  setPosition(x, y) {
    let view = this.view;
    this.x = x < this.restriction.lowerLimit * view.w ? this.restriction.lowerLimit * view.w
           : x > this.restriction.upperLimit * view.w ? this.restriction.upperLimit * view.w
           :                                x ;
    this.y = y ;
  }

  setDestination(x, y) {
    let view = this.view;
    this.destX = x < this.restriction.lowerLimit * view.w ? this.restriction.lowerLimit * view.w
               : x > this.restriction.upperLimit * view.w ? this.restriction.upperLimit * view.w
               :                                x ;
    this.destY = y;
  }

  readDestinationFromModel() {
    let view = this.view;
    let y =  this.scene.values.get(view.scope);
    this.setDestination(
      this.scene.t * view.w,
      y * view.h
    );
  }

  syncPosition() {
    this.setPosition(this.destX, this.destY);
  }

  approxPosition() {
    this.setPosition(
      this.x + (this.destX - this.x) / 4,
      this.y + (this.destY - this.y) / 4
    );
  }
}
