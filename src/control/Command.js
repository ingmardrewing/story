export default class Command {
  constructor(payload){
    this.payload = payload;
    this.model = payload.model;
    this.view = payload.view;
    this.control = payload.control;
    this.service = payload.service;
  }
}

