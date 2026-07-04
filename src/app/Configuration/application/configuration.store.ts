import { computed, Injectable, signal } from '@angular/core';
import { Currency, currencySymbol } from '../domain/model/currency';

@Injectable({ providedIn: 'root' })
export class ConfigurationStore {
  private readonly currencySignal = signal<Currency>(Currency.PEN);
  readonly currency = this.currencySignal.asReadonly();
  readonly symbol = computed(() => currencySymbol[this.currencySignal()]);

  // Tipo de cambio: cuántos soles equivalen a 1 dólar.
  private readonly exchangeRateSignal = signal<number>(3.75);
  readonly exchangeRate = this.exchangeRateSignal.asReadonly();

  setCurrency(currency: Currency): void {
    this.currencySignal.set(currency);
  }

  setExchangeRate(rate: number): void {
    if (rate > 0) this.exchangeRateSignal.set(rate);
  }

  /** Convierte un monto desde `from` hacia `to` usando el tipo de cambio configurado. */
  convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;
    return from === Currency.USD
      ? amount * this.exchangeRateSignal() // USD -> PEN
      : amount / this.exchangeRateSignal(); // PEN -> USD
  }
}
