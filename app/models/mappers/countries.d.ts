export type CountrySelectorItem = {
    text: string;
    value: string;
    selected?: boolean;
};
export type CountrySelector = {
    id: string;
    name: string;
    value: string;
    items: CountrySelectorItem[];
    autocomplete: string;
};
export type GovUkSelectItemAttributes = {
    maxLength?: string;
};
export type JoiErrorDetail = {
    details: string;
    path: string[];
    message: string;
    type: string;
    context: {
        label: string;
        value: string;
        key: string;
    };
};
export type GovUkErrorMessage = {
    text: string;
};
export type GovUkSelectItem = {
    id: string;
    name: string;
    value: string;
    label?: {
        text: string;
    };
    classes?: string;
    autocomplete: string;
    attributes?: GovUkSelectItemAttributes;
    items: any[];
    errorMessage?: GovUkErrorMessage;
};
/**
 * @typedef CountrySelectorItem
 * @property {string} text
 * @property {string} value
 * @property {boolean} [selected]
 */
/**
 * @typedef CountrySelector
 * @property {string} id
 * @property {string} name
 * @property {string} value
 * @property {CountrySelectorItem[]} items
 * @property {string} autocomplete
 */
/**
 * @typedef GovUkSelectItemAttributes
 * @property {string} [maxLength]
 */
/**
 * @typedef JoiErrorDetail
 * @property {string} details
 * @property {string[]} path
 * @property {string} message
 * @property {string} type
 * @property {{ label: string; value: string; key: string; }} context
 */
/**
 * @typedef GovUkErrorMessage
 * @property {string} text
 */
/**
 * @typedef GovUkSelectItem
 * @property {string} id
 * @property {string} name
 * @property {string} value
 * @property {{ text: string }} [label]
 * @property {string} [classes]
 * @property {string} autocomplete
 * @property {GovUkSelectItemAttributes} [attributes]
 * @property {*[]} items
 * @property {GovUkErrorMessage} [errorMessage]
 */
/**
 * @param {string[]} countries
 * @param {Joi.ValidationError} validationError
 * @param {string} selectedCountry
 * @returns {GovUkSelectItem}
 */
export function mapToCountrySelector(countries: string[], validationError: Joi.ValidationError, selectedCountry?: string): GovUkSelectItem;
