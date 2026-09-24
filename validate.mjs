#!/usr/bin/env node

// Validates extensions.json against the schema (also run in CI).

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const registryPath = join(__dirname, 'extensions.json')
const schemaPath = join(__dirname, 'extensions.schema.json')

const registry = JSON.parse(readFileSync(registryPath, 'utf-8'))
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'))

// Rules derive from the schema (single source of truth).
const properties = schema.items.properties
const requiredFields = schema.items.required
const knownFields = new Set(Object.keys(properties))
const fieldPatterns = Object.fromEntries(
  Object.entries(properties)
    .filter(([, prop]) => prop.pattern)
    .map(([key, prop]) => [key, new RegExp(prop.pattern)])
)

let errors = []

if (!Array.isArray(registry)) {
  errors.push('extensions.json must be an array')
} else {
  const ids = new Set()
  for (let i = 0; i < registry.length; i++) {
    const entry = registry[i]
    const prefix = `Entry ${i} (${entry.id || 'unknown'})`

    for (const field of requiredFields) {
      if (!entry[field]) {
        errors.push(`${prefix}: missing required field "${field}"`)
      }
    }

    for (const [field, pattern] of Object.entries(fieldPatterns)) {
      if (entry[field] && !pattern.test(entry[field])) {
        errors.push(`${prefix}: "${field}" does not match expected format (${properties[field].description})`)
      }
    }

    // Duplicates the schema pattern, for a clearer error.
    if (entry.download_url && !entry.download_url.endsWith('.bkext.zip')) {
      errors.push(`${prefix}: download_url must end with .bkext.zip`)
    }

    for (const key of Object.keys(entry)) {
      if (!knownFields.has(key)) {
        errors.push(`${prefix}: unknown field "${key}"`)
      }
    }

    if (entry.id) {
      if (ids.has(entry.id)) {
        errors.push(`${prefix}: duplicate id "${entry.id}"`)
      }
      ids.add(entry.id)
    }
  }
}

if (errors.length > 0) {
  console.error('Validation failed:\n')
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
} else {
  console.log(`Validation passed (${registry.length} entries)`)
}
