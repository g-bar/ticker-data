import { getEnvVar } from './utils'

const API_KEY = getEnvVar('API_KEY')
const API_URL = getEnvVar('API_URL')

export { API_KEY, API_URL }
