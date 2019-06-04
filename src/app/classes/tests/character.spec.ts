import { Character } from '../character';
import settings from '../../settings/settings.json';
import { PERK_LIST } from '../deckModifier';


describe('Character', () => {
  // Test that all characters can be initialized
  settings.characters.forEach(character => {
    it(`should create an instance of character ${character.name}`, () => {
      expect(new Character(character)).toBeTruthy();
    });
  });

  // Test that all characters have exactly 15 perks
  settings.characters.forEach(character => {
    it(`${character.name} should have 15 perks`, () => {
      const char = new Character(character);
      expect(char.perkList.map(perk => perk.uses.length).reduce((prev, cur) => prev + cur)).toBe(15, `${char.name} failed`);
    });
  });

  // Test that all characters have havlid perks
  settings.characters.forEach(character => {
    it(`${character.name} should have valid perks`, () => {
      character.perks.forEach(perk => {
        expect(Object.keys(PERK_LIST)).toContain(perk.name, `"${perk.name}" not a valid perk`);
      });
    });
  });


  /*
  // Test that all perks are reversable
  Object.values(settings.characters).forEach(character => {
    const char = new Character(character);
    Object.values(char.perkList).forEach(perk => {
      it(`${char.name} perk '${perk.name}' should be reversable`, () => {
        const deck = new Deck();
        const originalDeck: Deck = Utils.clone(deck);
        perk.set(deck);
        // perk.unset(deck);
        expect(deck.cards).toEqual(originalDeck.cards, `"${perk.name}" cards aren't reversable`);
        expect(deck.effects).toEqual(originalDeck.effects, `"${perk.name}" effects aren't reversable`);
      });
    });
  });
  */
});
