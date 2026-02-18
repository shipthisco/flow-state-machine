/**
 * ShipThis API service layer.
 *
 * All fetch calls add the standard auth headers expected by the
 * shipthis-nx backend:
 *   authToken, authorization, organisation, location, region
 */

export function createApi({ apiEndpoint, authToken, organisation, location, region, usertype }) {
  const base = (apiEndpoint || '').replace(/\/+$/, '')

  const headers = () => {
    const h = { 'Content-Type': 'application/json' }
    if (authToken) {
      h.authToken = authToken
      h.authorization = authToken
    }
    if (organisation) h.organisation = organisation
    if (location) h.location = location
    if (region) h.region = region
    if (usertype) h.usertype = usertype
    return h
  }

  async function get(path) {
    const res = await fetch(`${base}${path}`, { headers: headers() })
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
    return res.json()
  }

  // --------------- public helpers ---------------

  /**
   * Fetch all roles from roles-manager.
   * Returns [{ name, description, _cls_ }]
   */
  async function getRoles() {
    const data = await get('/api/v3/roles-manager')
    return data?.data?.items || data?.data || []
  }

  /**
   * Fetch a single collection entry (e.g. action_events).
   * GET /api/v3/incollection/{collection}/{id}?location={loc}&related=true&meta=false
   */
  async function getEntry(collection, id) {
    const locParam = location ? `?location=${location}&related=true&meta=false` : '?related=true&meta=false'
    const data = await get(`/api/v3/incollection/${collection}/${id}${locParam}`)
    return data?.data?.item || data?.data || data
  }

  /**
   * List entries in a collection.
   * GET /api/v3/incollection/{collection}?location={loc}
   */
  async function listEntries(collection, query = {}) {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    Object.entries(query).forEach(([k, v]) => params.set(k, v))
    const qs = params.toString()
    const data = await get(`/api/v3/incollection/${collection}${qs ? '?' + qs : ''}`)
    return data?.data?.items || data?.data || []
  }

  /**
   * Fetch field meta / definition for a collection.
   * GET /api/v3/getrelated/{collection}?location={loc}
   */
  async function getRelated(collection) {
    const locParam = location ? `?location=${location}` : ''
    const data = await get(`/api/v3/getrelated/${collection}${locParam}`)
    return data?.data || data
  }

  /**
   * Fetch action events list.
   * These live in the `action_events` collection.
   */
  async function getActionEvents() {
    return listEntries('action_events')
  }

  return {
    getRoles,
    getEntry,
    listEntries,
    getRelated,
    getActionEvents,
  }
}
