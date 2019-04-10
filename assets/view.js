class  View {
  model;
  control;
  scope = "Suspense";
  sceneRadius = 30;

  contructor(model, control) {
    this.model = model;
    this.control = control;
  }

  setScope(scope) {
    this.scope = scope;
  }
}
