const color = {
  SCENE_FILL: '#FFFFFF',
  SCENE_FILL_ACTIVE: '#FF0000',
  SCENE_BORDER: '#000000'
};
Object.freeze(color);

class  View {
  scope = "Suspense";
  sceneRadius = 30;
  sceneSprites;

  w = 1000;
  h = 500;

  setScope(scope) {
    this.scope = scope;
  }

  updateSceneSprites() {
    this.sceneSprites = [];
    for(let s of model.getScenes()) {
      let restriction = getRestriction(s.type);
      let sprite = new SceneSprite(s, restriction);
      sprite.readDestinationFromModel();
      sprite.syncPosition();
      this.sceneSprites.push(sprite);
    }
  }

  update() {
    for ( let s of this.sceneSprites) {
      s.readDestinationFromModel();
    }
  }
}

class SceneSprite {
  x = 0;
  y = 0;

  destX = 0;
  destY = 0;

  dragged = false;
  scene;

  constructor(scene, restriction){
    this.scene = scene;
    this.restriction = restriction;
  }

  setPosition(x, y) {
    this.x = x < this.restriction.lowerLimit * view.w ? this.restriction.lowerLimit * view.w
           : x > this.restriction.upperLimit * view.w ? this.restriction.upperLimit * view.w
           :                                x ;
    this.y = y ;
  }

  setDestination(x, y) {
    this.destX = x < this.restriction.lowerLimit * view.w ? this.restriction.lowerLimit * view.w
               : x > this.restriction.upperLimit * view.w ? this.restriction.upperLimit * view.w
               :                                x ;
    this.destY = y;
  }

  readDestinationFromModel() {
    this.setDestination(
      this.scene.t * view.w,
      this.scene.values[view.scope] * view.h
    );
  }

  syncPosition() {
    this.setPosition( this.destX, this.destY );
  }

  approxPosition() {
    this.setPosition(
      this.x + (this.destX - this.x) / 4,
      this.y + (this.destY - this.y) / 4
    );
  }

  writeToModel() {
    this.scene.t = this.x / view.w;
    this.scene.values[view.scope] = this.y / view.h;
  }
}

function getRestriction(sceneType) {
  switch(sceneType) {
    case SceneTypeNames.INCITING_INCIDENT :{
      return new IncitingIncidentRestriction();
    }
    case SceneTypeNames.PLOT_POINT_I :{
      return new PlotPoint1Restriction();
    }
    case SceneTypeNames.CENTRAL_POINT :{
      return new CentralPointRestriction();
    }
    case SceneTypeNames.PLOT_POINT_II :{
      return new PlotPoint2Restriction();
    }
    case SceneTypeNames.CLIMAX :{
      return new ClimaxRestriction();
    }
    default: {
      return new RegularRestriction();
    }
  }
}

class RegularRestriction {
  lowerLimit = 0;
  upperLimit = 1;
}

class IncitingIncidentRestriction {
  lowerLimit = 0;
  upperLimit = 0.25;
}

class PlotPoint1Restriction {
  lowerLimit = 0.25;
  upperLimit = 0.25;
}

class CentralPointRestriction {
  lowerLimit = 0.5;
  upperLimit = 0.5;
}

class PlotPoint2Restriction {
  lowerLimit = 0.75;
  upperLimit = 0.75;
}

class ClimaxRestriction {
  lowerLimit = 0.75;
  upperLimit = 1;
}
