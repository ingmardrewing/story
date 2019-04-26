export default class RenderTimer {
  constructor(sk){
    this.sk = sk;
  }
  setTimer(millisTilHalt){
    let self = this;
    this.id = setTimeout(()=>{
      clearTimeout(self.id);
      self.id = undefined;
      self.sk.noLoop();
    }, millisTilHalt);
  }
  isSet() {
    return this.id ? true : false;
  }
}
