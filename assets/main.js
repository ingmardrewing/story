let model, view, control, openSans;

function preload() {
  openSans = loadFont('assets/open-sans-v15-latin-ext_latin-300.ttf');
}

function setup() {
  model = new Model();
  control = new Control();
  view = new View();

  createCanvas(view.w, view.h);

  let data = {
    name: "Red Riding Hood",
    description: "A food delivery service employee gets eaten by a wolf and reemerges from his belly once the wolf gets killed and cut open.",
    locations:[
      {name: "Forest", image: ""},
      {name:"Granny's Home", image: ""}
    ],
    values:[
      "Suspense",
      "Life"
    ],
    characters:[
      {
        name: "Red Riding Hood",
        archetype: "PROTAGONIST",
      },
      {
        name: "Wolf",
        archetype: "ANTAGONIST"
      },
      {
        name: "Granny",
        archetype: "REASON"
      },
      {
        name: "Hunter",
        archetype: "GUARDIAN"
      }
    ],
    scenes: [
      {
        type: "Inciting Incident",
        name: "Start delivery",
        description: "...",
        t: 0.2,
        location: "Forest",
        throughline: "Main Character",
        values: {
          "Suspense": 0.3,
          "Life": 0.6
        },
        conflict: "RRH begins her travel in order to deliver the food",
        characters: ["Red Riding Hood"]
      },
      {
        type: "Regular Scene",
        name: "A short intermission",
        description: "...",
        t: 0.3,
        location: "Ad Space",
        throughline: "Objective",
        values: {
          "Suspense": 0.7,
          "Life": 0.4
        },
        conflict: "",
        characters: []
      },
      {
        type: "Regular Scene",
        name: "Monologue of the wolf",
        description: "...",
        t: 0.4,
        location: "Forest",
        throughline: "Influence Character",
        values: {
          "Suspense": 0.4,
          "Life": 0.7
        },
        conflict: "",
        characters: ["Wolf"]
      },
      {
        type: "Central Point",
        name: "Wolf attacks",
        description: "...",
        t: 0.7,
        location: "Forest",
        throughline: "Relationship",
        values: {
          "Suspense": 0.7,
          "Life": 0.3
        },
        conflict: "RRH wants to deliver food; Wolf eats her first.",
        characters: ["Red Riding Hood", "Wolf"]
      },
      {
        type: "Climax",
        name: "Hunter guts wolf",
        description: "...",
        t: 0.8,
        location: "Granny's Home",
        throughline: "Relationship",
        values: {
          "Suspense": 0.4,
          "Life": 0.7
        },
        conflict: "Wolf wants to stay alive; Hunter cuts wolf open",
        characters: ["Hunter", "Wolf", "Granny", "Red Riding Hood"]
      }
    ],
  } ;

    model.story.name = data.name;
    model.story.description = data.description;
    model.initFields();

    data.locations.forEach(function(location){
      control.addLocation(location.name);
    });

    data.values.forEach(function(valueName){
      control.addValue(valueName);
    });

    data.characters.forEach(function(params){
      control.addCharacter(params);
    });

    view.scope = model.story.values.entries().next().value[0];

    data.scenes.forEach(function(params){
      control.addScene(params);
    });

    model.story.scenes[0].active = true;
    view.updateSceneSprites();
    view.setupGui();
    view.updateGui();
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
