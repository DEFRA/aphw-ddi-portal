export interface CdoTaskDto {
    key: 'applicationPackSent' | 'applicationPackProcessed' | 'insuranceDetailsRecorded' | 'applicationFeePaid' | 'form2Sent' | 'verificationDateRecorded';
    available: boolean
    completed: boolean
    readonly: boolean
    timestamp: string|undefined
}

export type TaskType = CdoTaskDto['key']