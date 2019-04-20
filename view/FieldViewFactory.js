import ImageView from './ImageView.js';
import ShortTextView from './ShortTextView.js';
import LongTextView from './LongTextView.js';
import SingleValueListView from './SingleValueListView.js';
import MultipleValueListView from './MultipleValueListView.js';

export default class FieldViewFactory {
  static makeFormField(id, dataField, entity, control) {
    switch(dataField.constructor.name){
      case "Image": {
        return new ImageView( id, dataField, entity, control );
        break;
      }
      case "ShortText": {
        return new ShortTextView( id, dataField, entity, control );
        break;
      }
      case "LongText": {
        return new LongTextView( id, dataField, entity, control );
        break;
      }
      case "SingleValueList": {
        return new SingleValueListView( id, dataField, entity, control );
        break;
      }
      case "MultipleValueList": {
        return new MultipleValueListView( id, dataField, entity, control );
        break;
      }
    }
  }
}
