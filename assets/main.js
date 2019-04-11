let model, view, control;

function setup() {

  model = new Model();
  control = new Control();
  view = new View();

  createCanvas(view.w, view.h);

  control.init({
    title: "Red Riding Hood",
    description: "A food delivery service employee gets eaten by a wolf and reemerges from his belly once the wolf gets killed and cut open.",
    locations:[
      "Forest",
      "Granny's Home"
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
        type: "INCITING_INCIDENT",
        title: "Start delivery",
        description: "...",
        t: 0.2,
        location: "Forest",
        throughline: "MAIN_CHARACTER",
        values: {
          "Suspense": 0.5,
          "Life": 0.5
        },
        conflict: "RRH begins her travel in order to deliver the food",
        characters: ["Red Riding Hood"]
      },
      {
        type: "REGULAR_SCENE",
        title: "A short intermission",
        description: "...",
        t: 0.3,
        location: "Ad Space",
        throughline: "OBJECTIVE",
        values: {
          "Suspense": 0.5,
          "Life": 0.5
        },
        conflict: "",
        characters: []
      },
      {
        type: "REGULAR_SCENE",
        title: "Monologue of the wolf",
        description: "...",
        t: 0.4,
        location: "Forest",
        throughline: "INFLUENCE_CHARACTER",
        values: {
          "Suspense": 0.5,
          "Life": 0.5
        },
        conflict: "",
        characters: ["Wolf"]
      },
      {
        type: "CENTRAL_POINT",
        title: "Wolf attacks",
        description: "...",
        t: 0.7,
        location: "Forest",
        throughline: "RELATIONSHIP",
        values: {
          "Suspense": 0.5,
          "Life": 0.5
        },
        conflict: "RRH wants to deliver food; Wolf eats her first.",
        characters: ["Red Riding Hood", "Wolf"]
      },
      {
        type: "CLIMAX",
        title: "Hunter guts wolf",
        description: "...",
        t: 0.8,
        location: "Granny's Home",
        throughline: "RELATIONSHIP",
        values: {
          "Suspense": 0.5,
          "Life": 0.5
        },
        conflict: "Wolf wants to stay alive; Hunter cuts wolf open",
        characters: ["Hunter", "Wolf", "Granny", "Red Riding Hood"]
      }
    ],
  });
  control.addUi("proxyui");
}

function draw() {
  clear();
  let lastX = -1;
  let lastY = -1;
  stroke(102);
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
  for (let s of view.sceneSprites) {
    fill( s.dragged ? color.SCENE_FILL_ACTIVE : color.SCENE_FILL);
    ellipse(s.x, s.y, view.sceneRadius, view.sceneRadius);
  }
}

function mousePressed(e) {
  e.preventDefault();
  let noHit = true;
  for (let s of view.sceneSprites) {
    let distance = dist(mouseX, mouseY, s.x, s.y );
    if (distance < view.sceneRadius) {
      s.dragged = true;
      noHit = false;
    }
    else {
      s.dragged = false;
    }
  }
  if (noHit) {
    createSceneAt(mouseX, mouseY);
    view.updateSceneSprites();
  }
  return false;
}

function mouseDragged(e) {
  e.preventDefault();
  for (let s of view.sceneSprites) {
    if (s.dragged) {
      s.setPosition(mouseX, mouseY);
      return false;
    }
  }
  return false;
}

function mouseReleased(e) {
  e.preventDefault();
  for (let s of view.sceneSprites) {
    if (s.dragged){
      s.dragged = false;
      s.writeToModel();
      s.readDestinationFromModel();
      s.syncPosition();
      model.sort();
      view.update();
    }
  }
  return false;
}

function selectValue(val){
  view.scope = val;
  view.update();
}
