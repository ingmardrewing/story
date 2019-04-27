import View from '../view/View';

export default class IncitingIncidentRestriction {
  lowerLimit :number;
  upperLimit :number

  constructor(view :View) {
    this.lowerLimit = view.thres.START;
    this.upperLimit = view.thres.PP1;
  }
}
