import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js'

export type PhoneValidation = {
  e164: string | null
  isValid: boolean
  country?: string
}

export function validateAndFormatPhone(input: string, countryIso2?: string): PhoneValidation {
  const raw = (input || '').trim()
  // Try parsing with explicit country first, then general parse
  let phone = countryIso2
    ? parsePhoneNumberFromString(raw, countryIso2 as any)
    : parsePhoneNumberFromString(raw)

  if (!phone && countryIso2) {
    // If user provided just local digits, prefix '+' to try generic parse
    phone = parsePhoneNumberFromString(`+${raw}`)
  }

  if (phone && phone.isValid()) {
    return { e164: phone.number, isValid: true, country: phone.country }
  }

  return { e164: null, isValid: false }
}

export function formatForDisplay(input: string, countryIso2?: string): string {
  const typer = new AsYouType(countryIso2 as any)
  return typer.input(input)
}
