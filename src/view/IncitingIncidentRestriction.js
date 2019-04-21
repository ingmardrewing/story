export default class IncitingIncidentRestriction {
  constructor(view) {
    this.lowerLimit = view.thres.START;
    this.upperLimit = view.thres.PP1;
  }
}
