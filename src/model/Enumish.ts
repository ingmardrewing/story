export default class Enumish{
  name :string;
  id :string;

  constructor(id :string, name :string){
    this.name = name;
    this.id = id;
  }

  get(fieldName :string){
    if (fieldName === "name") {
      return this.name;
    }
    if (fieldName === "id") {
      return this.id;
    }
  }
}

