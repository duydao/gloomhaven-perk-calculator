import { Component } from '@angular/core';
import { GraphModuleDirective } from 'src/app/classes/graphModule';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CharacterService } from 'src/app/services/character.service';
import { FaIcons } from 'src/app/classes/consts';

@Component({
  selector: 'app-average-damage',
  templateUrl: './stats-module.component.html',
  styleUrls: ['./stats-module.component.scss'],
})
export class AverageDamageComponent extends GraphModuleDirective {
  private baseDamage = [0, 1, 2, 3, 4, 5];
  public barChartLabels: string[] = this.baseDamage.map(val => val.toString());
  public faIcons = FaIcons;

  constructor(public bottomSheet: MatBottomSheet, public charServ: CharacterService) {
    super(bottomSheet, charServ);
    this.barChartOptions.scales.xAxes = [{
      scaleLabel: {
        display: true,
        labelString: 'Base Damage'
      }
    }];

    this.barChartOptions.scales.yAxes = [{
      ticks: {
        beginAtZero: true,
        stepSize: 1,
      },
    }];

    this.barChartOptions.plugins.datalabels.formatter = (x => x.toFixed(2));

    // TODO: Change this later
    // this.barChartOptions.maintainAspectRatio = true;
  }

  public getChartData() {
    const probData = [{
      label: 'Current',
      data: this.baseDamage.map(val => this.charServ.getCharacter().deck.getAverageDamage(val)),
      backgroundColor: GraphModuleDirective.Colors.blue.backgroundColor,
      borderColor: GraphModuleDirective.Colors.blue.borderColor,
    }];

    if (this.charServ.getCharacter().compareDeck != null) {
      // const compareCards = Deck.modifyCards(this.deck.comparison.cards, this.deck.comparison.deckModifiers);
      probData.push({
        label: 'Comparison',
        data: this.baseDamage.map(val => this.charServ.getCharacter().compareDeck.getAverageDamage(val)),
        backgroundColor: GraphModuleDirective.Colors.red.backgroundColor,
        borderColor: GraphModuleDirective.Colors.red.borderColor,
      });
    }
    return probData;
  }

}
