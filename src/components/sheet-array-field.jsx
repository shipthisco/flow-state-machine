import { useState, useCallback, useContext, createContext } from 'react'
import { Plus, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { SHEET_SIDE, SHEET_BASE_WIDTH, SHEET_NESTING_STEP, SHEET_MIN_WIDTH } from '@/lib/constants'

export const SheetNestingContext = createContext(0)

/**
 * SheetArrayField — for complex object arrays (4+ fields).
 * Shows items as cards, opens a right-side sheet for editing.
 * Supports nesting: each deeper level gets a narrower sheet.
 */
export function SheetArrayField({
  label,
  description,
  items,
  onChange,
  createNew,
  getItemLabel,
  getItemDescription,
  getItemBadges,
  renderEditor,
  customAddButtons,
  sheetTitle = 'Edit Item',
  sheetDescription,
  className,
  minItems = 0,
  maxItems,
}) {
  const depth = useContext(SheetNestingContext)
  const sheetWidth = Math.max(SHEET_BASE_WIDTH - depth * SHEET_NESTING_STEP, SHEET_MIN_WIDTH)

  const [editingIndex, setEditingIndex] = useState(null)

  const handleAdd = useCallback(() => {
    const newItem = createNew()
    const newItems = [...items, newItem]
    onChange(newItems)
    setEditingIndex(newItems.length - 1)
  }, [items, onChange, createNew])

  const addItem = useCallback((newItem) => {
    const newItems = [...items, newItem]
    onChange(newItems)
    setEditingIndex(newItems.length - 1)
  }, [items, onChange])

  const handleDelete = useCallback(
    (index) => {
      const newItems = items.filter((_, i) => i !== index)
      onChange(newItems)
      if (editingIndex === index) setEditingIndex(null)
    },
    [items, onChange, editingIndex]
  )

  const handleItemChange = useCallback(
    (index, newItem) => {
      const newItems = [...items]
      newItems[index] = newItem
      onChange(newItems)
    },
    [items, onChange]
  )

  const canAdd = maxItems === undefined || items.length < maxItems
  const canDelete = items.length > minItems

  const currentItem = editingIndex !== null ? items[editingIndex] : null
  const resolvedSheetTitle =
    editingIndex !== null
      ? typeof sheetTitle === 'function'
        ? sheetTitle(items[editingIndex], editingIndex)
        : sheetTitle
      : ''

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      {(label || description) && (
        <div className="flex items-center justify-between">
          <div>
            {label && <span className="text-sm font-medium">{label}</span>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{items.length} items</span>
            {canAdd && !customAddButtons && (
              <Button size="sm" variant="outline" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">No items yet</p>
            {canAdd && !customAddButtons && (
              <Button size="sm" variant="outline" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Add First Item
              </Button>
            )}
            {canAdd && customAddButtons && customAddButtons(addItem)}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const itemLabel = getItemLabel(item, index)
            const itemDesc = getItemDescription?.(item, index)
            const itemBadges = getItemBadges?.(item, index) || []

            return (
              <Card
                key={index}
                className={cn(
                  'group cursor-pointer transition-colors hover:bg-accent/50',
                  editingIndex === index && 'ring-2 ring-primary'
                )}
                onClick={() => setEditingIndex(index)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{itemLabel}</span>
                        {itemBadges.map((badge, i) => (
                          <Badge key={i} variant={badge.variant || 'secondary'} className="text-xs">
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                      {itemDesc && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{itemDesc}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {canDelete && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Custom add buttons or default add button */}
      {canAdd && customAddButtons && customAddButtons(addItem)}
      {!customAddButtons && !label && !description && canAdd && items.length > 0 && (
        <Button size="sm" variant="outline" onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      )}

      {/* Edit Sheet — nested right-side drawer */}
      <Sheet open={editingIndex !== null} onOpenChange={(open) => !open && setEditingIndex(null)}>
        <SheetContent
          side={SHEET_SIDE}
          className="p-0 overflow-hidden"
          style={{ width: `${sheetWidth}vw`, maxWidth: `${sheetWidth}vw` }}
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 pt-5 pb-4 border-b border-gray-100 bg-white shrink-0">
              <div className="pr-8">
                <SheetTitle>{resolvedSheetTitle}</SheetTitle>
                {sheetDescription ? (
                  <SheetDescription>{sheetDescription}</SheetDescription>
                ) : (
                  <SheetDescription className="sr-only">Edit item details</SheetDescription>
                )}
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              <div className="px-6 py-6">
                <SheetNestingContext.Provider value={depth + 1}>
                  {currentItem !== null &&
                    editingIndex !== null &&
                    renderEditor(currentItem, editingIndex, (newItem) =>
                      handleItemChange(editingIndex, newItem)
                    )}
                </SheetNestingContext.Provider>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
