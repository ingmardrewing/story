let model, view, control;

let w = 1000;
let h = 500;

function setup() {
  createCanvas(w, h);
  model = new Model();
  control = new Control(model, view);
  view = new View(model, control);

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
        archetype: "protagonist",
      },
      {
        name: "Wolf",
        archetype: "antagonist"
      },
      {
        name: "Granny",
        archetype: "reason"
      },
      {
        name: "Hunter",
        archetype: "guardian"
      }
    ],
    scenes: [
      {
        type: "Inciting Incident",
        title: "Start delivery",
        description: "...",
        t: 0.2,
        location: "Forest",
        values: {
          "Suspense": 0.4,
          "Life": 0.9
        },
        conflict: "RRH begins her travel in order to deliver the food",
        characters: ["Red Riding Hood"]
      },
      {
        type: "Regular Scene",
        title: "A short intermission",
        description: "...",
        t: 0.5,
        location: "Ad Space",
        values: {
          "Suspense": 0.0,
          "Life": 0.1
        },
        conflict: "",
        characters: []
      },
      {
        type: "Central Point",
        title: "Wolf attacks",
        description: "...",
        t: 0.5,
        location: "Forest",
        values: {
          "Suspense": 0.5,
          "Life": 0.1
        },
        conflict: "RRH wants to deliver food; Wolf eats her first.",
        characters: ["Red Riding Hood", "Wolf"]
      },
      {
        type: "Climax",
        title: "Hunter guts wolf",
        description: "...",
        t: 0.8,
        location: "Granny's Home",
        values: {
          "Suspense": 0.1,
          "Life": 1.0
        },
        conflict: "Wolf wants to stay alive; Hunter cuts wolf open",
        characters: ["Hunter", "Wolf", "Granny", "Red Riding Hood"]
      }
    ],
  });
}

function draw() {
  clear();
  let scenes = model.getScenes();
  for (let s of scenes) {
    fill( s.dragged ? '#FF0000' : '#FFFFFF' );
    let sx = Math.round(s.t * w);
    let sy = Math.round(s.values[view.scope]* h);
    ellipse(sx, sy, view.sceneRadius, view.sceneRadius);
  }
}

function mousePressed(e) {
  e.preventDefault();
  let scenes = model.getScenes();
  let noHit = true;
  for (let s of scenes) {
    let y = s.values[view.scope] ? s.values[view.scope] * h : 0;
    let distance = dist(mouseX, mouseY, s.t * w, y );
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
  }
  return false;
}

function createSceneAt(x, y) {
  let vo = model.getValuesObject();
  vo[view.scope] = mouseY / h;
  control.addScene({
    title: "",
    description: "...",
    t: mouseX / w,
    values: vo,
    conflict: "",
    characters: []
  })
}

function mouseReleased(e) {
  e.preventDefault();
  let scenes = model.getScenes();
  for (let s of scenes) {
    s.dragged = false;
  }
  return false;
}

function mouseDragged(e) {
  e.preventDefault();
  let scenes = model.getScenes();
  for (let s of scenes) {
    if (s.dragged) {
      let t = mouseX / w ;
      s.t = t < s.lowerLimit ? s.lowerLimit :
            t > s.upperLimit ? s.upperLimit : t;
      s.values[view.scope] = mouseY / h;
      return false;
    }
  }
  return false;
}
