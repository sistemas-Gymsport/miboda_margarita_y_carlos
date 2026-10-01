import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children, className }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 5 : undefined,
    opacity: isDragging ? 0.85 : 1,
    boxShadow: isDragging ? '0 20px 40px -20px rgb(0 0 0 / 0.35)' : undefined,
  };
  const handleProps = { ref: setActivatorNodeRef, ...attributes, ...listeners, 'aria-label': 'Arrastrar para reordenar' };
  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children(handleProps)}
    </div>
  );
}

/**
 * Lista ordenable por arrastrar y soltar (raton, tactil y teclado).
 * children(item, handleProps) renderiza cada elemento; onReorder recibe el nuevo arreglo.
 */
export default function SortableList({ items, onReorder, layout = 'list', className, itemClassName, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={layout === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} className={itemClassName}>
              {(handleProps) => children(item, handleProps)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
