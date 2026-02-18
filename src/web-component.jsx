import React from 'react'
import { createRoot } from 'react-dom/client'
import StatesCanvas from './StatesCanvas'
import './index.css'

function computeJsonDiff(oldText, newText) {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')

  const m = oldLines.length
  const n = newLines.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = oldLines[i - 1] === newLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  const stack = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: 'same', text: ' ' + oldLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'add', text: '+' + newLines[j - 1] })
      j--
    } else {
      stack.push({ type: 'remove', text: '-' + oldLines[i - 1] })
      i--
    }
  }
  stack.reverse()
  return stack
}

class WorkflowStatesCanvasElement extends HTMLElement {
  constructor() {
    super()
    this._root = null
    this._workflow = null
    this._currentWorkflow = null
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
    // Stop keyboard events from bubbling out to Angular's zone.js
    const stop = (e) => e.stopPropagation()
    for (const evt of ['keydown', 'keypress', 'keyup']) {
      this.addEventListener(evt, stop)
    }
    this._root = createRoot(this)
    this._render()
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount()
      this._root = null
    }
  }

  // --- workflow (set to initialize/reset, get to read current edited state) ---

  set workflow(value) {
    this._workflow = value || null
    this._currentWorkflow = value ? JSON.parse(JSON.stringify(value)) : null
    this._render()
  }

  get workflow() {
    return this._currentWorkflow
  }

  // --- apiConfig ---

  set apiConfig(value) {
    this._apiConfig = { ...this._apiConfig, ...(value || {}) }
    this._render()
  }

  get apiConfig() {
    return { ...this._apiConfig }
  }

  // --- roles ---

  set roles(value) {
    this._roles = value || null
    this._render()
  }

  get roles() {
    return this._roles
  }

  // --- actionEvents ---

  set actionEvents(value) {
    this._actionEvents = value || null
    this._render()
  }

  get actionEvents() {
    return this._actionEvents
  }

  // --- fieldMeta ---

  set fieldMeta(value) {
    this._fieldMeta = value || null
    this._render()
  }

  get fieldMeta() {
    return this._fieldMeta
  }

  getDiff() {
    const original = JSON.stringify(this._workflow, null, 2)
    const current = JSON.stringify(this._currentWorkflow, null, 2)
    return computeJsonDiff(original, current)
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
          this._currentWorkflow = updatedWorkflow
        }}
      />
    )
  }
}

if (!customElements.get('workflow-states-canvas')) {
  customElements.define('workflow-states-canvas', WorkflowStatesCanvasElement)
}
