import Model from '../model/Model';
import Field from '../model/Field';
import Control from 'Control';
import Service from '../service/Service';
import View from '../view/View';
import Value from '../model/Value';
import Character from '../model/Character';
import Location from '../model/Location';
import Scene from '../model/Scene';

export default class Params {
  model :Model;
  control :Control;
  service :Service;
  view :View;
  valueName :string;
  value :Value;
  character :Character;
  scene :Scene;
  location :Location;
  image :string;
  motivation: string;
  evaluation :string;
  methodology :string;
  purpose :string;
  name :string;
  description:string;
  entity:any;
  id :string;
  characters :Array<any>;
  values :Array<any>;
  throughlines :Array<any>;
  t: any;
  conflict :string;
  type :any;
  oldT :number;
  oldY :number;
  newT :number;
  newY :number;
  newValue :any;
  fieldName :Field;

  constructor(
      model :Model,
      view :View,
      control :Control,
      service :Service) {
    this.model = model;
    this.view = view;
    this.control = control;
    this.service = service;
  }
}
