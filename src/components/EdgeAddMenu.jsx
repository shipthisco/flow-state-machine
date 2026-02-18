import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, ArrowRight, Circle } from 'lucide-react'

export default function EdgeAddMenu({ onAddAction, onInsertState }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-3 w-3 text-gray-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" sideOffset={8}>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onAddAction()
          }}
        >
          <ArrowRight className="h-4 w-4 text-gray-500" />
          Add Action
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onInsertState()
          }}
        >
          <Circle className="h-4 w-4 text-gray-500" />
          Insert State
        </button>
      </PopoverContent>
    </Popover>
  )
}
