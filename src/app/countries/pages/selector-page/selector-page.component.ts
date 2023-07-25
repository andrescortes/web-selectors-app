import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';
import { filter, switchMap, tap } from 'rxjs';


@Component({
  selector: 'countries-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countryByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];


  public myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }


  public get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.borders = []),
        switchMap((region: any) => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe(region => {
        this.countryByRegion = region;
      });
  }

  onCountryChange(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap((_: any) => this.myForm.get('border')!.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap((alphaCode: any) => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders))
      )
      .subscribe(countries => {
        console.log({ countries });
        this.borders = countries;
      });
  }

}
