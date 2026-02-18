import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X, Loader2 } from 'lucide-react'
import { useApi } from '@/lib/api-context'
import { TextField } from './form-fields'

const EMPTY_ROLE = {
  name: '',
  description: '',
  _cls_: 'employee_role',
  __display: '',
}

export default function RoleCriterion({ roles, onChange }) {
  const { isConfigured, roles: apiRoles, loading } = useApi()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRole, setNewRole] = useState({ ...EMPTY_ROLE })
  const [search, setSearch] = useState('')

  const remove = (idx) => onChange(roles.filter((_, i) => i !== idx))

  const add = () => {
    if (!newRole.name) return
    onChange([...roles, { ...newRole, __display: newRole.description || newRole.name }])
    setNewRole({ ...EMPTY_ROLE })
    setShowAddForm(false)
    setSearch('')
  }

  const addFromApi = (apiRole) => {
    const role = {
      name: apiRole.name || apiRole.role_id || '',
      description: apiRole.description || apiRole.display || apiRole.name || '',
      _cls_: 'employee_role',
      __display: apiRole.description || apiRole.display || apiRole.name || '',
    }
    if (roles.some((r) => r.name === role.name)) return
    onChange([...roles, role])
    setSearch('')
  }

  const filteredApiRoles = useMemo(() => {
    if (!apiRoles.length) return []
    const existingNames = new Set(roles.map((r) => r.name))
    return apiRoles.filter((r) => {
      const name = r.name || r.role_id || ''
      const display = r.description || r.display || name
      if (existingNames.has(name)) return false
      if (!search) return true
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        display.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [apiRoles, roles, search])

  return (
    <div className="space-y-3">
      {/* Existing roles as chips */}
      {roles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {roles.map((role, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm"
            >
              <span className="font-medium">{role.__display || role.description || role.name}</span>
              <span className="text-muted-foreground text-xs font-mono">({role.name})</span>
              <button onClick={() => remove(idx)} className="text-gray-400 hover:text-red-500 cursor-pointer ml-0.5 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      {roles.length === 0 && !showAddForm && (
        <p className="text-sm text-muted-foreground">No roles configured</p>
      )}

      {/* Add form */}
      {showAddForm ? (
        <div className="space-y-3 p-4 rounded-lg border border-gray-200 bg-gray-50/50">
          {/* API roles search */}
          {isConfigured && (
            <div className="space-y-2">
              <TextField
                label={<>Search Roles {loading && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}</>}
                value={search}
                onChange={(v) => setSearch(v)}
                placeholder="Search available roles..."
              />
              {filteredApiRoles.length > 0 && (
                <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 bg-white">
                  {filteredApiRoles.slice(0, 15).map((r, i) => (
                    <button
                      key={i}
                      onClick={() => addFromApi(r)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2 transition-colors"
                    >
                      <span className="font-medium">{r.description || r.display || r.name}</span>
                      <span className="text-muted-foreground font-mono text-xs">({r.name || r.role_id})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manual entry */}
          <div className="flex gap-3 items-end">
            <TextField
              label="Role Name"
              value={newRole.name}
              onChange={(v) => setNewRole({ ...newRole, name: v })}
              placeholder="account_head"
              className="flex-1"
            />
            <TextField
              label="Description"
              value={newRole.description}
              onChange={(v) => setNewRole({ ...newRole, description: v })}
              placeholder="Account Head"
              className="flex-1"
            />
            <Button size="sm" onClick={add} className="h-9">
              Add
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="text-xs">
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)} className="h-8 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Role
        </Button>
      )}
    </div>
  )
}
