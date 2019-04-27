import Scene from '../model/Scene';
import View from './View';

export default class SceneSprite {
  scene :Scene;
  restriction :any;
  view :View;
  x :number;
  y :number;
  destX :number;
  destY :number;
  dragged :boolean;

  constructor(
      scene :Scene, 
      restriction :any, 
      view :View){
    this.view = view;
    this.scene = scene;
    this.restriction = restriction;
    this.x = 0;
    this.y = 0;

    this.destX = 0;
    this.destY = 0;

    this.dragged = false;
  }

  hasArrived() {
    return this.destX == this.x && this.destY == this.y;
  }

  setPosition(x :number, y :number) {
    let view = this.view;
    this.x = x < this.restriction.lowerLimit * view.w ? this.restriction.lowerLimit * view.w
           : x > this.restriction.upperLimit * view.w ? this.restriction.upperLimit * view.w
           :                                x ;
    this.y = y ;
  }

  setDestination(x :number, y:number) {
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
    let newX = this.x + (this.destX - this.x) / 4;
    let newY = this.y + (this.destY - this.y) / 4;
    newX = Math.abs(newX - this.x) < 0.5 ? this.destX : newX ;
    newY = Math.abs(newY - this.y) < 0.5 ? this.destY : newY ;
    this.setPosition( newX, newY);
  }
}
