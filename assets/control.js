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

    for (let charName in params.characters) {
      let char = this.model.getCharacterByName(charName);
      if(char) {
        characters.push(char);
      }
    }

    let loc = this.model.getLocationByName(params.location);

    switch(params.type) {
      case TypeNames.INCITING_INCIDENT: {
        this.model.addScene(new IncitingIncident(params, characters,  loc));
        break;
      }
      case TypeNames.PLOT_POINT_I: {
        this.model.addScene(new PlotPoint1(params, characters, loc));
        break;
      }
      case TypeNames.CENTRAL_POINT: {
        this.model.addScene(new CentralPoint(params, characters, loc));
        break;
      }
      case TypeNames.PLOT_POINT_II: {
        this.model.addScene(new PlotPoint2(params, characters, loc));
        break;
      }
      case TypeNames.CLIMAX: {
        this.model.addScene(new Climax(params, characters, loc));
        break;
      }
      default: {
        this.model.addScene(new Scene(params, characters, loc));
        break;
      }
    }
  }
}
