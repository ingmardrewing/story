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

class FieldViewFactory {
  static makeFormField(id, dataField, entity) {
    switch(dataField.constructor.name){
      case "Image": {
        return new ImageView( id, dataField, entity );
        break;
      }
      case "ShortText": {
        return new ShortTextView( id, dataField, entity );
        break;
      }
      case "LongText": {
        return new LongTextView( id, dataField, entity );
        break;
      }
      case "SingleValueList": {
        return new SingleValueListView( id, dataField, entity );
        break;
      }
      case "MultipleValueList": {
        return new MultipleValueListView( id, dataField, entity );
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
    this.$navi = undefined;

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

    let $readFileLink = $('<input type="file" id="input">');
    $readFileLink.change(service.read);
    $('#navi').append($readFileLink);

    let $saveFileLink = $('<a>save</a>');
    $saveFileLink.click(service.save);
    $('#navi').append($saveFileLink);
  }

  updateGui() {
    this.$guiCol2.empty();
    this.$guiCol3.empty();

    let characters= new List(
      this.$guiCol2,
      'Characters',
      model.story.characters,
      '+ add character',
      'addCharacter');
    characters.render();

    let storyValues = new List(
      this.$guiCol3,
      'Story Values',
      model.story.values,
      '+ add story value',
      'addValue');
    storyValues.render();

    let locations = new List(
      this.$guiCol3,
      'Locations',
      model.story.locations,
      '+ add location',
      'addLocation');
    locations.render();
  }

  updateDetailView(entity) {
    this.$guiCol1.empty();
    this.detailViewEntity = entity;
    let v = new DetailView(this.$guiCol1, entity);
    v.display();
  }
}

class List {
  constructor($container, headline, entities, addLabel, addFunction){
    this.$container = $container;
    this.headline = headline;
    this.entities = entities;
    this.addLabel = addLabel;
    this.addFunction = addFunction;
  }

  render(){
    this.createHeadline();
    this.createList();
    this.createAdd();
  }

  createHeadline(){
    this.$container.append(`<h2 class="storyItem">${this.headline}</h2>`);
  }

  createList(){
    let $c = this.$container;
    this.entities.forEach(function(k,v){
      let l = new ListItem(v.get ? v : k);
      $c.append(l.renderJQuery());
    });
  }

  createAdd(){
    this.$container.append(`<a class="storyItem storyItemAdd" href="javascript:control.${this.addFunction}();">${this.addLabel}</a>`);
  };
}

class ListItem {
  constructor(entity){
    this.entity = entity;
  }

  renderJQuery() {
    let $item = $(`<div class="storyItem"></div>`);
    for (let action of ['select', 'edit', 'delete']) {
      $item.append(this.createButtonFor(action));
    }
    return $item;
  }

  createButtonFor(action) {
    let label = action === 'select' ? this.entity.get("name"): action;
    let button = $(`<a class="${action}">${label}</a>`)
    let entity = this.entity;
    button.click(function(){ control[action](entity); });
    return button;
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

class DetailView {
  constructor($htmlParent, entity){
    this.$htmlParent = $htmlParent;
    this.entity = entity;
  }

  display() {
    if (! this.entity) {
      return
    }
    this.createHeadline();
    this.createContent();
  }

  createHeadline(){
    this.$htmlParent.append(`<h2 class="storyItem">${this.entity.constructor.name}: ${this.entity.get('name')}</h2>`);
  }

  createContent() {
    let $storyItem = $(`<div class="storyItem"></div>`);
    let c = 0;
    let e = this.entity;

    e.fields.forEach(function(v, fieldType ){
      let id = "viewField_" + c++;
      let fv = FieldViewFactory.makeFormField(id, fieldType, e);
      if ( fieldType.name === 'image'){
        $storyItem.prepend(fv.assembleView());
        $storyItem.addClass("withImage");
      }
      else {
        $storyItem.append(fv.assembleView());
      }
    });

    let $link = $(`<a class="edit">edit</a>`);
    $link.click(function(){ control.edit(e); });
    $storyItem.append($link);

    this.$htmlParent.append($storyItem);
  }
}

class ModalDialogue {
  constructor(name, $htmlBody, entity){
    this.overlay = "";
    this.form = "";
    this.fields = [];
    this.idcounter = 0;
    this.name= name;
    this.$htmlBody = $htmlBody;

    let formFields = this.fields;
    let c = this.idcounter;
    entity.fields.forEach(function(v, fieldType){
      let id = "modalField_" + c++;
      formFields.push(
       FieldViewFactory.makeFormField(id, fieldType, entity)
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

class FieldView {
  constructor(id, dataField, entity){
    this.id = id;
    this.dataField = dataField;
    this.entity = entity;
  }

  fieldValue() {
    return this.entity.fields.get(this.dataField);
  }

  assembleHtml() {
    let input = this.assembleInput();
    return `<label class="formLabel" for="${this.id}">${this.dataField.label}</label>
          ${input}`;
  }

  assembleInput(){ return ""; }

  assembleView() {
    if(this.fieldValue()){
      return this.layout(this.dataField.label, this.fieldValue());
    }
    return '';
  }

  layout(label, value){
    return `<div>
        <div class="fieldLabel">${label}:</div>
        <div class="fieldValue">${value || ''}</div>
      </div>`;
  }

  save() {
    let value = $('#' + this.id).val();
    control.updateModelField(
      this.entity,
      this.dataField,
      value
    );
  }
}

class ShortTextView extends FieldView {
  assembleInput(){
    return `<input class="formInput" name="${this.id}" id="${this.id}" type="text" value="${this.fieldValue()}" />`;
  }
}

class ImageView extends FieldView {
  assembleInput(){
    return `<input class="formInput" name="${this.id}" id="${this.id}" type="text" value="${this.fieldValue() || ''}" />`;
  }

  assembleView() {
    if (this.fieldValue()){
     return `<div class="imgContainer"><img src="${this.fieldValue()}"></div>`;
    }
    return "";
  }
}

class LongTextView extends FieldView {
  assembleInput(){
    return `<textarea class="formInput" name="${this.id}" id="${this.id}" type="text">${this.fieldValue() || ''}</textarea>`;
  }
}

class SingleValueListView extends FieldView {
  assembleInput(){
    return `<select id="${this.id}" name="${this.id}">${this.options()}</select>`
  }

  options() {
    let options = "";
    let self = this;

    this.dataField.characteristic.forEach(function(v, k){
      let obj = v.id ? v : k;
      let selected = '';
      if(self.fieldValue()){
        selected = self.fieldValue().id === obj.id ? ' selected="selected"' : '';
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

  assembleView() {
    if(this.fieldValue()) {
      return this.layout(this.dataField.label, this.fieldValue().get("name"));
    }
    return '';
  }
}

class MultipleValueListView extends FieldView {
  assembleInput(){
    let html = `<div>`;
    let preselected = this.fieldValue();

    this.dataField.characteristic.forEach(function(v, k, m){
      let checked = preselected.includes(v) ? ` checked="checked"` : '';
      html += `<div style="display:inline-block; margin-right: 10px; margin-bottom: 10px;"><input id="${v.id}" type="checkbox" name="${v.id}" value="${v.id}"${checked}><label for="${v.id}">${v.get("name")}</label></div>`
    });
    html += `</div>`;

    return html;
  }

  assembleView() {
    let values = this.fieldValue();
    if (values) {
      let names = [];
      for (let v of values) {
        names.push(v.get("name"));
      }
      return this.layout(this.dataField.label, names.join(', '));
    }
    return "";
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

