import Model from '../model/Model';
import View from '../view/View';
import Control from 'Control';
import Service from '../service/Service';

export default class Command {
  payload :any;
  model :Model;
  view :View;
  control :Control;
  service :Service;

  constructor(payload :any){
    this.payload = payload;
    this.model = payload.model;
    this.view = payload.view;
    this.control = payload.control;
    this.service = payload.service;
  }

  do(){}

  undo(){}
}

