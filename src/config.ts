import { getEnvVar } from './utils'

const API_KEY = getEnvVar('API_KEY')
const API_URL = getEnvVar('API_URL')
const HOME_URL = getEnvVar('NEXT_PUBLIC_HOME_URL')

export { API_KEY, API_URL, HOME_URL }
