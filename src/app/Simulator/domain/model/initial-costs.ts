export interface InitialCosts {
  notarial: number;
  registration: number;
  appraisal: number;
  studyFee: number;
  activationFee: number;
}

export function sumInitialCosts(costs: InitialCosts): number {
  return (
    costs.notarial + costs.registration + costs.appraisal + costs.studyFee + costs.activationFee
  );
}

export function emptyInitialCosts(): InitialCosts {
  return { notarial: 0, registration: 0, appraisal: 0, studyFee: 0, activationFee: 0 };
}
