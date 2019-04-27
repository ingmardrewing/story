export default class Field {
  name :string;
  label :string;
  description: string;
  characteristic: any;

  constructor(
      name: string,
      label :string,
      description :string,
      characteristic :any) {
    this.name = name;
    this.label = label;
    this.description = description;
    this.characteristic = characteristic;
  }
}
