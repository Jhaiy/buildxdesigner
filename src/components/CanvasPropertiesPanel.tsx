"use client"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Grid3X3, Palette, Settings } from "lucide-react"

interface CanvasProperties {
  backgroundColor: string
  showGrid: boolean
  gridSize: number
  gridColor: string
}

interface CanvasPropertiesPanelProps {
  properties: CanvasProperties
  onUpdateProperties: (updates: Partial<CanvasProperties>) => void
}

export function CanvasPropertiesPanel({ properties, onUpdateProperties }: CanvasPropertiesPanelProps) {
  return (
    <Card className="w-full h-full border-0 rounded-lg bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Canvas Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-4">
        <Tabs defaultValue="background" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="background" className="text-xs">
              <Palette className="w-3.5 h-3.5 mr-1.5" />
              Background
            </TabsTrigger>
            <TabsTrigger value="grid" className="text-xs">
              <Grid3X3 className="w-3.5 h-3.5 mr-1.5" />
              Grid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="background" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="bg-color" className="text-xs font-medium">
                Background Color
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={properties.backgroundColor}
                  onChange={(e) => onUpdateProperties({ backgroundColor: e.target.value })}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={properties.backgroundColor}
                  onChange={(e) => onUpdateProperties({ backgroundColor: e.target.value })}
                  placeholder="#ffffff"
                  className="flex-1 text-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Set the canvas background color</p>
            </div>
          </TabsContent>

          <TabsContent value="grid" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid" className="text-xs font-medium cursor-pointer">
                  Show Grid
                </Label>
                <Switch
                  id="show-grid"
                  checked={properties.showGrid}
                  onCheckedChange={(checked) => onUpdateProperties({ showGrid: checked })}
                />
              </div>

              {properties.showGrid && (
                <>
                  <div>
                    <Label htmlFor="grid-size" className="text-xs font-medium">
                      Grid Size
                    </Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="grid-size"
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={properties.gridSize}
                        onChange={(e) => onUpdateProperties({ gridSize: Number.parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded min-w-12 text-center">
                        {properties.gridSize}px
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="grid-color" className="text-xs font-medium">
                      Grid Color
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="grid-color"
                        type="color"
                        value={properties.gridColor}
                        onChange={(e) => onUpdateProperties({ gridColor: e.target.value })}
                        className="w-12 h-10 p-1 border rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={properties.gridColor}
                        onChange={(e) => onUpdateProperties({ gridColor: e.target.value })}
                        placeholder="#e5e5e5"
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
