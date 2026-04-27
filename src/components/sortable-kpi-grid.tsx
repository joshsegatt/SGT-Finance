"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface KpiCard {
  id: string;
  children: React.ReactNode;
}

interface SortableKpiGridProps {
  cards: KpiCard[];
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "sgt-kpi-order";

function loadOrder(ids: string[]): string[] {
  if (typeof window === "undefined") return ids;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return ids;
    const parsed = JSON.parse(saved) as string[];
    // Validate saved order contains all current IDs
    if (parsed.length === ids.length && ids.every((id) => parsed.includes(id))) {
      return parsed;
    }
  } catch {}
  return ids;
}

function saveOrder(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

// ─── Sortable Card Wrapper ──────────────────────────────────────────────────

function SortableCard({ id, children, isDragging: isOtherDragging }: { id: string; children: React.ReactNode; isDragging: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/drag">
      {/* Drag handle - appears on hover */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-8 rounded-md bg-card border border-border/60
          flex items-center justify-center cursor-grab active:cursor-grabbing
          opacity-0 group-hover/drag:opacity-100 transition-all duration-200
          hover:bg-muted hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
          ${isOtherDragging ? "opacity-50" : ""}`}
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

// ─── Drag Overlay Card ──────────────────────────────────────────────────────

function DragOverlayCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative cursor-grabbing"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.15)",
        borderRadius: "12px",
        transform: "scale(1.03) rotate(1deg)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function SortableKpiGrid({ cards }: SortableKpiGridProps) {
  const defaultOrder = cards.map((c) => c.id);
  const [order, setOrder] = useState<string[]>(defaultOrder);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load saved order on mount
  useEffect(() => {
    setOrder(loadOrder(defaultOrder));
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        setOrder((prev) => {
          const oldIndex = prev.indexOf(String(active.id));
          const newIndex = prev.indexOf(String(over.id));
          const newOrder = arrayMove(prev, oldIndex, newIndex);
          saveOrder(newOrder);
          return newOrder;
        });
      }
    },
    []
  );

  const orderedCards = order
    .map((id) => cards.find((c) => c.id === id))
    .filter((c): c is KpiCard => c !== undefined);

  const activeCard = activeId ? cards.find((c) => c.id === activeId) : null;

  // SSR fallback
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.id}>{card.children}</div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={horizontalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {orderedCards.map((card) => (
            <SortableCard key={card.id} id={card.id} isDragging={!!activeId}>
              {card.children}
            </SortableCard>
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{
        duration: 250,
        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
      }}>
        {activeCard ? (
          <DragOverlayCard>{activeCard.children}</DragOverlayCard>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
