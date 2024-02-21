/**
 * @type {string[]}
 */
const ADDED_EVENTS = ['date_exported', 'date_stolen', 'dog_date_of_death', 'date_untraceable']

/**
 * @type {Record<string, string>}
 */
const ACTIVITY_LABELS = {
  cdo_issued: 'CDO issue date',
  cdo_expiry: 'CDO expiry date',
  certificate_issued: 'First certificate date',
  application_fee_paid: 'Application fee paid date',
  insurance_company: 'Insurance company',
  insurance_renewal_date: 'Insurance renewal date',
  neutering_confirmation: 'Neutering confirmed',
  microchip_verification: 'Microchip number verified',
  joined_exemption_scheme: 'Joined interim exemption scheme',
  removed_from_cdo_process: 'Removed from CDO process',
  court: 'Court',
  legislation_officer: 'Dog legislation officer',
  police_force: 'Police force',
  microchip_deadline: 'Microchip deadline',
  withdrawn: 'Withdrawn from index',
  dog_name: 'Dog name',
  breed_type: 'Breed type',
  colour: 'Dog colour',
  sex: 'Sex',
  dog_date_of_birth: 'Dog date of birth',
  dog_date_of_death: 'Dog date of death',
  tattoo: 'Tattoo',
  microchip1: 'Microchip number 1',
  microchip2: 'Microchip number 2',
  date_exported: 'Date exported',
  date_stolen: 'Date stolen',
  date_untraceable: 'Date untraceable',
  typed_by_dlo: 'Examined by dog legislation officer',
  exemption_order: 'Order type',
  firstName: 'First name',
  lastName: 'Last name',
  birthDate: 'Owner date of birth',
  'address/addressLine1': 'Address line 1',
  'address/addressLine2': 'Address line 2',
  'address/town': 'Town or city',
  'address/postcode': 'Postcode',
  'address/country': 'Country',
  'contacts/email': 'Email address',
  'contacts/primaryTelephone': 'Telephone 1',
  'contacts/secondaryTelephone': 'Telephone 2',
  status: 'Status set to'
}

module.exports = {
  ADDED_EVENTS,
  ACTIVITY_LABELS
}
