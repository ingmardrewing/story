let model, view, control;

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
      title: "Start delivery",
      description: "...",
      t: 0.2,
      suspense: 0.5,
      values: [],
      conflict: "RRH begins her travel in order to deliver the food",
      characters: ["Red Riding Hood"]
    },
    {
      title: "Wolf attacks",
      description: "...",
      t: 0.5,
      suspense: 1.0,
      values: [],
      conflict: "RRH wants to deliver food; Wolf eats her first.",
      characters: ["Red Riding Hood", "Wolf"]
    },
    {
      title: "Hunter guts wolf",
      description: "...",
      t: 0.8,
      suspense: 0.5,
      values: [],
      conflict: "Wolf wants to stay alive; Hunter cuts wolf open",
      characters: ["Hunter", "Wolf", "Granny", "Red Riding Hood"]
    }
  ],
});
