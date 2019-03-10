import { Component } from '@angular/core';
import { GraphModule } from 'src/app/classes/graphModule';
import { MatBottomSheet } from '@angular/material';
import { CharacterService } from 'src/app/character.service';


@Component({
  selector: 'app-card-probability',
  templateUrl: './stats-module.component.html',
  styleUrls: ['./stats-module.component.scss']
})
export class CardProbabilityComponent extends GraphModule {
  public barChartLabels; // = Object.keys(this.character.deck.cards);
  public removeZeroColumns = false;

  constructor(public bottomSheet: MatBottomSheet, public charServ: CharacterService) {
    super(bottomSheet, charServ);
    this.barChartLabels = Object.keys(this.charServ.getCharacter().deck.cards);
  }


  public getChartData() {
    this.setChartLabels();
    let probs = this.charServ.getCharacter().deck.getCardsProbability(this.removeZeroColumns);
    Object.keys(probs).forEach(key => probs[key] = Math.round(probs[key] * 100));
    const probData = [
      {
        label: 'Current',
        data: this.fitToChart(probs)
      }
    ];

    if (this.charServ.getCharacter().compareDeck != null) {
      probs = this.charServ.getCharacter().compareDeck.getCardsProbability(this.removeZeroColumns);
      Object.keys(probs).forEach(key => probs[key] = Math.round(probs[key] * 100));
      probData.push({
        label: 'Comparison',
        data: this.fitToChart(probs)
      });
    }

    return probData;
  }

  private setChartLabels() {
    let labels: string[];
    if (!this.removeZeroColumns) {
      // const cards = Deck.modifyCards(this.deck.cards, this.deck.deckModifiers);
      const cards = this.charServ.getCharacter().deck.cards;
      labels = Object.keys(cards).filter(key => !['Bless', 'Curse'].includes(key) || cards[key] !== 0);
    } else {
      labels = new Array<string>();
      const cards = this.charServ.getCharacter().deck.cards;

      const compareCards = this.charServ.getCharacter().compareDeck && this.charServ.getCharacter().compareDeck.cards;

      for (const key in cards) {
        if (cards[key] > 0 || (compareCards && compareCards[key] > 0)) {
          labels.push(key);
        }
      }
    }

    if (this.barChartLabels.toString() !== labels.toString()) {
      console.log(`${this.barChartLabels} !== ${labels}`);
      this.barChartLabels = labels;
      this.needRedraw = true;
    }
  }
}
