import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StatesCanvas from './StatesCanvas'

const SAMPLE_WORKFLOW = {
  workflow_id: '_state',
  title: 'Sample Workflow',
  start_state_id: 'draft',
  enable_direct_mode: false,
  enable_color_code: false,
  states: [
    {
      state_id: 'draft',
      title: 'Draft',
      actions: [
        {
          title: 'Approve',
          action_id: 'approve',
          next_state_id: 'approved',
          is_primary_action: true,
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
        },
        {
          title: 'Cancel',
          action_id: 'cancel',
          next_state_id: 'cancelled',
          is_primary_action: false,
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
        },
      ],
    },
    {
      state_id: 'approved',
      title: 'Approved',
      actions: [
        {
          title: 'Complete',
          action_id: 'complete',
          next_state_id: 'completed',
          is_primary_action: true,
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
        },
        {
          title: 'Reject',
          action_id: 'reject',
          next_state_id: 'draft',
          is_primary_action: false,
          enable_role_criterion: false,
          enable_field_criterion: false,
          field_criterion: [],
          enable_events: false,
        },
      ],
    },
    {
      state_id: 'completed',
      title: 'Completed',
      color_code: '#16a34a',
      actions: [],
    },
    {
      state_id: 'cancelled',
      title: 'Cancelled',
      color_code: '#dc2626',
      actions: [],
    },
  ],
}

function parseCurl(curlStr) {
  const config = {}
  const str = curlStr.replace(/\\\n/g, ' ').trim()

  const urlMatch = str.match(/curl\s+(?:--[a-z-]+\s+)*['"]?(https?:\/\/[^\s'"]+)['"]?/) ||
                   str.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/)
  if (urlMatch) {
    try {
      const url = new URL(urlMatch[1])
      config.apiEndpoint = `${url.protocol}//${url.host}/`
    } catch {}
  }

  const headerRegex = /-H\s+['"]([^'"]+)['"]/gi
  let match
  while ((match = headerRegex.exec(str)) !== null) {
    const headerLine = match[1]
    const colonIdx = headerLine.indexOf(':')
    if (colonIdx === -1) continue
    const key = headerLine.slice(0, colonIdx).trim().toLowerCase()
    const val = headerLine.slice(colonIdx + 1).trim()

    if (key === 'authtoken' || key === 'authorization') {
      config.authToken = val
    } else if (key === 'organisation') {
      config.organisation = val
    } else if (key === 'location') {
      config.location = val
    } else if (key === 'region') {
      config.region = val
    } else if (key === 'usertype') {
      config.usertype = val
    }
  }

  return config
}

const CONFIG_FIELDS = [
  { key: 'apiEndpoint', label: 'API Endpoint', placeholder: 'https://api.shipthis.co/' },
  { key: 'authToken', label: 'Auth Token', placeholder: 'Bearer ...' },
  { key: 'organisation', label: 'Organisation', placeholder: 'org_id' },
  { key: 'location', label: 'Location', placeholder: 'location_id' },
  { key: 'region', label: 'Region', placeholder: 'region' },
  { key: 'usertype', label: 'User Type', placeholder: 'usertype' },
]

const ALL_KEYS = CONFIG_FIELDS.map((f) => f.key)

function DevWrapper() {
  const [workflow, setWorkflow] = useState(SAMPLE_WORKFLOW)
  const [showConfig, setShowConfig] = useState(false)
  const [curlInput, setCurlInput] = useState('')
  const [showCurlInput, setShowCurlInput] = useState(false)
  const [apiConfig, setApiConfig] = useState(() => {
    const cfg = {}
    ALL_KEYS.forEach((k) => { cfg[k] = localStorage.getItem(`wsc_${k}`) || '' })
    return cfg
  })

  const handleChange = useCallback((updated) => {
    setWorkflow(updated)
  }, [])

  const updateField = (key, value) => {
    setApiConfig((prev) => ({ ...prev, [key]: value }))
    localStorage.setItem(`wsc_${key}`, value)
  }

  const handleCurlPaste = () => {
    if (!curlInput.trim()) return
    const parsed = parseCurl(curlInput)
    const newConfig = { ...apiConfig }
    Object.entries(parsed).forEach(([k, v]) => {
      if (v) {
        newConfig[k] = v
        localStorage.setItem(`wsc_${k}`, v)
      }
    })
    setApiConfig(newConfig)
    setCurlInput('')
    setShowCurlInput(false)
  }

  const handleClear = () => {
    ALL_KEYS.forEach((k) => localStorage.removeItem(`wsc_${k}`))
    const empty = {}
    ALL_KEYS.forEach((k) => { empty[k] = '' })
    setApiConfig(empty)
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 min-h-0">
        <StatesCanvas
          workflow={workflow}
          onChange={handleChange}
          apiConfig={apiConfig}
        />
      </div>

      {/* Floating API config button */}
      <button
        onClick={() => setShowConfig((v) => !v)}
        className="fixed bottom-4 right-4 z-[200] bg-foreground text-background rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity text-xs font-bold cursor-pointer"
        title="API Configuration"
      >
        API
      </button>

      {showConfig && (
        <div className="fixed bottom-16 right-4 z-[200] bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 space-y-3 max-h-[80vh] overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-800">API Configuration</h3>
          <p className="text-[10px] text-gray-500">
            Enter credentials to enable live API calls. Values persisted in localStorage.
          </p>

          {/* Curl paste section */}
          <div className="space-y-1">
            <button
              onClick={() => setShowCurlInput((v) => !v)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {showCurlInput ? 'Hide' : 'Paste cURL'}
            </button>
            {showCurlInput && (
              <div className="space-y-2">
                <textarea
                  value={curlInput}
                  onChange={(e) => setCurlInput(e.target.value)}
                  placeholder={"Paste a cURL command here...\ne.g. curl 'https://api.shipthis.co/...' -H 'authtoken: ...' -H 'organisation: ...'"}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-ring font-mono h-24 resize-y"
                />
                <button
                  onClick={handleCurlPaste}
                  className="w-full text-xs px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md cursor-pointer"
                >
                  Extract from cURL
                </button>
              </div>
            )}
          </div>

          {CONFIG_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-gray-600">{label}</label>
              <input
                type={key === 'authToken' ? 'password' : 'text'}
                value={apiConfig[key]}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfig(false)}
              className="flex-1 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleClear}
              className="text-xs px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DevWrapper />
  </StrictMode>
)
