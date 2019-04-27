import ImageView from './ImageView.js';
import ShortTextView from './ShortTextView.js';
import LongTextView from './LongTextView.js';
import SingleValueListView from './SingleValueListView.js';
import MultipleValueListView from './MultipleValueListView.js';

import Image from '../model/Image.ts';
import ShortText from '../model/ShortText.ts';
import LongText from '../model/LongText.ts';
import SingleValueList from '../model/SingleValueList.ts';
import MultipleValueList from '../model/MultipleValueList.ts';

export default class FieldViewFactory {
  static makeFormField(id, dataField, entity, control) {
    if (!control){
      console.error("Control is missing!");
    }
    if(dataField instanceof Image){
      return new ImageView( id, dataField, entity, control );
    }
    if(dataField instanceof ShortText){
      return new ShortTextView( id, dataField, entity, control );
    }
    if(dataField instanceof LongText){
      return new LongTextView( id, dataField, entity, control );
    }
    if(dataField instanceof SingleValueList){
      return new SingleValueListView( id, dataField, entity, control );
    }
    if(dataField instanceof MultipleValueList){
      return new MultipleValueListView( id, dataField, entity, control );
    }
    console.error("No matching View for", id, dataField, entity, control);
  }
}
