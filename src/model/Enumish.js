export default class Enumish{
  constructor(id, name){
    this.name = name;
    this.id = id;
  }
  get(fieldName){
    return this[fieldName];
  }
}

