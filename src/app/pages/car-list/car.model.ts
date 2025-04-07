// car.model.ts
export interface Car {
  id: number;
  marka: string;
  evjarat: number;
  uzemanyag: string;
  motor: string;
  valto: string;
  szemelyek: number;
  fogyasztas_l_100km?: number;
  fogyasztas_kwh_100km?: number;
  ar_nap_ft: number;
  autopalya_matrica: boolean;
  felszereltseg: string[];
}
