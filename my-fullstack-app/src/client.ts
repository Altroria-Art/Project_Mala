import { hc } from 'hono/client'

import type { AppType } from '../../server/src/index'

const apiUrl = (import.meta as any).env.API_URL || 'http://127.0.0.1:8787'

export const client = hc<AppType>(apiUrl)