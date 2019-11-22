import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UIModule } from './modules/ui-modules/ui.module';
import { MatMenuModule } from '@angular/material/menu';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { DeckReliabilityComponent } from './modules/stats-module/deck-reliability.component';
import { CardProbabilityComponent } from './modules/stats-module/card-probability.component';
import { CardEffectsComponent } from './modules/stats-module/card-effects.component';
import { InfoPageComponent } from './modules/info-page/info-page.component';
import { AverageDamageComponent } from './modules/stats-module/average-damage.component';
import { DeckModifiersComponent } from './modules/deck-modifiers/deck-modifiers.component';
import { CharacterService } from './services/character.service';
import { PerkSelectorComponent } from './modules/perk-selector/perk-selector.component';
import { StorageService } from './services/storage.service';


@NgModule({
  declarations: [
    AppComponent,
    DeckReliabilityComponent,
    CardProbabilityComponent,
    AverageDamageComponent,
    CardEffectsComponent,
    InfoPageComponent,
    DeckModifiersComponent,
    PerkSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    UIModule,
    ChartsModule,
    MatMenuModule,
  ],
  entryComponents: [InfoPageComponent],
  providers: [CharacterService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
