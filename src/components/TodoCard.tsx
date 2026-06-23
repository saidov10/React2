import { useState, useRef } from 'react';
import type { Todo } from '../api/todosApi';
import {
  useDeleteTodoMutation,
  useToggleCompletedMutation,
  useDeleteImageMutation,
  useAddImagesMutation,
  getImageUrl,
} from '../api/todosApi';
import { Trash2, Pencil, CheckCircle2, Circle, ImagePlus, X, ChevronUp } from 'lucide-react';
import EditTodoModal from './EditTodoModal';

interface Props {
  todo: Todo;
}

export default function TodoCard({ todo }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [deleteTodo, { isLoading: deleting }] = useDeleteTodoMutation();
  const [toggleCompleted, { isLoading: toggling }] = useToggleCompletedMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [addImages] = useAddImagesMutation();

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    addImages({ todoId: todo.id, images: files });
    // сбросить input чтобы можно было выбрать тот же файл снова
    e.target.value = '';
  };

  const visibleImages = expanded ? todo.images : todo.images?.slice(0, 3);
  const hiddenCount = (todo.images?.length ?? 0) - 3;

  return (
    <>
      <div
        className={`
          relative rounded-2xl border transition-all duration-300 overflow-hidden group
          ${todo.isCompleted
            ? 'bg-white/3 border-green-500/20'
            : 'bg-white/5 border-white/10 hover:border-violet-500/40 hover:bg-white/8'
          }
        `}
      >
        {/* Completed glow overlay */}
        {todo.isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
        )}

        <div className="p-5">
          {/* Top row */}
          <div className="flex items-start gap-3">
            {/* Toggle completed */}
            <button
              onClick={() => toggleCompleted(todo.id)}
              disabled={toggling}
              className={`mt-0.5 flex-shrink-0 transition-all duration-200 disabled:opacity-50 ${
                todo.isCompleted ? 'text-green-400 scale-110' : 'text-gray-500 hover:text-green-400'
              }`}
              title={todo.isCompleted ? 'Отметить как незавершённое' : 'Отметить как выполненное'}
            >
              {todo.isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base leading-snug break-words ${todo.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                {todo.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed break-words line-clamp-2">
                {todo.description}
              </p>
            </div>

            {/* Actions (visible on hover) */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowEdit(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                title="Редактировать"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                disabled={deleting}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50"
                title="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Images */}
          {todo.images && todo.images.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {visibleImages.map((img) => (
                  <div key={img.id} className="relative w-16 h-16 rounded-xl overflow-hidden group/img flex-shrink-0">
                    <img
                      src={getImageUrl(img.imageName)}
                      alt=""
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setLightbox(getImageUrl(img.imageName))}
                    />
                    <button
                      onClick={() => deleteImage({ imageId: img.id, todoId: todo.id })}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"
                      title="Удалить фото"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}

                {/* Show more */}
                {!expanded && hiddenCount > 0 && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-sm text-gray-400 hover:text-white hover:bg-white/20 transition-all flex-shrink-0"
                  >
                    +{hiddenCount}
                  </button>
                )}
              </div>

              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ChevronUp size={14} /> Свернуть
                </button>
              )}
            </div>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              todo.isCompleted
                ? 'bg-green-500/15 text-green-400'
                : 'bg-violet-500/15 text-violet-400'
            }`}>
              {todo.isCompleted ? '✓ Выполнено' : 'В процессе'}
            </span>

            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-400 transition-colors cursor-pointer"
              title="Добавить фото"
            >
              <ImagePlus size={13} />
              <span>Добавить фото</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImages}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && <EditTodoModal todo={todo} onClose={() => setShowEdit(false)} />}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Просмотр"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}
