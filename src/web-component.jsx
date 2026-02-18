import React from 'react'
import { createRoot } from 'react-dom/client'
import StatesCanvas from './StatesCanvas'
import './index.css'

class WorkflowStatesCanvasElement extends HTMLElement {
  constructor() {
    super()
    this._root = null
    this._workflow = null
    this._apiConfig = {
      apiEndpoint: '',
      authToken: '',
      organisation: '',
      location: '',
      region: '',
      usertype: '',
      collection: '',
    }
    this._roles = null
    this._actionEvents = null
    this._fieldMeta = null
  }

  connectedCallback() {
    this._root = createRoot(this)
    this._render()
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount()
      this._root = null
    }
  }

  // --- workflow ---

  set workflow(value) {
    this._workflow = value || null
    this._render()
  }

  get workflow() {
    return this._workflow
  }

  // --- apiConfig (for live API fetching) ---

  set apiConfig(value) {
    this._apiConfig = { ...this._apiConfig, ...(value || {}) }
    this._render()
  }

  get apiConfig() {
    return { ...this._apiConfig }
  }

  // --- roles (direct data) ---

  set roles(value) {
    this._roles = value || null
    this._render()
  }

  get roles() {
    return this._roles
  }

  // --- actionEvents (direct data) ---

  set actionEvents(value) {
    this._actionEvents = value || null
    this._render()
  }

  get actionEvents() {
    return this._actionEvents
  }

  // --- fieldMeta (direct data) ---

  set fieldMeta(value) {
    this._fieldMeta = value || null
    this._render()
  }

  get fieldMeta() {
    return this._fieldMeta
  }

  _render() {
    if (!this._root) return
    this._root.render(
      <StatesCanvas
        workflow={this._workflow}
        apiConfig={this._apiConfig}
        roles={this._roles}
        actionEvents={this._actionEvents}
        fieldMeta={this._fieldMeta}
        onChange={(updatedWorkflow) => {
          this._workflow = updatedWorkflow
          this.dispatchEvent(
            new CustomEvent('workflow-change', {
              detail: updatedWorkflow,
              bubbles: true,
            })
          )
        }}
      />
    )
  }
}

if (!customElements.get('workflow-states-canvas')) {
  customElements.define('workflow-states-canvas', WorkflowStatesCanvasElement)
}
