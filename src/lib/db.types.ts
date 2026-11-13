/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export const Collections = {
	Authorigins: "_authOrigins",
	Externalauths: "_externalAuths",
	Mfas: "_mfas",
	Otps: "_otps",
	Superusers: "_superusers",
	AccountBalances: "account_balances",
	Accounts: "accounts",
	Bills: "bills",
	BillsBalance: "bills_balance",
	Consessioners: "consessioners",
	Meters: "meters",
	Payments: "payments",
	Readings: "readings",
	Users: "users",
} as const
export type Collections = typeof Collections[keyof typeof Collections]

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type AccountBalancesRecord<Tremaining_balance = unknown, Ttotal_billed = unknown, Ttotal_paid = unknown> = {
	account_id?: RecordIdString
	account_number?: string
	id: string
	remaining_balance?: null | Tremaining_balance
	total_billed?: null | Ttotal_billed
	total_paid?: null | Ttotal_paid
	user_id?: RecordIdString
}

export const AccountsTypeOptions = {
	"residential": "residential",
	"commercial": "commercial",
	"institutional": "institutional",
} as const
export type AccountsTypeOptions = typeof AccountsTypeOptions[keyof typeof AccountsTypeOptions]
export type AccountsRecord<Tbilling_address = unknown, Tservice_address = unknown> = {
	account_no?: string
	billing_address?: null | Tbilling_address
	created: IsoAutoDateString
	id: string
	meter?: RecordIdString
	service_address?: null | Tservice_address
	type?: AccountsTypeOptions
	updated: IsoAutoDateString
	user?: RecordIdString
}

export type BillsRecord = {
	account?: RecordIdString
	base_charge?: number
	consumption_charge?: number
	created: IsoAutoDateString
	date?: IsoDateString
	due?: IsoDateString
	id: string
	reading?: RecordIdString
	tax?: number
	total_due?: number
	updated: IsoAutoDateString
}

export type BillsBalanceRecord<Toriginal_amount = unknown, Tremaining_bill_balance = unknown, Ttotal_paid_to_date = unknown> = {
	account_id?: RecordIdString
	bill_id?: RecordIdString
	billing_date?: IsoDateString
	id: string
	original_amount?: null | Toriginal_amount
	remaining_bill_balance?: null | Tremaining_bill_balance
	total_paid_to_date?: null | Ttotal_paid_to_date
}

export type ConsessionersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export const MetersStatusOptions = {
	"active": "active",
	"damaged": "damaged",
	"retired": "retired",
} as const
export type MetersStatusOptions = typeof MetersStatusOptions[keyof typeof MetersStatusOptions]
export type MetersRecord = {
	created: IsoAutoDateString
	id: string
	installation?: IsoDateString
	serialno?: string
	status?: MetersStatusOptions
	type?: string
	updated: IsoAutoDateString
}

export const PaymentsMethodOptions = {
	"e-wallet": "e-wallet",
	"over-the-counter": "over-the-counter",
	"bank-transfer": "bank-transfer",
	"credit-card": "credit-card",
} as const
export type PaymentsMethodOptions = typeof PaymentsMethodOptions[keyof typeof PaymentsMethodOptions]
export type PaymentsRecord = {
	amount?: number
	bill?: RecordIdString
	created: IsoAutoDateString
	date?: IsoDateString
	id: string
	method?: PaymentsMethodOptions
	transaction_ref?: string
	updated: IsoAutoDateString
}

export const ReadingsTypeOptions = {
	"manual": "manual",
	"automated": "automated",
	"estimated": "estimated",
} as const
export type ReadingsTypeOptions = typeof ReadingsTypeOptions[keyof typeof ReadingsTypeOptions]
export type ReadingsRecord = {
	created: IsoAutoDateString
	date?: IsoDateString
	from?: IsoDateString
	id: string
	meter?: RecordIdString
	previous?: number
	to?: IsoDateString
	type?: ReadingsTypeOptions
	updated: IsoAutoDateString
	value?: number
}

export const UsersRoleOptions = {
	"admin": "admin",
} as const
export type UsersRoleOptions = typeof UsersRoleOptions[keyof typeof UsersRoleOptions]
export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: UsersRoleOptions
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AccountBalancesResponse<Tremaining_balance = unknown, Ttotal_billed = unknown, Ttotal_paid = unknown, Texpand = unknown> = Required<AccountBalancesRecord<Tremaining_balance, Ttotal_billed, Ttotal_paid>> & BaseSystemFields<Texpand>
export type AccountsResponse<Tbilling_address = unknown, Tservice_address = unknown, Texpand = unknown> = Required<AccountsRecord<Tbilling_address, Tservice_address>> & BaseSystemFields<Texpand>
export type BillsResponse<Texpand = unknown> = Required<BillsRecord> & BaseSystemFields<Texpand>
export type BillsBalanceResponse<Toriginal_amount = unknown, Tremaining_bill_balance = unknown, Ttotal_paid_to_date = unknown, Texpand = unknown> = Required<BillsBalanceRecord<Toriginal_amount, Tremaining_bill_balance, Ttotal_paid_to_date>> & BaseSystemFields<Texpand>
export type ConsessionersResponse<Texpand = unknown> = Required<ConsessionersRecord> & AuthSystemFields<Texpand>
export type MetersResponse<Texpand = unknown> = Required<MetersRecord> & BaseSystemFields<Texpand>
export type PaymentsResponse<Texpand = unknown> = Required<PaymentsRecord> & BaseSystemFields<Texpand>
export type ReadingsResponse<Texpand = unknown> = Required<ReadingsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	account_balances: AccountBalancesRecord
	accounts: AccountsRecord
	bills: BillsRecord
	bills_balance: BillsBalanceRecord
	consessioners: ConsessionersRecord
	meters: MetersRecord
	payments: PaymentsRecord
	readings: ReadingsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	account_balances: AccountBalancesResponse
	accounts: AccountsResponse
	bills: BillsResponse
	bills_balance: BillsBalanceResponse
	consessioners: ConsessionersResponse
	meters: MetersResponse
	payments: PaymentsResponse
	readings: ReadingsResponse
	users: UsersResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
