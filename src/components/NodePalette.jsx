import { GripVertical, Circle, ArrowRight, Info } from 'lucide-react'

export default function NodePalette({ isDirectMode }) {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-[220px] border-r border-gray-200 bg-gray-50/80 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Components</h3>
      </div>

      <div className="flex-1 px-3 py-3 space-y-2 overflow-y-auto">
        {/* State Node */}
        <div
          className="flex items-start gap-2.5 px-3 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-foreground/20 transition-all select-none group"
          draggable
          onDragStart={(e) => onDragStart(e, 'stateNode')}
        >
          <GripVertical className="h-4 w-4 text-gray-300 group-hover:text-gray-400 mt-0.5 shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center shrink-0">
              <Circle className="h-3.5 w-3.5 text-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-800 leading-tight">State Node</div>
              <div className="text-[10px] text-gray-400 leading-tight mt-0.5">Workflow state</div>
            </div>
          </div>
        </div>

        {/* Action Node — hidden in direct mode */}
        {!isDirectMode && (
          <div
            className="flex items-start gap-2.5 px-3 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-400/40 transition-all select-none group"
            draggable
            onDragStart={(e) => onDragStart(e, 'actionNode')}
          >
            <GripVertical className="h-4 w-4 text-gray-300 group-hover:text-gray-400 mt-0.5 shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-800 leading-tight">Action Node</div>
                <div className="text-[10px] text-gray-400 leading-tight mt-0.5">State transition</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isDirectMode && (
        <div className="px-3 pb-3">
          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
            <Info className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <span className="text-[10px] text-amber-700 leading-tight">
              Direct Mode — actions disabled
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
