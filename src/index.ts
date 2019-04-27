var hotkeys = require('hotkeys-js').default;

import Model from './model/Model';
import View from './view/View.js';
import Control from './control/Control.js';
import Service from './service/Service.js';

let service :Service;
let model :Model;
let view :View;
let control :Control;

service = new Service();
model = new Model();
control = new Control(model, service);
service.setControl(control);
view = new View(model, control);
control.setView(view);
model.initFields();

view.initP5();

console.log(hotkeys)

hotkeys(
  "ctr+z,cmd+z",
  function keyPressed() { control.undo();}
);
hotkeys(
  "ctr+shift+z,cmd+shift+z",
  function keyPressed() { control.redo();
});
hotkeys(
  "enter,return",
  function keyPressed() { $(".save").trigger("click");}
);

