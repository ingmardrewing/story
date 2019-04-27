import View from '../view/View';

export default class ClimaxRestriction {
  lowerLimit :number;
  upperLimit :number;

  constructor(view :View) {
    this.lowerLimit = view.thres.PP2;
    this.upperLimit = view.thres.END;
  }
}
