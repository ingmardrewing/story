import {saveAs} from 'file-saver';
import Control from '../control/Control';

export default class Service {

  control :Control;

  read(event :any) {
    let reader = new FileReader();
    let service = this;
    reader.onload = function(e){
      service.readJson.call(service, e);
    }
    reader.readAsText(event.target.files[0]);
  }

  setControl(control :Control){
    this.control = control;
  }

	readImage(event :any){
    try {
      let json = JSON.parse(event.target.result);
      this.control.showReadData(json);
    }
    catch(ex){
      alert(ex);
    }
	}

  readJson(event :any){
    try{
      let json = JSON.parse(event.target.result);
      this.control.showReadData(json);
    }
    catch(ex){
      alert(ex);
    }
  }

  save(jsn :any) {
    var blob = new Blob([JSON.stringify(jsn)], {type: "text/plain;charset=utf-8"});
    var filename = prompt("Which filename shall we use?", "story") + ".json";
    if (filename && filename !== "null"){
      saveAs(blob, filename);
    }
  }
}
