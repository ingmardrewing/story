class Control {

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

    view.updateSceneSprites();
  }

  addValue(valueName) {
    let value = new StoryValue(valueName);
    model.addStoryValue(value);
  }

  addCharacter(params) {
    let char = new Character(params);
    model.addCharacter(char);
  }

  addLocation(locationName) {
    let loc = new Location(locationName);
    model.addCharacter(loc);
  }

  addScene (params) {
    let characters = [];

    for (let charName in params.characters) {
      let char = model.getCharacterByName(charName);
      if(char) {
        characters.push(char);
      }
    }

    let loc = model.getLocationByName(params.location);
    let type = model.getSceneTypeByName(params.type)

    model.addScene(new Scene(params, characters, loc, type));
  }
  addUi(id) {
    for( let v in model.getValuesObject()) {
      var link = document.createElement("a");
      link.setAttribute("href", "javascript:selectValue('"+v+"');")
      link.appendChild(document.createTextNode(v));
      var br = document.createElement("br")
      document.getElementById(id).appendChild(link);
      document.getElementById(id).appendChild(br);
    }
  }
}

function createSceneAt(x, y) {
  let vo = model.getValuesObject();
  vo[view.scope] = mouseY / view.h;
  control.addScene({
    title: "",
    description: "...",
    location: "",
    t: mouseX / view.w,
    values: vo,
    conflict: "",
    characters: []
  })
}


