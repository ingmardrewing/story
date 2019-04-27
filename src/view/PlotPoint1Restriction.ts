import View from '../view/View';

export default class PlotPoint1Restriction {
  lowerLimit :number;
  upperLimit :number;

  constructor(view :View) {
    this.lowerLimit = view.thres.PP1;
    this.upperLimit = view.thres.PP1;
  }
}
