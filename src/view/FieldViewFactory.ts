import ImageView from './ImageView';
import ShortTextView from './ShortTextView';
import LongTextView from './LongTextView';
import SingleValueListView from './SingleValueListView';
import MultipleValueListView from './MultipleValueListView';

import Control from '../control/Control';

import Field from '../model/Field';
import FieldContainer from '../model/FieldContainer';
import Image from '../model/Image';
import ShortText from '../model/ShortText';
import LongText from '../model/LongText';
import SingleValueList from '../model/SingleValueList';
import MultipleValueList from '../model/MultipleValueList';

export default class FieldViewFactory {
  static makeFormField(
      id :string,
      dataField :Field,
      entity :FieldContainer,
      control :Control) {
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
