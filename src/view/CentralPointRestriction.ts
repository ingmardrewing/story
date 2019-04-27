import View from '../view/View';

export default class CentralPointRestriction {
  lowerLimit :number;
  upperLimit :number;

  constructor(view :View) {
    this.lowerLimit = view.thres.CP;
    this.upperLimit = view.thres.CP;
  }
}
