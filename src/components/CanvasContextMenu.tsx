"use client"
import { Copy, Trash2, Layers, ArrowUp, ArrowDown, Link2Off } from "lucide-react"

interface ContextMenuPosition {
  x: number
  y: number
}

interface CanvasContextMenuProps {
  position: ContextMenuPosition | null
  onClose: () => void
  onDuplicate: () => void
  onDelete: () => void
  onGroup: () => void
  onUngroup: () => void
  onBringToFront: () => void
  onSendToBack: () => void
  onCopy: () => void
  canGroup: boolean
  canUngroup: boolean
}

export function CanvasContextMenu({
  position,
  onClose,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onBringToFront,
  onSendToBack,
  onCopy,
  canGroup,
  canUngroup,
}: CanvasContextMenuProps) {
  if (!position) return null

  const menuItems = [
    { label: "Duplicate", icon: Copy, onClick: onDuplicate, divider: false },
    { label: "Copy", icon: Copy, onClick: onCopy, divider: true },
    { label: "Group", icon: Layers, onClick: onGroup, disabled: !canGroup, divider: false },
    { label: "Ungroup", icon: Link2Off, onClick: onUngroup, disabled: !canUngroup, divider: true },
    { label: "Bring to Front", icon: ArrowUp, onClick: onBringToFront, divider: false },
    { label: "Send to Back", icon: ArrowDown, onClick: onSendToBack, divider: true },
    { label: "Delete", icon: Trash2, onClick: onDelete, danger: true, divider: false },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Context Menu */}
      <div
        className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-max"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => {
                item.onClick()
                onClose()
              }}
              disabled={item.disabled}
              className={`
                w-full px-3 py-2 text-sm flex items-center gap-2 transition-colors
                ${
                  item.disabled
                    ? "opacity-50 cursor-not-allowed text-muted-foreground"
                    : item.danger
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-foreground hover:bg-accent"
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
            {item.divider && <div className="h-px bg-border my-1" />}
          </div>
        ))}
      </div>
    </>
  )
}
