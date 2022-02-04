export interface StockReport {
  readonly stat: string;
  readonly date: string;
  readonly title: string;
  readonly fields: string[];
  readonly data: StockData[];
  readonly selectType: string;
  readonly notes: string[];
}

export interface StockData {
  readonly code: string;
  readonly name: string;
  readonly dividend: string;
  readonly year: number;
  readonly PER: string;
  readonly PBR: string;
  readonly season: string;
}