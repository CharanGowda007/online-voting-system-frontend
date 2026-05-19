import enMessages from "../locales/en.json"
import knMessages from "../locales/kn.json"

function flattenMessages(
  nested: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const flattened: Record<string, string> = {}
  for (const key in nested) {
    const value = nested[key]
    const newKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(
        flattened,
        flattenMessages(value as Record<string, unknown>, newKey)
      )
    } else {
      flattened[newKey] = String(value ?? "")
    }
  }
  return flattened
}

const messages: Record<string, Record<string, string>> = {
  en: flattenMessages(enMessages as Record<string, unknown>),
  kn: flattenMessages(knMessages as Record<string, unknown>),
}

export function getMessages(locale: string): Record<string, string> {
  return messages[locale] ?? messages.en
}

export function getLocale(): string {
  return typeof window !== "undefined" ? localStorage.getItem("language") || "en" : "en"
}