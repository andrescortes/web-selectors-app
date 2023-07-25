export enum Region{
  Europe   = 'Europe',
  Africa   = 'Africa',
  Americas = 'Americas',
  Asia     = 'Asia',
  Oceania  = 'Oceania'
}
export interface Name{
  common:   string;
}

export interface SmallCountry{
  name:    string;
  cca3:    string;
  borders: string[];
}

export interface Country {
  name:     Name;
  cca3:     string;
  borders: string[];
  region:   string;
  latlng:   number[];
}
