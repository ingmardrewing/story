import * as $ from 'jquery'
import View from '../view/View';

export default class MainNavi {
  view :View;
  $container :any;

  constructor(view :View, $container :any){
    this.$container = $container;
    this.view= view;
  }

  render() {
    this.$container.empty();

    let view= this.view;
    let $editStoryLink = $('<a>edit</a>');
    $editStoryLink.addClass("mainNavi");
    $editStoryLink.click(function(){
      view.control.edit(view.model.story);
    });
    this.$container.append($editStoryLink);

    let $saveFileLink = $('<a>save</a>');
    $saveFileLink.addClass("mainNavi"),
    $saveFileLink.click(view.control.getSaveListener());
    this.$container.append($saveFileLink);

    let $clearLink = $('<a>clear</a>');
    $clearLink.addClass("mainNavi");
    $clearLink.click( function() {
      view.control.clearData();
      view.updateGui();
      view.updateSceneSprites();
      view.updateDetailView(null);
    });
    this.$container.append($clearLink);

    let $readFileLink = $('<input type="file" id="input">');
    $readFileLink.addClass("mainNavi");
    $readFileLink.change(view.control.getLoadChangeListener());
    this.$container.append($readFileLink);

    let $about = $(`<h1 class="storyTitle">${view.model.story.get("name")}</h1>`);
    $about.append(`<p class="storyDescription">${view.model.story.get('description')}</p>`);
    this.$container.append($about);
  }
}
