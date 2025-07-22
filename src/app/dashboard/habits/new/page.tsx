"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useThemeForce } from "../../../../hooks/useThemeForce";
import { useDashboard } from "../../../../hooks/useDashboard";
import '../../../../i18n';

interface HabitFormData {
  name: string;
  description: string;
  category: string;
  target_frequency: number;
  target_unit: string;
  icon: string;
  color: string;
}

const categories = [
  { value: 'health', label: 'Salud', icon: '🏥', color: '#10b981' },
  { value: 'exercise', label: 'Ejercicio', icon: '💪', color: '#f59e0b' },
  { value: 'nutrition', label: 'Nutrición', icon: '🥗', color: '#84cc16' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: '#8b5cf6' },
  { value: 'productivity', label: 'Productividad', icon: '📝', color: '#06b6d4' },
  { value: 'learning', label: 'Aprendizaje', icon: '📚', color: '#ef4444' },
  { value: 'sleep', label: 'Sueño', icon: '😴', color: '#6366f1' },
  { value: 'social', label: 'Social', icon: '👥', color: '#ec4899' },
  { value: 'creativity', label: 'Creatividad', icon: '🎨', color: '#f97316' },
  { value: 'other', label: 'Otro', icon: '⭐', color: '#64748b' }
];

const icons = [
  '🏃', '💪', '🥗', '💧', '📚', '🧘', '😴', '🚶', '🏋️', '🧘‍♀️',
  '🥛', '🍎', '🥕', '🥬', '🏊', '🚴', '⚽', '🎾', '🏀', '⛹️',
  '📝', '💻', '🎨', '🎵', '📖', '✍️', '🎯', '⭐', '🌟', '💎'
];

const units = [
  { value: 'times', label: 'veces' },
  { value: 'minutes', label: 'minutos' },
  { value: 'hours', label: 'horas' },
  { value: 'glasses', label: 'vasos' },
  { value: 'pages', label: 'páginas' },
  { value: 'exercises', label: 'ejercicios' },
  { value: 'steps', label: 'pasos' },
  { value: 'kilometers', label: 'kilómetros' }
];

export default function NewHabitPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createHabit } = useDashboard();

  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    category: 'health',
    target_frequency: 1,
    target_unit: 'times',
    icon: '🎯',
    color: '#10b981'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validación básica
    if (!formData.name.trim()) {
      setError('El nombre del hábito es requerido');
      setIsLoading(false);
      return;
    }

    if (formData.target_frequency < 1) {
      setError('La frecuencia objetivo debe ser al menos 1');
      setIsLoading(false);
      return;
    }

    try {
      const success = await createHabit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        target_frequency: formData.target_frequency,
        target_unit: formData.target_unit,
        icon: formData.icon,
        color: formData.color
      });

      if (success) {
        // Redirigir a la página de hábitos
        router.push('/dashboard/habits');
      } else {
        setError('Error al crear el hábito. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof HabitFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Si cambia la categoría, actualizar el color y sugerir un ícono
    if (field === 'category' && typeof value === 'string') {
      const category = categories.find(cat => cat.value === value);
      if (category) {
        setFormData(prev => ({ 
          ...prev, 
          category: value,
          color: category.color,
          icon: category.icon
        }));
      }
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/habits');
  };

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-4 w-1/3"></div>
          <div className="bg-slate-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('habits.create.title', { defaultValue: 'Crear Nuevo Hábito' })}
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Define un nuevo hábito para mejorar tu bienestar diario
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div
          className="border rounded-xl p-6 space-y-6"
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#475569' : '#e2e8f0'
          }}
        >
          {/* Nombre del hábito */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#cbd5e1' : '#374151' }}
            >
              {t('habits.create.name', { defaultValue: 'Nombre del hábito' })} *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              style={{
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#6b7280' : '#d1d5db',
                color: isDark ? '#ffffff' : '#1f2937'
              }}
              placeholder="Ej: Beber 8 vasos de agua"
            />
          </div>

          {/* Descripción */}
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#cbd5e1' : '#374151' }}
            >
              {t('habits.create.description', { defaultValue: 'Descripción' })} (opcional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              style={{
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#6b7280' : '#d1d5db',
                color: isDark ? '#ffffff' : '#1f2937'
              }}
              placeholder="Describe tu hábito..."
            />
          </div>

          {/* Categoría */}
          <div>
            <label 
              htmlFor="category" 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#cbd5e1' : '#374151' }}
            >
              {t('habits.create.category', { defaultValue: 'Categoría' })} *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              style={{
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#6b7280' : '#d1d5db',
                color: isDark ? '#ffffff' : '#1f2937'
              }}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Meta diaria */}
          <div>
            <label 
              htmlFor="target_frequency"
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#cbd5e1' : '#374151' }}
            >
              Meta diaria *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                id="target_frequency"
                min="1"
                max="100"
                value={formData.target_frequency}
                onChange={(e) => handleChange('target_frequency', parseInt(e.target.value) || 1)}
                required
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                style={{
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                  borderColor: isDark ? '#6b7280' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#1f2937'
                }}
                placeholder="1"
              />
              <select
                value={formData.target_unit}
                onChange={(e) => handleChange('target_unit', e.target.value)}
                required
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                style={{
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                  borderColor: isDark ? '#6b7280' : '#d1d5db',
                  color: isDark ? '#ffffff' : '#1f2937'
                }}
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ícono */}
          <div>
            <div 
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? '#cbd5e1' : '#374151' }}
            >
              Ícono *
            </div>
            <div className="grid grid-cols-10 gap-2">
              {icons.map((icon) => {
                let borderClasses;
                if (formData.icon === icon) {
                  borderClasses = 'border-violet-500 bg-violet-50';
                } else if (isDark) {
                  borderClasses = 'border-slate-600 hover:border-slate-500';
                } else {
                  borderClasses = 'border-slate-200 hover:border-slate-300';
                }

                let backgroundColor;
                if (formData.icon === icon) {
                  backgroundColor = isDark ? '#1e1b4b' : '#f3f4f6';
                } else {
                  backgroundColor = isDark ? '#374151' : '#ffffff';
                }

                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleChange('icon', icon)}
                    className={`p-2 text-2xl rounded-lg border-2 transition-colors ${borderClasses}`}
                    style={{ backgroundColor }}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              {t('habits.create.cancel', { defaultValue: 'Cancelar' })}
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {isLoading 
                ? 'Creando...'
                : t('habits.create.save', { defaultValue: 'Crear Hábito' })
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
