"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import type { ComponentData } from "../App"
import { BlocksPalette } from "./BlocksPalette"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface MinimalComponentPanelProps {
  onAddComponent: (component: ComponentData) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function MinimalComponentPanel({
  onAddComponent,
  isCollapsed = false,
  onToggleCollapse,
}: MinimalComponentPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <Popover defaultOpen={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-6 left-6 flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow z-40 bg-transparent"
          title="Add Components (Click to browse)"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Block</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 ml-2 mb-2" side="right" align="end">
        <div className="max-h-96 overflow-hidden">
          <BlocksPalette onSelectBlock={onAddComponent} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
