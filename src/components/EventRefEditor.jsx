import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2, Search } from 'lucide-react'
import { useApi } from '@/lib/api-context'
import { TextField, SelectField } from './form-fields'

const EVENT_TYPE_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'field_update', label: 'Field Update' },
  { value: 'status_update', label: 'Status Update' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'callback', label: 'Callback' },
  { value: 'notification', label: 'Notification' },
  { value: 'sftp_upload', label: 'SFTP Upload' },
]

export default function EventRefEditor({ eventRefs, onChange }) {
  const { isConfigured, actionEvents, loading } = useApi()
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const addRef = (type) => {
    const newRef =
      type === 'new_event'
        ? { event_type: 'email', event_name: '', is_new: true }
        : { event_type: '', event_name: '', event_id: '' }
    onChange([...eventRefs, newRef])
  }

  const addFromApi = (event) => {
    const ref = {
      event_type: event.event_type || event.type || 'email',
      event_name: event.event_name || event.name || event.title || '',
      event_id: event._id?.$oid || event._id || event.event_id || '',
    }
    onChange([...eventRefs, ref])
    setSearch('')
    setShowSearch(false)
  }

  const updateRef = (idx, updated) => {
    onChange(eventRefs.map((r, i) => (i === idx ? updated : r)))
  }

  const deleteRef = (idx) => {
    onChange(eventRefs.filter((_, i) => i !== idx))
  }

  const filteredEvents = useMemo(() => {
    if (!actionEvents.length) return []
    if (!search) return actionEvents.slice(0, 20)
    return actionEvents.filter((e) => {
      const name = e.event_name || e.name || e.title || ''
      const id = e._id?.$oid || e._id || e.event_id || ''
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        id.toLowerCase().includes(search.toLowerCase())
      )
    }).slice(0, 20)
  }, [actionEvents, search])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Event Refs ({eventRefs.length})</label>
        {isConfigured && actionEvents.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="h-8 text-xs"
          >
            <Search className="h-3.5 w-3.5" />
            {showSearch ? 'Hide' : 'Search Events'}
            {loading && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
          </Button>
        )}
      </div>

      {/* API event search */}
      {showSearch && isConfigured && (
        <div className="space-y-2 p-4 rounded-lg border border-gray-200 bg-gray-50/50">
          <TextField
            value={search}
            onChange={setSearch}
            placeholder="Search action events..."
            inputClassName="h-9 text-sm"
          />
          {filteredEvents.length > 0 && (
            <div className="max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white">
              {filteredEvents.map((e, i) => (
                <button
                  key={i}
                  onClick={() => addFromApi(e)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <span className="font-medium">{e.event_name || e.name || e.title || 'Unnamed'}</span>
                  <span className="text-muted-foreground text-xs">
                    {e.event_type || e.type || ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {eventRefs.map((ref, idx) => (
        <div key={idx} className="group flex gap-3 items-start p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <TextField
              label="Event Name"
              value={ref.event_name}
              onChange={(v) => updateRef(idx, { ...ref, event_name: v })}
              placeholder="Event name"
            />
            <SelectField
              label="Event Type"
              value={ref.event_type}
              onChange={(v) => updateRef(idx, { ...ref, event_type: v })}
              options={EVENT_TYPE_OPTIONS}
            />
            {!ref.is_new && (
              <TextField
                label="Event ID"
                value={ref.event_id}
                onChange={(v) => updateRef(idx, { ...ref, event_id: v })}
                placeholder="Existing event ID"
              />
            )}
          </div>
          <button
            onClick={() => deleteRef(idx)}
            className="mt-5 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => addRef('new_event')} className="h-8 text-xs flex-1">
          Add New Event
        </Button>
        <Button variant="outline" size="sm" onClick={() => addRef('existing')} className="h-8 text-xs flex-1">
          Add Existing Event
        </Button>
      </div>
    </div>
  )
}
