export default class RenderTimer {
  sk :any;
  id :any;

  constructor(sk :any){
    this.sk = sk;
  }

  setTimer(millisTilHalt:number){
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
