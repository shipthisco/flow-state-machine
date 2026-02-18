import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { createApi } from './api'

const ApiContext = createContext(null)

/**
 * Provides API config + cached data to the tree.
 *
 * Data can be supplied in two ways (direct props take precedence over API fetch):
 *
 * 1. Direct data props — pass data you already have:
 *    - initialRoles        [{ name, description, _cls_ }]
 *    - initialActionEvents [{ event_name, event_type, _id }]
 *    - initialFieldMeta    { flat_field_mapping, meta: { sections } }
 *
 * 2. API fetch props — fetches data on mount:
 *    - apiEndpoint, authToken, organisation, location, region, usertype
 *    - collection (string) — used to fetch field meta via /api/v3/getrelated/{collection}
 *
 * When direct data is provided the corresponding API fetch is skipped.
 */
export function ApiProvider({
  apiEndpoint, authToken, organisation, location, region, usertype, collection,
  initialRoles, initialActionEvents, initialFieldMeta,
  children,
}) {
  const api = useMemo(() => {
    if (!apiEndpoint || !authToken) return null
    return createApi({ apiEndpoint, authToken, organisation, location, region, usertype })
  }, [apiEndpoint, authToken, organisation, location, region, usertype])

  const [roles, setRoles] = useState(initialRoles || [])
  const [actionEvents, setActionEvents] = useState(initialActionEvents || [])
  const [fieldMeta, setFieldMeta] = useState(initialFieldMeta || null)
  const [loading, setLoading] = useState(false)

  const isConfigured = !!api || !!initialRoles || !!initialFieldMeta || !!initialActionEvents

  // Sync when direct-data props change
  useEffect(() => { if (initialRoles) setRoles(initialRoles) }, [initialRoles])
  useEffect(() => { if (initialActionEvents) setActionEvents(initialActionEvents) }, [initialActionEvents])
  useEffect(() => { if (initialFieldMeta) setFieldMeta(initialFieldMeta) }, [initialFieldMeta])

  // Build flat field accessors list from meta
  const fieldAccessors = useMemo(() => {
    if (!fieldMeta) return []

    // Try flat_field_mapping first (preferred)
    if (fieldMeta.flat_field_mapping) {
      return Object.keys(fieldMeta.flat_field_mapping)
    }

    // Fall back to extracting from meta.sections
    if (fieldMeta.meta?.sections) {
      const accessors = []
      for (const section of fieldMeta.meta.sections) {
        for (const field of section.fields || []) {
          if (field.field_id) accessors.push(field.field_id)
        }
      }
      return accessors
    }

    return []
  }, [fieldMeta])

  // Build field options for SelectField dropdowns
  const fieldOptions = useMemo(() => {
    return fieldAccessors.map((id) => {
      const label = fieldMeta?.flat_field_mapping?.[id]?.label || id
      return { value: id, label }
    })
  }, [fieldAccessors, fieldMeta])

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    if (!api) return
    try {
      const data = await api.getRoles()
      setRoles(Array.isArray(data) ? data : [])
    } catch (err) {
      console.warn('[workflow-canvas] Failed to fetch roles:', err)
    }
  }, [api])

  // Fetch action events
  const fetchActionEvents = useCallback(async () => {
    if (!api) return
    try {
      const data = await api.getActionEvents()
      setActionEvents(Array.isArray(data) ? data : [])
    } catch (err) {
      console.warn('[workflow-canvas] Failed to fetch action events:', err)
    }
  }, [api])

  // Fetch field meta for the collection
  const fetchFieldMeta = useCallback(async (col) => {
    if (!api || !col) return
    try {
      const data = await api.getRelated(col)
      setFieldMeta(data)
    } catch (err) {
      console.warn('[workflow-canvas] Failed to fetch field meta:', err)
    }
  }, [api])

  // Auto-fetch on connect (skip fetches when direct data was provided)
  useEffect(() => {
    if (!api) return
    setLoading(true)

    const promises = []
    if (!initialRoles) promises.push(fetchRoles())
    if (!initialActionEvents) promises.push(fetchActionEvents())
    if (!initialFieldMeta && collection) promises.push(fetchFieldMeta(collection))

    if (promises.length === 0) { setLoading(false); return }
    Promise.all(promises).finally(() => setLoading(false))
  }, [api, collection, initialRoles, initialActionEvents, initialFieldMeta, fetchRoles, fetchActionEvents, fetchFieldMeta])

  const value = useMemo(() => ({
    api,
    isConfigured,
    loading,
    roles,
    actionEvents,
    fieldMeta,
    fieldAccessors,
    fieldOptions,
    fetchRoles,
    fetchActionEvents,
    fetchFieldMeta,
  }), [api, isConfigured, loading, roles, actionEvents, fieldMeta, fieldAccessors, fieldOptions, fetchRoles, fetchActionEvents, fetchFieldMeta])

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

/** Access the API context. */
export function useApi() {
  return useContext(ApiContext) || {
    isConfigured: false,
    roles: [],
    actionEvents: [],
    fieldMeta: null,
    fieldAccessors: [],
    fieldOptions: [],
  }
}
