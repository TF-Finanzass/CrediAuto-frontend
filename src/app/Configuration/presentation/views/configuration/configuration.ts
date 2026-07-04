import { Component, computed, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationStore } from '../../../application/configuration.store';
import { Currency } from '../../../domain/model/currency';

@Component({
  selector: 'app-configuration',
  imports: [MatButtonToggleModule, MatIconModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css',
})
export class Configuration {
  readonly store = inject(ConfigurationStore);
  private readonly translate = inject(TranslateService);

  protected readonly Currency = Currency;
  protected currentLang: string = this.translate.getCurrentLang();
  protected languages: string[] = ['en', 'es'];

  /** El tipo de cambio solo aplica cuando la moneda activa es USD (para convertir a PEN). */
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
