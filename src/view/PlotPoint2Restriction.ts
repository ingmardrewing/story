import View from '../view/View';

export default class PlotPoint2Restriction {
  lowerLimit :number;
  upperLimit :number;

  constructor(view :View) {
    this.lowerLimit = view.thres.PP2;
    this.upperLimit = view.thres.PP2;
  }
}


