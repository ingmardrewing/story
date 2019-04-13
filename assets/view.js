const color = {
  SCENE_FILL: '#FFFFFF',
  SCENE_FILL_ACTIVE: '#FFAA00',
  SCENE_BORDER: '#000000'
};
Object.freeze(color);

const thres = {
  START: 0,
  PP1: 0.25,
  CP: 0.5,
  PP2: 0.75,
  END: 1
}
Object.freeze(thres);

class  View {
  scope = "Suspense";
  sceneRadius = 15;
  sceneSprites = [];
  $guiContainer;
  $guiCol1;
  $guiCol2;
  $guiCol3;

  w = 1200;
  h = 300;

  setScope(scope) {
    this.scope = scope;
  }

  updateSceneSprites() {
    this.sceneSprites = [];
    for(let s of model.getScenes()) {
      let restriction = getRestriction(s.type);
      let sprite = new SceneSprite(s, restriction);
      s.setSprite(sprite);
      sprite.readDestinationFromModel();
      sprite.syncPosition();
      this.sceneSprites.push(sprite);
    }
  }

  update() {
    for ( let ss of this.sceneSprites) {
      ss.readDestinationFromModel();
    }
    this.updateGui();
  }

  updateGui() {
    if(this.$guiContainer) {
      this.$guiContainer.children().empty();
      this.$guiCol1.append(`<h2 class="storyItem">Story Values</h2>`);
      for( let v in model.getValuesObject()) {
        this.$guiCol1.append(
          `<div class="storyItem">
            <a class="choose" href="javascript:control.selectValue('${v}');">${v}</a>
            <a class="edit" href="javascript:control.editValue('${v}');">edit</a>
            <a class="delete" href="javascript:control.deleteValue('${v}');">delete</a>
          </div>`);
      }
      this.$guiCol1.append(`<a class="storyItem storyItemAdd" href="javascript:control.addValue();">+ add story value</a>`);

      this.$guiCol2.append(`<h2 class="storyItem">Characters</h2>`);
      for( let c of model.story.characters) {
        this.$guiCol2.append(
                  `<div class="storyItem">
                    <a class="choose" href="javascript:control.selectValue('${c.name}');">${c.name}</a>
                    <a class="edit" href="javascript:control.editValue('${c.name}');">edit</a>
                    <a class="delete" href="javascript:control.deleteValue('${c.name}');">delete</a>
        </div>`);
      }
      this.$guiCol2.append(`<a class="storyItem storyItemAdd" href="javascript:control.addCharacter();">+ add character</a>`);

      this.$guiCol3.append(`<h2 class="storyItem">Locations</h2>`);
      for( let l of model.story.locations) {
        this.$guiCol3.append(
                          `<div class="storyItem">
                            <a class="choose" href="javascript:control.selectValue('${l.name}');">${l.name}</a>
                            <a class="edit" href="javascript:control.editValue('${l.name}');">edit</a>
                            <a class="delete" href="javascript:control.deleteValue('${l.name}');">delete</a>
        </div>`);
      }
      this.$guiCol3.append(`<a class="storyItem storyItemAdd" href="javascript:control.addLocation();">+ add location</a>`);
    }
  }

  setupGui() {
    this.$guiContainer = $(`<div class="guiContainer">`);
    this.$guiCol1 = $('<div class="guiCol">');
    this.$guiCol2 = $('<div class="guiCol">');
    this.$guiCol3 = $('<div class="guiCol">');
    this.$guiContainer.append(this.$guiCol1);
    this.$guiContainer.append(this.$guiCol2);
    this.$guiContainer.append(this.$guiCol3);
    $("body").append(this.$guiContainer);
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
  lowerLimit = thres.START;
  upperLimit = thres.END;
}

class IncitingIncidentRestriction {
  lowerLimit = thres.START;
  upperLimit = thres.PP1;
}

class PlotPoint1Restriction {
  lowerLimit = thres.PP1;
  upperLimit = thres.PP1;
}

class CentralPointRestriction {
  lowerLimit = thres.CP;
  upperLimit = thres.CP;
}

class PlotPoint2Restriction {
  lowerLimit = thres.PP2;
  upperLimit = thres.PP2;
}

class ClimaxRestriction {
  lowerLimit = thres.PP2;
  upperLimit = thres.END;
}
