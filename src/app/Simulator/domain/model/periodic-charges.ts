export interface PeriodicCharges {
  gps: number;
  postage: number;
  administrativeFee: number;
}

export function sumPeriodicCharges(charges: PeriodicCharges): number {
  return charges.gps + charges.postage + charges.administrativeFee;
}

export function emptyPeriodicCharges(): PeriodicCharges {
  return { gps: 0, postage: 0, administrativeFee: 0 };
}
