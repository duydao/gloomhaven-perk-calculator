import { Component, OnInit } from '@angular/core';
import { GraphModuleDirective } from 'src/app/classes/graphModule';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CharacterService } from 'src/app/services/character.service';
import { FaIcons } from 'src/app/classes/consts';

@Component({
  selector: 'app-card-effects',
  templateUrl: './stats-module.component.html',
  styleUrls: ['./stats-module.component.scss']
})
export class CardEffectsComponent extends GraphModuleDirective implements OnInit {
  public barChartLabels: string[];
  public removeZeroColumns = true;
  public faIcons = FaIcons;

  constructor(public bottomSheet: MatBottomSheet, public charServ: CharacterService) {
    super(bottomSheet, charServ);
    this.barChartLabels = Object.keys(this.charServ.getCharacter().deck.cards);
  }


  public getChartData() {
    const probs = this.charServ.getCharacter().deck.getEffectsProbability();
    // console.log(this.charServ.getCharacter().deck);
    // console.log(probs);
    const compareProbs = this.charServ.getCharacter().compareDeck && this.charServ.getCharacter().compareDeck.getEffectsProbability();

    // Rename 'None' to 'No Effect'
    probs['No Effect'] = probs['None'];
    delete probs['None'];
    if (compareProbs != null) {
      compareProbs['No Effect'] = compareProbs['None'];
      delete compareProbs['None'];
    }

    this.setChartLabels(probs, compareProbs);
    Object.keys(probs).forEach(key => probs[key] = Math.round(probs[key] * 100));
    const probData = [
      {
        label: 'Current',
        data: this.fitToChart(probs),
        backgroundColor: GraphModuleDirective.Colors.blue.backgroundColor,
        borderColor: GraphModuleDirective.Colors.blue.borderColor,
      }
    ];

    if (this.charServ.getCharacter().compareDeck != null) {
      Object.keys(compareProbs).forEach(key => compareProbs[key] = Math.round(compareProbs[key] * 100));
      probData.push({
        label: 'Comparison',
        data: this.fitToChart(compareProbs),
        backgroundColor: GraphModuleDirective.Colors.red.backgroundColor,
        borderColor: GraphModuleDirective.Colors.red.borderColor,
      });
    }

    // console.log(probs);
    return probData;
  }

  private setChartLabels(probs: object, compareProbs: object) {
    let labels = Object.keys(probs);

    if (compareProbs != null) {
      labels = Array.from(new Set(labels.concat(Object.keys(compareProbs))));
    }

    // Sort the array but place 'No Effect' first
    labels = labels.filter(key => key !== 'No Effect');
    labels.sort();
    labels.unshift('No Effect');

    if (this.barChartLabels.toString() !== labels.toString()) {
      // console.log(`${this.barChartLabels} !== ${labels}`);
      this.barChartLabels = labels;
    }
  }
}

