class Service {
  read(event) {
    let reader = new FileReader();
    reader.onload = service.readJson;
    reader.readAsText(event.target.files[0]);
  }

  readJson(event){
    console.log(event);
    try{
      let json = JSON.parse(event.target.result);
      control.showReadData(json);
    }
    catch(ex){
      alert(ex);
    }
  }

  save() {
    var jsn = service.readFile();
    var blob = new Blob([JSON.stringify(jsn)], {type: "text/plain;charset=utf-8"});
    var filename = prompt("Which filename shall we use?", "story") + ".json";
    // imported function from FileSaver.js:
    saveAs(blob, filename);
  }
}
