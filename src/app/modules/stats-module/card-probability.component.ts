import { Component } from '@angular/core';
import { GraphModule } from 'src/app/classes/graphModule';
import { MatBottomSheet } from '@angular/material';

@Component({
  selector: 'app-card-probability',
  templateUrl: './stats-module.component.html',
  styleUrls: ['./stats-module.component.scss']
})
export class CardProbabilityComponent extends GraphModule {
  public barChartLabels = Object.keys(this.deck.cards);
  public removeZeroColumns = true;

  constructor(public bottomSheet: MatBottomSheet) { super(bottomSheet); }


  public getChartData() {
    this.setChartLabels();

    let probs = this.deck.getCardsProbability(this.deck.cards, this.removeZeroColumns);
    Object.keys(probs).forEach(key => probs[key] = Math.round(probs[key] * 100));
    const probData = [
      {
        label: 'Current',
        data: this.fitToChart(probs)
      }
    ];

    if (this.deck.comparison != null) {
      probs = this.deck.getCardsProbability(this.deck.comparison.cards, this.removeZeroColumns);
      Object.keys(probs).forEach(key => probs[key] = Math.round(probs[key] * 100));
      probData.push({
        label: 'Comparison',
        data: this.fitToChart(probs)
      });
    }

    return probData;
  }

  private setChartLabels() {
    if (!this.removeZeroColumns) {
      this.barChartLabels = Object.keys(this.deck.cards);
    } else {
      const labels = new Array<string>();

      for (const key of Object.keys(this.deck.cards)) {
        if (this.deck.cards[key] > 0 || (this.deck.comparison != null && this.deck.comparison.cards[key] > 0)) {
          labels.push(key);
        }
      }

      if (this.barChartLabels.toString() !== labels.toString()) {
        console.log(`${this.barChartLabels} !== ${labels}`);
        this.barChartLabels = labels;
        this.needRedraw = true;
      }
    }
  }
}
