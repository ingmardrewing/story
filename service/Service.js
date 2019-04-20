export default class Service {
  read(event) {
    let reader = new FileReader();
    let service = this;
    reader.onload = function(e){
      service.readJson.call(service, e);
    }
    reader.readAsText(event.target.files[0]);
  }

  setControl(control){
    this.control = control;
  }

  readJson(event){
    try{
      let json = JSON.parse(event.target.result);
      this.control.showReadData(json);
    }
    catch(ex){
      alert(ex);
    }
  }

  save() {
    var jsn = service.readFile();
    var blob = new Blob([JSON.stringify(jsn)], {type: "text/plain;charset=utf-8"});
    var filename = prompt("Which filename shall we use?", "story") + ".json";
    saveAs(blob, filename);
  }
}
