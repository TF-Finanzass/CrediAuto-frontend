import { Component, computed, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ConfigurationStore } from '../../../application/configuration.store';
import { Currency } from '../../../domain/model/currency';

@Component({
  selector: 'app-configuration',
  imports: [MatButtonToggleModule, TranslatePipe],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css',
})
export class Configuration {
  readonly store = inject(ConfigurationStore);
  private readonly translate = inject(TranslateService);
  protected readonly Currency = Currency;
  protected currentLang: string = this.translate.getCurrentLang();
  protected languages: string[] = ['es', 'en'];
  protected readonly exchangeRateEditable = computed(() => this.store.currency() === Currency.USD);

  useLanguage(language: string): void {
    this.translate.use(language);
    this.currentLang = language;
  }

  onExchangeRateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (!isNaN(value)) this.store.setExchangeRate(value);
  }
}
