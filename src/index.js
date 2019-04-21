import * as $ from 'jquery'
import hotkeys from 'hotkeys-js'
import * as p5 from 'p5'
import Model from './model/Model.js';
import View from './view/View.js';
import Control from './control/Control.js';
import Service from './service/Service.js';

let service, model, view, control, openSans;

let s = (sk) => {
  sk.preload = () => {
    openSans = sk.loadFont('./fonts/open-sans-v15-latin-ext_latin-300.ttf');
  }
  sk.setup = () => {
    service = new Service();
    model = new Model();
    control = new Control(model, service);
    service.setControl(control);
    view = new View(model, control);
    control.setView(view);
    model.initFields();

    sk.createCanvas(view.w, view.h);
    view.setupGui();
		control.init();
  }
  sk.draw = () => {
    sk.clear();
    sk.stroke(102);

    // create grid
    sk.strokeWeight(0.5);
    let pp1 = view.thres.PP1 * view.w;
    let pp2 = view.thres.PP2 * view.w;
    let vmid = 0.5 * view.h
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
  }
  sk.mousePressed = (e) => {
  if( $('.overlay').length > 0 ) {
      return ;
    }
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
  }
  sk.mouseDragged = (e) => {
   if( $('.overlay').length > 0 ) { return false; }
    for (let s of view.sceneSprites) {
      if (s.dragged) {
        s.setPosition(sk.mouseX, sk.mouseY);
      }
    }
  }
  sk.mouseReleased = (e) => {
   if( $('.overlay').length > 0 ) { return false; }
    for (let s of view.sceneSprites) {
      if (s.dragged){
        control.moveScene(s.scene, s.x, s.y);
        s.dragged = false;
      }
    }
  }
}

const P5 = new p5(s);

hotkeys("ctr+z,cmd+z", function keyPressed(e, h) {
  control.undo();
});

hotkeys("ctr+shift+z,cmd+shift+z", function keyPressed(e, h) {
  control.redo();
});

hotkeys("enter,return", function keyPressed(e, h) {
  $(".save").trigger("click");
});
