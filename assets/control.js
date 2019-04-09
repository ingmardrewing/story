class Control {
  model;
  view;

  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init(s) {
    model.story = new Story();
    model.story.title = s.title;
    model.story.description = s.description;
    let c = this

    s.values.forEach(function(valueName){
      c.addValue(valueName);
    });

    s.characters.forEach(function(params){
      c.addCharacter(params);
    });

    s.scenes.forEach(function(params){
      c.addScene(params);
    });
  }

  addValue(valueName) {
    let value = new StoryValue(valueName);
    this.model.addStoryValue(value);
  }

  addCharacter(params) {
    let char = new Character(params);
    this.model.addCharacter(char);
  }

  addLocation(locationName) {
    let loc = new Location(locationName);
    this.model.addCharacter(loc);
  }

  addScene (params) {
    let characters = [];
    let values = [];
    let locations = [];

    for (let val in params.values) {
      let v = this.model.getStoryValueByName(val);
      if (v) {
        values.push(v);
      }
    }

    for (let charName in params.characters) {
      let char = this.model.getCharacterByName(charName);
      if(char) {
        characters.push(char);
      }
    }

    for (let loc in params.locations) {
      let l = this.model.getLocationByName(loc);
      if(l) {
        locations.push(l);
      }
    }

    let scene = new Scene(params, characters, values, locations);
    this.model.addScene(scene);
  }
}