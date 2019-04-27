import Command from './Command';
import Character from '../model/Character';

export default class AddCharacterCommand extends Command {
  char :Character;

  do(){
    let newArchetype :any;
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
