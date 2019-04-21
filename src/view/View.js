import * as $ from 'jquery'
import PlotPoint1Restriction from './PlotPoint1Restriction.js';
import CentralPointRestriction from './CentralPointRestriction.js';
import PlotPoint2Restriction from './PlotPoint2Restriction.js';
import IncitingIncidentRestriction from './IncitingIncidentRestriction.js';
import ClimaxRestriction from './ClimaxRestriction.js';
import RegularRestriction from './RegularRestriction.js';
import SceneSprite from './SceneSprite.js';
import DetailView from './DetailView.js';
import DetailViewConst from './DetailViewConst.js';
import List from './List.js';
import MainNavi from './MainNavi.js';

export default class View {
  constructor(model, control){
    if( ! model){
      console.error("Model missing");
    }
    this.model = model;
    if(!control){
      console.error("Control missing");
    }
    this.control = control;
    this.thres = {
      START: 0,
      PP1: 0.25,
      CP: 0.5,
      PP2: 0.75,
      END: 1
    }
    this.color = {
      SCENE_FILL: '#FFFFFF',
      SCENE_FILL_ACTIVE: '#FFAA00',
      SCENE_BORDER: '#000000'
    };

    this.sceneRadius = 15;
    this.sceneSprites = [];
    this.$guiContainer = undefined;
    this.$guiCol1 = undefined;
    this.$guiCol2 = undefined;
    this.$guiCol3 = undefined;
    this.$guiCol4 = undefined;
    this.$navi = undefined;

    this.w = 1200;
    this.h = 300;

    this.detailViewEntity = undefined;
  }

  getRestriction(sceneType) {
    let m = this.model
    switch(sceneType.name) {
      case m.sceneTypeNames.INCITING_INCIDENT:{
        return new IncitingIncidentRestriction(this);
      }
      case m.sceneTypeNames.PLOT_POINT_1:{
        return new PlotPoint1Restriction(this);
      }
      case m.sceneTypeNames.CENTRAL_POINT:{
        return new CentralPointRestriction(this);
      }
      case m.sceneTypeNames.PLOT_POINT_2:{
        return new PlotPoint2Restriction(this);
      }
      case m.sceneTypeNames.CLIMAX:{
        return new ClimaxRestriction(this);
      }
    }
    return new RegularRestriction(this);
  }

  setScope(scope) {
    this.scope = scope;
  }

  updateSceneSprites() {
    this.sceneSprites = [];
    for(let s of this.model.getScenes()) {
      let restriction = this.getRestriction(s.get("type"));
      let sprite = new SceneSprite(s, restriction, this);
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
    this.updateDetailView(this.detailViewEntity);
  }

  getActiveScene() {
    for (let s of this.sceneSprites) {
      if (s.scene.active) {
        return s.scene;
      }
    }
  }

  setupGui() {
    this.$guiContainer = $(`<div class="guiContainer">`);
    for(let i = 1; i<4; i++) {
      this['$guiCol'+i] = $('<div class="guiCol">');
      this.$guiContainer.append(this['$guiCol'+i]);
    }
    this.$guiCol1.addClass("detailView");
    $("body").append(this.$guiContainer);
  }

  updateGui() {
    this.$guiCol2.empty();
    this.$guiCol3.empty();

    let characters= new List(
      this.$guiCol2,
      'Characters',
      this.model.story.characters,
      '+ add character',
      this.control.addCharacter,
      this.control);
    characters.render();

    let storyValues = new List(
      this.$guiCol3,
      'Story Values',
      this.model.story.values,
      '+ add story value',
      this.control.addValue,
      this.control);
    storyValues.render();

    let locations = new List(
      this.$guiCol3,
      'Locations',
      this.model.story.locations,
      '+ add location',
      this.control.addLocation,
      this.control);
    locations.render();

    let mainNavi = new MainNavi(this, $("#navi"));
    mainNavi.render();
  }

  updateDetailView(entity) {
    this.$guiCol1.empty();
    this.detailViewEntity = entity;
    let v;
    if (entity && entity.get && entity.get("name") === "Suspense"){
      v = new DetailViewConst(this.$guiCol1, entity, this.control);
    }
    else {
      v = new DetailView(this.$guiCol1, entity, this.control);
    }
    v.display();
  }

  checkLoopNecessity(sk){
    let necessary = false;
    this.sceneSprites.forEach((s, k) => {
      if(! s.hasArrived()) {
        necessary = true;
      }
    });
    if (!necessary){
      sk.noLoop();
    }
  }
}
