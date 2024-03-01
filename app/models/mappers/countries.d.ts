export interface CountrySelectorItem {
  text: string;
  value: string;
  selected?: boolean;
}

export interface CountrySelector {
  id: string;
  name: string;
  value: string;
  items: CountrySelectorItem[]
  autocomplete: string
}