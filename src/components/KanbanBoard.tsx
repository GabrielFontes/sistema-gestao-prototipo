import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

export interface KanbanItem {
  id: string;
  status: string;
  category?: string;
  [key: string]: any;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  items: KanbanItem[];
  categories?: { id: string; label?: string; icon?: string }[];
  onItemClick?: (item: KanbanItem) => void;
  onStatusChange: (itemId: string, newStatus: string) => void;
  onAddClick?: (status: string, category?: string) => void;
  renderItem?: (item: KanbanItem) => React.ReactNode;
  getCategoryLabel?: (categoryId: string) => string;
  getCategoryIcon?: (categoryId: string) => string;
}

export function KanbanBoard({
  columns,
  items,
  categories,
  onItemClick,
  onStatusChange,
  onAddClick,
  renderItem,
  getCategoryLabel,
  getCategoryIcon,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const itemId = active.id as string;
      const newStatus = over.id as string;
      
      // Check if dropping on a column or category-column combination
      const statusMatch = newStatus.match(/^(.+?)(?:-(.+))?$/);
      if (statusMatch) {
        onStatusChange(itemId, statusMatch[1]);
      }
    }

    setActiveId(null);
  };

  const getItemsForColumn = (status: string, category?: string) => {
    return items.filter(
      (item) =>
        item.status === status &&
        (category === undefined || item.category === category)
    );
  };

  const activeItem = items.find((item) => item.id === activeId);

  const defaultRenderItem = (item: KanbanItem) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{item.name || item.title || 'Sem título'}</h4>
      {item.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      )}
    </div>
  );

  const renderContent = renderItem || defaultRenderItem;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {!categories ? (
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>{column.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {getItemsForColumn(column.status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getItemsForColumn(column.status).map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-move"
                      onClick={() => onItemClick?.(item)}
                    >
                      {renderContent(item)}
                    </Card>
                  ))}
                  {onAddClick && (
                    <Button
                      variant="ghost"
                      className="w-full border-2 border-dashed border-muted-foreground/25 h-12 hover:border-primary hover:bg-primary/5"
                      onClick={() => onAddClick(column.status)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{column.title}</h3>
                {categories.map((category) => (
                  <Card key={`${column.id}-${category.id}`} className="h-fit">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {getCategoryIcon?.(category.id) || category.icon || ''}
                          {getCategoryLabel?.(category.id) || category.label || category.id}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getItemsForColumn(column.status, category.id).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {getItemsForColumn(column.status, category.id).map(
                        (item) => (
                          <Card
                            key={item.id}
                            className="p-3 hover:shadow-md transition-shadow cursor-move text-sm"
                            onClick={() => onItemClick?.(item)}
                          >
                            {renderContent(item)}
                          </Card>
                        )
                      )}
                      {onAddClick && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full border-2 border-dashed border-muted-foreground/25 h-10 hover:border-primary hover:bg-primary/5"
                          onClick={() => onAddClick(column.status, category.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <Card className="p-4 opacity-90 rotate-3 shadow-lg">
            {renderContent(activeItem)}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
