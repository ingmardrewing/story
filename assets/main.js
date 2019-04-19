let service, model, view, control, openSans;

function preload() {
  openSans = loadFont('assets/open-sans-v15-latin-ext_latin-300.ttf');
}

function setup() {
  service = new Service();
  model = new Model();
  control = new Control();
  view = new View();

  createCanvas(view.w, view.h);
  view.setupGui();
}

function draw() {
  clear();
  stroke(102);

  // create grid
  strokeWeight(0.5);
  let pp1 = thres.PP1 * view.w;
  let pp2 = thres.PP2 * view.w;
  let vmid = 0.5 * view.h
  line(pp1, 0, pp1, view.h);
  line(pp2, 0, pp2, view.h);
  line(0, vmid, view.w, vmid);

  fill(153);
  textFont(openSans);
  textSize(36);
  let fontH = view.h -12;
  text("Setup", 10, fontH);
  text("Confrontation", pp1 +10, fontH);
  text("Resolution", pp2 +10, fontH);

  let lastX = -1;
  let lastY = -1;
  strokeWeight(1);
  view.sceneSprites.sort(function(a, b){return a.x-b.x;});

  for (let s of view.sceneSprites) {
    if(!s.dragged) {
      s.approxPosition();
    }
    if (lastX >= 0 && lastY >= 0) {
      line(lastX, lastY, s.x, s.y);
    }
    lastX = s.x;
    lastY = s.y;
  }

  textSize(12);
  for (let s of view.sceneSprites) {
    strokeWeight( s.scene.active ? 2 : 1);
    fill( s.dragged ? color.SCENE_FILL_ACTIVE : color.SCENE_FILL);
    ellipse(s.x, s.y, view.sceneRadius, view.sceneRadius);
    if (s.scene.get("type").name !== sceneTypeNames.REGULAR_SCENE) {
      strokeWeight(1);
      fill(153);
      let sct = s.scene.get("type");
      if (sct !== sceneTypeNames.REGULAR_SCENE ) {
        text(sct.name, Math.round(s.x), Math.round(s.y -20));
      }
    }
  }
}

function mousePressed(e) {
  if( $('.overlay').length > 0 ) {
    return ;
  }
  let noHit = true;
  for (let s of view.sceneSprites) {
    let distance = dist(mouseX, mouseY, s.x, s.y );
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
    createSceneAt(mouseX, mouseY);
    view.updateSceneSprites();
  }
}

function mouseDragged(e) {
  if( $('.overlay').length > 0 ) { return false; }
  for (let s of view.sceneSprites) {
    if (s.dragged) {
      s.setPosition(mouseX, mouseY);
    }
  }
}

function mouseReleased(e) {
  if( $('.overlay').length > 0 ) { return false; }
  for (let s of view.sceneSprites) {
    if (s.dragged){
      control.moveScene(s.scene, s.x, s.y);
      s.dragged = false;
    }
  }
}

hotkeys("ctr+z,cmd+z", function keyPressed(e, h) {
  control.undo();
});

hotkeys("ctr+shift+z,cmd+shift+z", function keyPressed(e, h) {
  control.redo();
});

hotkeys("enter,return", function keyPressed(e, h) {
  $(".save").trigger("click");
});
