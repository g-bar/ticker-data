/**
 * Retrieves and validates an environment variable.
 *
 * This function gets the value of the specified environment variable,
 * trims any leading or trailing whitespace, and ensures it is a non-empty string.
 **/
export function getEnvVar(envvar: string) {
  const value = process.env[envvar]?.trim()
  if (typeof value !== 'string' || value === '') throw new Error(`${envvar} is missing or invalid.`)
  return value
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
