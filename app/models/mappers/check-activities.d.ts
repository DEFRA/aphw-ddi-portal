export interface User {
  username: string
  displayname: string
}

export type AuditKey = string
export type DateString = string
export type DateChangedAudit = [AuditKey, DateString, DateString]
export type IdChangedAudit = [AuditKey, number, number]
export type RemovedAudit = [string, string]
export type AuditFieldRecord = DateChangedAudit | IdChangedAudit

export interface EventBase {
  operation: string
  timestamp: DateString
  type: string
  rowKey: string
  subject: string
}

export interface Activity {
  activity: string
  activityType: string
  pk: string
  source: string
  activityDate: string
  activityLabel: string
}

export interface Changes {
  added: AuditFieldRecord[]
  removed: RemovedAudit[]
  edited: AuditFieldRecord[]
}

export interface ChangeEvent extends EventBase {
  changes: Changes
  type: 'uk.gov.defra.ddi.event.update'
}

export interface ActivityEvent {
  activity: Activity
  type: 'uk.gov.defra.ddi.event.activity'
}

export interface DogBreed {
  breed: string
}

export interface CdoStatus {
  id: number
  status: string
  status_type: string
}

export interface CdoRegistration {
  id: number
  dog_id: number
  status_id: number
  police_force_id: number
  court_id: null | number
  exemption_order_id: number
  created_on: string
  cdo_issued: string
  cdo_expiry: string
  time_limit: null | string
  certificate_issued: null | string
  legislation_officer: string
  application_fee_paid: null | string
  neutering_confirmation: null | string
  microchip_verification: null | string
  joined_exemption_scheme: null | string
  withdrawn: null | string
  typed_by_dlo: null | string
  microchip_deadline: null | string
  neutering_deadline: null | string
  removed_from_cdo_process: null | string
  police_force: { name: string }
  court: { name: null | string }
}

export interface OwnerAddress {
  id: number
  address_line_1: string
  address_line_2: string | null
  town: string
  postcode: string
  county: null
  country_id: number
  country: { country: string }
}

export interface OwnerCreatedEvent {
  id: number
  first_name: string
  last_name: string
  birth_date: string | null
  person_reference: string
  address: OwnerAddress
}

export interface CreatedDogEvent {
  id: number | null
  dog_reference: string
  index_number: string
  dog_breed_id: number
  status_id: number
  name: string
  birth_date: string | null
  death_date: string | null
  tattoo: string | null
  colour: string | null
  sex: string | null
  exported_date: string | null
  stolen_date: string | null
  untraceable_date: string | null
  dog_breed: DogBreed
  status: CdoStatus
  registration: CdoRegistration
}

export interface CreatedEvent extends EventBase {
  type: 'uk.gov.defra.ddi.event.create'
  created: { dogs: CreatedDogEvent[], owner: OwnerCreatedEvent }
}

export type DDIEvent = ChangeEvent | ActivityEvent | CreatedEvent

export interface ActivityRow {
  activityLabel: string
  date: string
  teamMember: string
}

export type GetActivityLabelFromAuditFieldRecordFn = (auditFieldRecord: AuditFieldRecord) => string