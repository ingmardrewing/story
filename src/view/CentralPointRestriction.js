export default class CentralPointRestriction {
  constructor(view) {
    this.lowerLimit = view.thres.CP;
    this.upperLimit = view.thres.CP;
  }
}
