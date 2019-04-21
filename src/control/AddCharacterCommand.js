import Command from './Command.js';
import Character from '../model/Character.js';

export default class AddCharacterCommand extends Command {
  do(){
    let newArchetype ;
    for (let archetype of this.payload.model.characterArchetypes) {
      if(archetype.name === this.payload.archetype) {
        newArchetype = archetype;
        break;
      }
    }
    this.char = new Character(this.payload, newArchetype, this.payload.model);
    this.payload.model.story.addCharacter(this.char);
  }

  undo() {
    this.payload.control.removeItemFromArray(this.payload.model.story.characters, this.char);
  }
}
