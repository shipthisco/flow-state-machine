import { memo } from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'
import EdgeAddMenu from './EdgeAddMenu'
import { ShieldCheck, Filter } from 'lucide-react'

function ActionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}) {
  const isDirectModeEdge = data?.isDirectModeEdge
  const isSelfLoop = Math.abs(sourceX - targetX) < 5 && Math.abs(sourceY - targetY) < 5

  let edgePath, labelX, labelY

  if (isSelfLoop) {
    const loopSize = 70
    edgePath = `M ${sourceX} ${sourceY} C ${sourceX + loopSize} ${sourceY - loopSize}, ${sourceX + loopSize} ${sourceY + loopSize}, ${sourceX} ${sourceY}`
    labelX = sourceX + loopSize
    labelY = sourceY
  } else {
    ;[edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })
  }

  if (isDirectModeEdge) {
    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            stroke: '#f59e0b',
            strokeWidth: 1.5,
            strokeDasharray: '4 4',
            transition: 'stroke 0.15s, stroke-width 0.15s',
          }}
        />
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-all cursor-pointer group flex items-center gap-1"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {data.sequenceLabel && (
              <div className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm bg-amber-50 text-amber-700 border-amber-300 whitespace-nowrap">
                {data.sequenceLabel}
              </div>
            )}
            {data.onInsertState && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <EdgeAddMenu
                  onAddAction={() => data.onAddAction?.()}
                  onInsertState={() => data.onInsertState?.()}
                />
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      </>
    )
  }

  const isPrimary = data?.isPrimary
  const action = data?.action
  const title = action?.title

  // Gather indicators
  const requiredFields = action?.enable_required_fields ? (action.required_fields || []) : []
  const fieldCriteria = action?.enable_field_criterion ? (action.field_criterion || []) : []
  const hasIndicators = requiredFields.length > 0 || fieldCriteria.length > 0

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? 'hsl(0 0% 9%)' : isPrimary ? 'hsl(0 0% 9%)' : '#94a3b8',
          strokeWidth: selected ? 3 : isPrimary ? 2 : 1.5,
          strokeDasharray: isPrimary ? undefined : '6 3',
          transition: 'stroke 0.15s, stroke-width 0.15s',
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-all cursor-pointer group flex flex-col items-center gap-0.5"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <div className="flex items-center gap-1">
            {title && (
              <div
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shadow-sm transition-all whitespace-nowrap ${
                  selected
                    ? 'bg-foreground text-background border-foreground shadow-md'
                    : isPrimary
                      ? 'bg-gray-100 text-foreground border-gray-300 hover:bg-gray-200'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {title}
              </div>
            )}
            {data?.onAddAction && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <EdgeAddMenu
                  onAddAction={() => data.onAddAction?.()}
                  onInsertState={() => data.onInsertState?.()}
                />
              </div>
            )}
          </div>

          {/* Condition indicators below the title */}
          {hasIndicators && (
            <div className="flex items-center gap-1 max-w-[200px]">
              {requiredFields.length > 0 && (
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200">
                  <ShieldCheck className="h-2.5 w-2.5 text-orange-500" />
                  <span className="text-[8px] text-orange-600 font-medium whitespace-nowrap">
                    {requiredFields.length} required
                  </span>
                </div>
              )}
              {fieldCriteria.length > 0 && (
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                  <Filter className="h-2.5 w-2.5 text-blue-500" />
                  <span className="text-[8px] text-blue-600 font-medium whitespace-nowrap">
                    {fieldCriteria.length} condition{fieldCriteria.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(ActionEdge)
