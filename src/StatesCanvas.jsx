import { useState, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ApiProvider } from './lib/api-context'
import FlowCanvas from './components/FlowCanvas'
import Sidebar from './components/Sidebar'
import NodePalette from './components/NodePalette'

export default function StatesCanvas({ workflow: externalWorkflow, onChange, apiConfig, roles, actionEvents, fieldMeta }) {
  const [selectedElement, setSelectedElement] = useState(null)
  const workflow = externalWorkflow

  const handleChange = useCallback((updatedWorkflow) => {
    onChange?.(updatedWorkflow)
  }, [onChange])

  const handleSelectElement = useCallback((element) => {
    setSelectedElement(element)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSelectedElement(null)
  }, [])

  if (!workflow) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p className="text-sm">No workflow provided</p>
      </div>
    )
  }

  return (
    <ApiProvider
      apiEndpoint={apiConfig?.apiEndpoint}
      authToken={apiConfig?.authToken}
      organisation={apiConfig?.organisation}
      location={apiConfig?.location}
      region={apiConfig?.region}
      usertype={apiConfig?.usertype}
      collection={apiConfig?.collection}
      initialRoles={roles}
      initialActionEvents={actionEvents}
      initialFieldMeta={fieldMeta}
    >
      <TooltipProvider>
        <div className="h-full flex bg-gray-50 text-foreground">
          <NodePalette isDirectMode={!!workflow.enable_direct_mode} />
          <ReactFlowProvider>
            <FlowCanvas
              workflow={workflow}
              onChange={handleChange}
              selectedElement={selectedElement}
              onSelectElement={handleSelectElement}
            />
          </ReactFlowProvider>
          <Sidebar
            workflow={workflow}
            selectedElement={selectedElement}
            onChange={handleChange}
            onClose={handleCloseSidebar}
            onSelectElement={handleSelectElement}
          />
        </div>
      </TooltipProvider>
    </ApiProvider>
  )
}
