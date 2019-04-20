export default class ClimaxRestriction {
  constructor(view) {
    this.lowerLimit = view.thres.PP2;
    this.upperLimit = view.thres.END;
  }
}
