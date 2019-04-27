import * as p5 from 'p5';
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
import RenderTimer from './RenderTimer.js';

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

  checkLoopNecessity(){
    let necessary = false;
    this.sceneSprites.forEach((s, k) => {
      if(! s.hasArrived()) {
        necessary = true;
      }
    });
    if (!necessary && !this.renderTimer.isSet()){
      this.renderTimer.setTimer(500);
    }
  }

  initP5() {
    let model = this.model;
    let control = this.control;
    let view = this;
    let openSans;

    this.P5 = new p5(function(sk){
        sk.preload = () => {
          openSans = sk.loadFont('./fonts/open-sans-v15-latin-ext_latin-300.ttf');
        }

      sk.setup = () => {
        sk.createCanvas(view.w, view.h);
        view.setupGui();
        view.renderTimer = new RenderTimer(sk);
        control.init();
      }

      sk.draw = () => {
        sk.clear();
        sk.stroke(102);

        // create grid
        sk.strokeWeight(0.5);
        let pp1  = view.thres.PP1 * view.w;
        let pp2  = view.thres.PP2 * view.w;
        let vmid  = 0.5 * view.h
        sk.line(pp1, 0, pp1, view.h);
        sk.line(pp2, 0, pp2, view.h);
        sk.line(0, vmid, view.w, vmid);

        sk.fill(153);
        sk.textFont(openSans);
        sk.textSize(36);
        let fontH = view.h -12;
        sk.text("Setup", 10, fontH);
        sk.text("Confrontation", pp1 +10, fontH);
        sk.text("Resolution", pp2 +10, fontH);

        let lastX = -1;
        let lastY = -1;
        sk.strokeWeight(1);
        view.sceneSprites.sort(function(a, b){return a.x-b.x;});

        for (let s of view.sceneSprites) {
          if(!s.dragged) {
            s.approxPosition();
          }
          if (lastX >= 0 && lastY >= 0) {
            sk.line(lastX, lastY, s.x, s.y);
          }
          lastX = s.x;
          lastY = s.y;
        }

        sk.textSize(12);
        for (let s of view.sceneSprites) {
          sk.strokeWeight( s.scene.active ? 2 : 1);
          sk.fill( s.dragged ? view.color.SCENE_FILL_ACTIVE : view.color.SCENE_FILL);
          sk.ellipse(s.x, s.y, view.sceneRadius, view.sceneRadius);
          if (s.scene.get("type").name !== model.sceneTypeNames.REGULAR_SCENE) {
            sk.strokeWeight(1);
            sk.fill(153);
            let sct = s.scene.get("type");
            if (sct !== model.sceneTypeNames.REGULAR_SCENE ) {
              sk.text(sct.name, Math.round(s.x), Math.round(s.y -20));
            }
          }
        }
        view.checkLoopNecessity();
      }

      sk.mousePressed = (e) => {
        if( $('.overlay').length > 0 ) {
          return ;
        }
        sk.loop();
        let noHit = true;
        for (let s of view.sceneSprites) {
          let distance = sk.dist(sk.mouseX, sk.mouseY, s.x, s.y );
          if (distance < view.sceneRadius) {
            s.dragged = true;
            s.scene.activate();
            view.updateDetailView(s.scene);
            noHit = false;
          }
          else {
            s.scene.deactivate();
            s.dragged = false;
          }
        }

        if (noHit) {
          control.createSceneAt(sk.mouseX, sk.mouseY);
          view.updateSceneSprites();
        }
        view.checkLoopNecessity();
      }
      sk.mouseDragged = (e) => {
       if( $('.overlay').length > 0 ) { return false; }
        for (let s of view.sceneSprites) {
          if (s.dragged) {
            s.setPosition(sk.mouseX, sk.mouseY);
          }
        }
        sk.draw();
      }
      sk.mouseReleased = (e) => {
       if( $('.overlay').length > 0 ) { return false; }
        for (let s of view.sceneSprites) {
          if (s.dragged){
            control.moveScene(s.scene, s.x, s.y);
            s.dragged = false;
          }
        }
        view.checkLoopNecessity();
      }
    });
  }

}
