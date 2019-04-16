const color = {
  SCENE_FILL: '#FFFFFF',
  SCENE_FILL_ACTIVE: '#FFAA00',
  SCENE_BORDER: '#000000'
};
Object.freeze(color);

const thres = {
  START: 0,
  PP1: 0.25,
  CP: 0.5,
  PP2: 0.75,
  END: 1
}
Object.freeze(thres);

class FormFactory {
  static makeFormField(id, dataField, entity) {
    switch(dataField.constructor.name){
      case "ShortText": {
        return new TextFieldNG( id, dataField, entity );
        break;
      }
      case "LongText": {
        return new TextAreaNG( id, dataField, entity );
        break;
      }
      case "SingleValueList": {
        return new DropDownNG( id, dataField, entity );
        break;
      }
      case "MultipleValueList": {
        return new CheckboxesNG( id, dataField, entity );
        break;
      }
    }
  }
}

class  View {
  constructor(){
    this.sceneRadius = 15;
    this.sceneSprites = [];
    this.$guiContainer = undefined;
    this.$guiCol1 = undefined;
    this.$guiCol2 = undefined;
    this.$guiCol3 = undefined;
    this.$guiCol4 = undefined;

    this.w = 1200;
    this.h = 300;

    this.detailViewEntity = undefined;
  }

  setScope(scope) {
    this.scope = scope;
  }

  updateSceneSprites() {
    this.sceneSprites = [];
    for(let s of model.getScenes()) {
      let restriction = getRestriction(s.get("type"));
      let sprite = new SceneSprite(s, restriction);
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
    this.updateDetailView(view.detailViewEntity);
    this.updateGui();
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
    if(this.$guiContainer) {
      // Col 2
      this.$guiCol2.empty();
      this.$guiCol2.append(`<h2 class="storyItem">Characters</h2>`);
      for( let c of model.story.characters) {
        view.$guiCol2.append(view.buildStoryItem(c));
      }
      this.$guiCol2.append(`<a class="storyItem storyItemAdd" href="javascript:control.addCharacter();">+ add character</a>`);

      // Col 3
      this.$guiCol3.empty();
      this.$guiCol3.append(`<h2 class="storyItem">Story Values</h2>`);
      model.story.values.forEach(function(k,v,m) {
        view.$guiCol3.append(view.buildStoryItem(v))
      });
      this.$guiCol3.append(`<a class="storyItem storyItemAdd" href="javascript:control.addValue();">+ add story value</a>`);

      this.$guiCol3.append(`<h2 class="storyItem">Locations</h2>`);
      model.story.locations.forEach(function(k,v,m){
        view.$guiCol3.append(view.buildStoryItem(v))
      });
      this.$guiCol3.append(`<a class="storyItem storyItemAdd" href="javascript:control.addLocation();">+ add location</a>`);
    }
  }

  updateDetailView(entity) {
    if(!(entity && entity.constructor)){
      return ;
    }
    this.detailViewEntity = entity;

    this.$guiCol1.empty();
    this.$guiCol1.append(`<h2 class="storyItem">${entity.constructor.name}: ${entity.name}</h2>`);

    let $storyItem = this.assembleDetailViewHtml(entity);
    let $link = $(`<a class="edit">edit</a>`);
    $link.click(function(){ control.edit(entity); });
    $storyItem.append($link);
    let img = entity.image ? `<div class="imgContainer"><img src="${entity.image}"></div>`:"";
    this.$guiCol1.append(img);
    this.$guiCol1.append($storyItem);
  }

  displayArrayOfObj (arr) {
    let a2 = [];
    for (let o of arr) {
      a2.push(o.get("name"));
    }
    return a2.join(", ");
  }

  assembleDetailViewHtml(entity){
    let $storyItem = $(`<div class="storyItem"></div>`);
    entity.fields.forEach(function(v, k){
      console.log(v,k)
      if(k.name === "image") {
        if (v.length > 0){
          $storyItem.prepend(`<div><img src="${v}"></div>`);
        }
      }
      else {
        console.log("-->", v);
        let txt = v instanceof Array ? view.displayArrayOfObj(v) :
                           v && v.id ? v.get("name") :
                                       v ;
        $storyItem.append(`<div>
            <div class="fieldLabel">${k.label}:</div>
            <div class="fieldValue">${txt}</div>
          </div>`);
      }
    });
    return $storyItem;
  }

  buildStoryItem (entity) {
    let select = $(`<a class="choose">${entity.get("name")}</a>`)
    select.click(function(){ control["select"](entity); })

    let edit = $(`<a class="edit">edit</a>`);
    edit.click(function(){ control.edit(entity); })

    let del = $(`<a class="delete">delete</a>`);
    del.click(function(){ control["delete"](entity); })

    let $item = $(`<div class="storyItem"></div>`);
    $item.append(select);
    $item.append(edit);
    $item.append(del);
    return $item;
  }
}

class SceneSprite {
  constructor(scene, restriction){
    this.scene = scene;
    this.restriction = restriction;
    this.x = 0;
    this.y = 0;

    this.destX = 0;
    this.destY = 0;

    this.dragged = false;
  }

  setPosition(x, y) {
    this.x = x < this.restriction.lowerLimit * view.w ? this.restriction.lowerLimit * view.w
           : x > this.restriction.upperLimit * view.w ? this.restriction.upperLimit * view.w
           :                                x ;
    this.y = y ;
  }

  setDestination(x, y) {
    this.destX = x < this.restriction.lowerLimit * view.w ? this.restriction.lowerLimit * view.w
               : x > this.restriction.upperLimit * view.w ? this.restriction.upperLimit * view.w
               :                                x ;
    this.destY = y;
  }

  readDestinationFromModel() {
    let y =  this.scene.values.get(view.scope);
    this.setDestination(
      this.scene.t * view.w,
      y * view.h
    );
  }

  syncPosition() {
    this.setPosition(this.destX, this.destY);
  }

  approxPosition() {
    this.setPosition(
      this.x + (this.destX - this.x) / 4,
      this.y + (this.destY - this.y) / 4
    );
  }
}

function getRestriction(sceneType) {
  switch(sceneType.name) {
    case sceneTypeNames.INCITING_INCIDENT:{
      return new IncitingIncidentRestriction();
    }
    case sceneTypeNames.PLOT_POINT_1:{
      return new PlotPoint1Restriction();
    }
    case sceneTypeNames.CENTRAL_POINT:{
      return new CentralPointRestriction();
    }
    case sceneTypeNames.PLOT_POINT_2:{
      return new PlotPoint2Restriction();
    }
    case sceneTypeNames.CLIMAX:{
      return new ClimaxRestriction();
    }
  }
  return new RegularRestriction();
}

class RegularRestriction {
  constructor(){
    this.lowerLimit = thres.START;
    this.upperLimit = thres.END;
  }
}

class IncitingIncidentRestriction {
  constructor() {
    this.lowerLimit = thres.START;
    this.upperLimit = thres.PP1;
  }
}

class PlotPoint1Restriction {
  constructor() {
    this.lowerLimit = thres.PP1;
    this.upperLimit = thres.PP1;
  }
}

class CentralPointRestriction {
  constructor() {
    this.lowerLimit = thres.CP;
    this.upperLimit = thres.CP;
  }
}

class PlotPoint2Restriction {
  constructor() {
    this.lowerLimit = thres.PP2;
    this.upperLimit = thres.PP2;
  }
}

class ClimaxRestriction {
  constructor() {
    this.lowerLimit = thres.PP2;
    this.upperLimit = thres.END;
  }
}

class ModalDialogue {
  constructor(name, $htmlBody, entity, fieldNames){
    this.overlay = "";
    this.form = "";
    this.fields = [];
    this.idcounter = 0;
    this.name= name;
    this.$htmlBody = $htmlBody;

    let formFields = this.fields;
    let c = this.idcounter;
    entity.fields.forEach(function(v, fieldType, m){
      let id = "modalField_" + c++;
      formFields.push(
       FormFactory.makeFormField(id, fieldType, entity)
      );
    });
  }

  open() {
    this.assembleForm();
    this.assembleOverlay();
    this.displayOverlay();
  }

  assembleForm() {
    this.form = `<form class="overlayForm"><div class="formGrid">`;
    for (let f of this.fields) {
      this.form += f.assembleHtml();
    }
    this.form += `</div></form>`;
  }

  assembleOverlay() {
    let self = this;
    let $container = $(`<div class="formContainer">
      <h2>${this.name}</h2>
      ${this.form}
    </div>`);

    let $close = $(`<a class="close">cancel</a>`);
    $close.click(function(){
      self.removeOverlay();
    });
    $container.append($close)

    let $save = $(`<a class="save">save</a>`);
    $save.click(function(){
      self.save();
    });
    $container.append($save)

    this.$overlay = $(`<div class="overlay"></div>`);
    this.$overlay.append($container);
  }

  displayOverlay() {
    this.$htmlBody.append(this.$overlay);
  }

  removeOverlay() {
    this.$overlay.remove();
    loop();
  }

  save(){
    for(let f of this.fields) {
      f.save();
    }
    this.removeOverlay();
  }
}

class FormFieldNG {
  constructor(id, dataField, entity){
    this.id = id;
    this.dataField = dataField;
    this.entity = entity;
  }

  assembleHtml() {
    let input = this.assembleInput();
    return `<label class="formLabel" for="${this.id}">${this.dataField.label}</label>
          ${input}`;
  }

  assembleInput(){ return ""; }

  save() {
    control.updateModelField(
      this.entity,
      this.dataField,
      $('#' + this.id).val()
    );
  }
}

class TextFieldNG extends FormFieldNG {
  assembleInput(){
    let val = this.entity.fields.get(this.dataField) || '';
    return `<input class="formInput" name="${this.id}" id="${this.id}" type="text" value="${val}" />`;
  }
}

class TextAreaNG extends FormFieldNG {
  assembleInput(){
    let val = this.entity.fields.get(this.dataField) || '';
    return `<textarea class="formInput" name="${this.id}" id="${this.id}" type="text">${val}</textarea>`;
  }
}

class DropDownNG extends FormFieldNG {
  assembleInput(){
    let curVal = this.entity.fields.get(this.dataField);
    return `<select id="${this.id}" name="${this.id}">${this.options()}</select>`
  }

  options() {
    let curVal = this.entity.fields.get(this.dataField);
    let options = "";

    this.dataField.characteristic.forEach(function(v, k){
      let obj = v.id ? v : k;
      let selected = '';
      if(curVal){
        selected = curVal.id === obj.id ? ' selected="selected"' : '';
      }
      options += `<option value="${obj.id}"${selected}>${obj.get("name")}</option>`
    });
    return options;
  }

  findSelected() {
    let identifier = $('#' + this.id).val();
    let res;
    this.dataField.characteristic.forEach(function(v,k){
      let obj = v.id ? v : k;
      if(obj.id === identifier) {
        res = obj;
      }
    });
    return res;
  }

  save() {
    let selection = this.findSelected();
    control.updateModelField(
      this.entity,
      this.dataField,
      selection);
  }
}

class CheckboxesNG extends FormFieldNG {
  assembleInput(){
    let html = `<div>`;
    let preselected = this.entity.fields.get(this.dataField);

    this.dataField.characteristic.forEach(function(v, k, m){
      let checked = preselected.includes(v) ? ` checked="checked"` : '';
      html += `<div style="display:inline-block; margin-right: 10px; margin-bottom: 10px;"><input id="${v.id}" type="checkbox" name="${v.id}" value="${v.id}"${checked}><label for="${v.id}">${v.get("name")}</label></div>`
    });
    html += `</div>`;

    return html;
  }

  save () {
    let newCharacters = [];
    this.dataField.characteristic.forEach(function(v, k, m){
      if($('#' + v.id).prop("checked")){
        newCharacters.push(v);
      }
    });
    control.updateModelField(
      this.entity,
      this.dataField,
      newCharacters
    );
  }
}

class FormField {
    constructor(id, name, value, model, modelFieldname) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.model = model;
    this.modelFieldName = modelFieldname;
  }

  assembleHtml() {
    let input = this.assembleInput();
    return `
          <label class="formLabel" for="${this.id}">${this.name}</label>
          ${input}`;
  }

  assembleInput(){ return ""; }

  save() {
    control.updateModelField(
      this.model,
      this.modelFieldName,
      $('#' + this.id).val()
    );
  }
}

class TextField extends FormField {
  assembleInput(){
    return `<input class="formInput" name="${this.id}" id="${this.id}" type="text" value="${this.value || '' }" />`;
  }
}

class SceneTypeDropDown extends FormField {
  assembleInput(){
    let select = `<select id="${this.id}" name="${this.id}">`

    let currentSym = this.model[this.modelFieldName];
    for (let key in this.value) {
      let sym = this.value[key]
      let selected = currentSym === sym ? ` selected="selected"` : "";
      select += `<option value="${sym.description}"${selected}>${sym.description}</option>`
    }
    select +="</select>"
    return select;
  }

  save() {
    let sym;
    for (let key in this.value) {
      let currentsym = this.value[key]
      if(currentsym.description === $('#' + this.id).val()){
        sym = currentsym;
        break;
      }
    }
    control.removeSceneTypeFromScenes(sym);
    control.updateModelField(
      this.model,
      this.modelFieldName,
      sym
    );
  }
}

class CharacterCheckboxes extends FormField {
  assembleInput(){
    let html = `<div>`;
    for( let c of model.story.characters ){
      let checked = this.model.characters.includes(c) ? ` checked="checked"` : "";
      html += `<div style="display:inline-block; margin-right: 10px; margin-bottom: 10px;"><input id="${c.id}" type="checkbox" name="${c.id}" value="${c.id}"${checked}><label for="${c.id}">${c.get("name")}</label></div>`
    }
    html += `</div>`;
    return html;
  }

  save () {
    let newCharacters = [];
    for( let c of model.story.characters ){
      if($('#' + c.id).prop("checked")){
        newCharacters.push(c);
      }
    }
    control.updateModelField(
      this.model,
      this.modelFieldName,
      newCharacters
    );
  }
}
