import * as $ from 'jquery'
import ListItem from './ListItem';

export default class ListItemConst extends ListItem {
  renderJQuery() {
    let $item = $(`<div class="storyItem"></div>`);
    for (let action of ['select']) {
      $item.append(this.createButtonFor(action));
    }
    return $item;
  }
}
