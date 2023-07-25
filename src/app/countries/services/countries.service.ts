import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  private _region: Region[] = [
    Region.Europe,
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Oceania
  ];
  constructor(
    private readonly httpClient: HttpClient
  ) { }


  public get regions(): Region[] {
    return [...this._region];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if (!region) {
      return of([]);
    }
    const url: string = `${this.baseUrl}/region/${region}?fields=name,cca3,borders`;
    return this.httpClient.get<Country[]>(url)
      .pipe(
        map(countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        })))
      );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
    const url: string = `${this.baseUrl}/alpha/${alphaCode}?fields=name,cca3,borders`;
    return this.httpClient.get<Country>(url)
      .pipe(
        map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }))
      );
  }

  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]> {
    if (!borders || borders.length === 0) return of([]);

    const countryRequest: Observable<SmallCountry>[] = [];
    borders.forEach(border => {
      const request = this.getCountryByAlphaCode(border);
      countryRequest.push(request);
    });
    return combineLatest(countryRequest);
  }


}
