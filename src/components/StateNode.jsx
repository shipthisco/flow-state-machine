import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Filter, ShieldCheck, Zap } from 'lucide-react'

function StateNode({ data, selected }) {
  const { state, isStartState, isDirectMode, stateIdx } = data
  const colorCode = state.color_code || '#171717'
  const actionCount = (state.actions || []).length
  const eventCount = (state.events || []).length
  const hasRequiredFields = state.enable_required_fields && (state.required_fields || []).length > 0
  const hasConditions = state.enable_field_criterion && (state.field_criterion || []).length > 0
  const conditionCount = hasConditions ? state.field_criterion.length : 0

  const accentColor = isStartState ? '#16a34a' : colorCode

  return (
    <div
      className={`bg-white rounded-lg min-w-[180px] max-w-[240px] overflow-hidden transition-all ${
        selected
          ? 'shadow-lg ring-2 ring-foreground/20 ring-offset-1'
          : 'shadow-sm hover:shadow-md'
      }`}
      style={{ border: `1px solid #e5e5e5`, borderLeft: `3px solid ${accentColor}` }}
    >
      <div className="px-3 py-2.5">
        {/* Top row: state_id + badges */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-mono text-gray-400 truncate leading-none">
            {state.state_id}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {isDirectMode && stateIdx != null && (
              <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                #{stateIdx + 1}
              </span>
            )}
            {isStartState && (
              <span className="text-[9px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                START
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="font-medium text-[13px] text-gray-900 truncate leading-snug">
          {state.title || 'Untitled'}
        </div>

        {/* Meta row: counts + indicators */}
        {(actionCount > 0 || eventCount > 0 || hasConditions || hasRequiredFields) && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
            {isDirectMode ? (
              eventCount > 0 && (
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {eventCount}
                </span>
              )
            ) : (
              actionCount > 0 && (
                <span>{actionCount} action{actionCount !== 1 ? 's' : ''}</span>
              )
            )}
            {hasConditions && (
              <span className="flex items-center gap-0.5 text-blue-400" title={`${conditionCount} condition${conditionCount !== 1 ? 's' : ''}`}>
                <Filter className="h-3 w-3" />
                {conditionCount}
              </span>
            )}
            {hasRequiredFields && (
              <span className="flex items-center gap-0.5 text-orange-400" title="Has required fields">
                <ShieldCheck className="h-3 w-3" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Handles */}
      {isDirectMode ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-gray-300 !w-2 !h-2 !border-2 !border-white !-left-1"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-gray-500 !w-2 !h-2 !border-2 !border-white !-right-1"
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-gray-300 !w-2 !h-2 !border-2 !border-white !-top-1"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="!bg-gray-500 !w-2 !h-2 !border-2 !border-white !-bottom-1"
          />
        </>
      )}
    </div>
  )
}

export default memo(StateNode)
