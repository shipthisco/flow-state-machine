import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { TextField } from './form-fields'

const EMPTY_TASK_UPDATE = {
  task_id: '',
  document_view_accessor: '',
  document_id_accessor: '',
}

export default function TaskUpdates({ updates, onChange }) {
  const update = (idx, updated) => {
    onChange(updates.map((u, i) => (i === idx ? updated : u)))
  }

  const add = () => onChange([...updates, { ...EMPTY_TASK_UPDATE }])
  const remove = (idx) => onChange(updates.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      {updates.map((u, idx) => (
        <div key={idx} className="group flex gap-3 items-end p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors">
          <TextField
            label="Task ID"
            value={u.task_id}
            onChange={(v) => update(idx, { ...u, task_id: v })}
            placeholder="invoice_sent"
            className="flex-1"
          />
          <TextField
            label="Doc View Accessor"
            value={u.document_view_accessor}
            onChange={(v) => update(idx, { ...u, document_view_accessor: v })}
            placeholder="reference._cls_"
            className="flex-1"
          />
          <TextField
            label="Doc ID Accessor"
            value={u.document_id_accessor}
            onChange={(v) => update(idx, { ...u, document_id_accessor: v })}
            placeholder="reference._id"
            className="flex-1"
          />
          <button
            onClick={() => remove(idx)}
            className="mb-0.5 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs">
        <Plus className="h-3.5 w-3.5" />
        Add Task Update
      </Button>
    </div>
  )
}
