export enum Currency {
  PEN = 'PEN',
  USD = 'USD',
}

export const currencySymbol: Record<Currency, string> = {
  [Currency.PEN]: 'S/',
  [Currency.USD]: '$',
};
