"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "@/hooks/useThemeForce";
import { useDashboard } from "@/hooks/useDashboard";
import '../../i18n';

// Acciones rápidas del dashboard
const getQuickActions = (t: any, isDark: boolean) => [
  {
    id: 'add-habit',
    title: t('dashboard.quick_actions.add_habit', { defaultValue: 'Agregar Hábito' }),
    icon: "➕",
    color: "text-green-600",
    bg: isDark ? "bg-green-900" : "bg-green-50",
    border: isDark ? "border-green-700" : "border-green-200",
    href: "/dashboard/habits/new"
  },
  {
    id: 'view-progress',
    title: t('dashboard.quick_actions.view_progress', { defaultValue: 'Ver Progreso' }),
    icon: "📈",
    color: "text-blue-600",
    bg: isDark ? "bg-blue-900" : "bg-blue-50",
    border: isDark ? "border-blue-700" : "border-blue-200",
    href: "/dashboard/progress"
  },
  {
    id: 'view-challenges',
    title: t('dashboard.quick_actions.view_challenges', { defaultValue: 'Ver Desafíos' }),
    icon: "🎯",
    color: "text-purple-600",
    bg: isDark ? "bg-purple-900" : "bg-purple-50",
    border: isDark ? "border-purple-700" : "border-purple-200",
    href: "/dashboard/challenges"
  },
];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  
  // Usar el hook real del dashboard
  const { 
    habits, 
    isLoading, 
    error, 
    toggleHabit, 
    getFormattedStats,
    getFormattedWeeklyProgress
  } = useDashboard();

  useEffect(() => {
    setMounted(true);
    const lang = localStorage.getItem('vivesano_lang') || localStorage.getItem('i18nextLng') || 'es';
    const html = document.documentElement;
    
    // Solo manejar idioma, el tema lo maneja useThemeForce
    html.setAttribute('lang', lang);
    
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  // Mostrar loading mientras cargamos datos reales
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Mostrar error si hay problemas
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const formattedStats = getFormattedStats(t);
  const weeklyProgress = getFormattedWeeklyProgress(t);
  const quickActions = getQuickActions(t, isDark);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardHeader t={t} isDark={isDark} />
      {formattedStats && <StatsGrid stats={formattedStats} isDark={isDark} />}
      <QuickActionsSection t={t} actions={quickActions} isDark={isDark} />
      <RecentProgressSection isDark={isDark} habits={habits} onToggleHabit={toggleHabit} weeklyProgress={weeklyProgress} t={t} />
    </div>
  );
}

// Componente de error
const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
      <p className="text-gray-600">{error}</p>
    </div>
  </div>
);

// Componente de carga
const LoadingSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded mb-4 w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-200 rounded-lg h-24"></div>
        <div className="bg-slate-200 rounded-lg h-24"></div>
        <div className="bg-slate-200 rounded-lg h-24"></div>
        <div className="bg-slate-200 rounded-lg h-24"></div>
      </div>
    </div>
  </div>
);

// Componente del header
const DashboardHeader = ({ t, isDark }: { t: any; isDark: boolean }) => (
  <div className="mb-8">
    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {t('dashboard.welcome')}
    </h1>
  </div>
);

// Componente de estadísticas
const StatsGrid = ({ stats, isDark }: { stats: any[]; isDark: boolean }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat) => (
      <StatCard key={stat.id} stat={stat} isDark={isDark} />
    ))}
  </div>
);

// Componente para tarjeta de estadística individual
const StatCard = ({ stat, isDark }: { stat: any; isDark: boolean }) => (
  <div
    className={`
      ${stat.bg} ${stat.border} border rounded-xl p-6 
      transition-all duration-200 hover:shadow-lg hover:scale-105
    `}
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0',
      color: isDark ? '#f1f5f9' : '#1e293b'
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-2xl">{stat.icon}</span>
      <div className={`text-2xl font-bold ${stat.color}`}>
        {stat.value}
        {stat.total && <span className={`text-sm`} style={{ color: isDark ? '#94a3b8' : '#64748b' }}>/{stat.total}</span>}
        {stat.unit && <span className={`text-sm ml-1`} style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{stat.unit}</span>}
      </div>
    </div>
    <h3 className={`text-sm font-medium`} style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
      {stat.title}
    </h3>
  </div>
);

// Componente de acciones rápidas
const QuickActionsSection = ({ t, actions, isDark }: { t: any; actions: any[]; isDark: boolean }) => (
  <div className="mb-8">
    <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {t('dashboard.quick_actions.title')}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <QuickActionCard key={action.id} action={action} />
      ))}
    </div>
  </div>
);

// Componente para tarjeta de acción rápida
const QuickActionCard = ({ action }: { action: any }) => (
  <a
    href={action.href}
    className={`
      ${action.bg} ${action.border} border rounded-lg p-4 
      transition-all duration-200 hover:shadow-md hover:scale-105
      block text-center group cursor-pointer
    `}
  >
    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
      {action.icon}
    </div>
    <h3 className={`font-medium ${action.color} group-hover:opacity-80 transition-opacity`}>
      {action.title}
    </h3>
  </a>
);

// Componente de progreso reciente
const RecentProgressSection = ({ 
  isDark, 
  habits, 
  onToggleHabit,
  weeklyProgress,
  t
}: { 
  isDark: boolean; 
  habits: any[]; 
  onToggleHabit: (habitId: string) => Promise<boolean>;
  weeklyProgress: any[] | null;
  t: any;
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <HabitsCard isDark={isDark} habits={habits} onToggleHabit={onToggleHabit} t={t} />
    <WeeklyProgressCard isDark={isDark} weeklyProgress={weeklyProgress} t={t} />
  </div>
);

// Componente de hábitos
const HabitsCard = ({ 
  isDark, 
  habits, 
  onToggleHabit,
  t
}: { 
  isDark: boolean; 
  habits: any[]; 
  onToggleHabit: (habitId: string) => Promise<boolean>;
  t: any;
}) => (
  <div 
    className="border rounded-xl p-6 shadow-sm"
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0',
      color: isDark ? '#f1f5f9' : '#1e293b'
    }}
  >
    <h3 className="text-lg font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
      {t('dashboard.today_habits', { defaultValue: 'Hábitos de hoy' })}
    </h3>
    <div className="space-y-3">
      {habits.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🌟</div>
          <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {t('dashboard.no_habits', { defaultValue: 'No tienes hábitos configurados aún.' })}
          </p>
          <a 
            href="/dashboard/habits/new" 
            className="inline-block mt-2 text-sm px-3 py-1 rounded hover:opacity-80 transition-opacity"
            style={{ color: isDark ? '#a78bfa' : '#7c3aed' }}
          >
            {t('dashboard.create_first_habit', { defaultValue: 'Crear tu primer hábito' })}
          </a>
        </div>
      ) : (
        habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} isDark={isDark} onToggle={() => onToggleHabit(habit.id)} />
        ))
      )}
    </div>
  </div>
);

// Componente de progreso semanal
const WeeklyProgressCard = ({ isDark, weeklyProgress, t }: { isDark: boolean; weeklyProgress: any[] | null; t: any }) => (
  <div 
    className="border rounded-xl p-6 shadow-sm"
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0',
      color: isDark ? '#f1f5f9' : '#1e293b'
    }}
  >
    <h3 className="text-lg font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
      {t('dashboard.weekly_progress', { defaultValue: 'Progreso semanal' })}
    </h3>
    <div className="space-y-4">
      {weeklyProgress ? (
        weeklyProgress.map((progress) => (
          <ProgressBar
            key={progress.label}
            label={progress.label}
            percentage={progress.percentage}
            width={progress.width}
            color={progress.color}
            isDark={isDark}
          />
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {t('dashboard.loading_progress', { defaultValue: 'Cargando progreso...' })}
          </p>
        </div>
      )}
    </div>
  </div>
);

// Componente de barra de progreso
const ProgressBar = ({ label, percentage, width, color, isDark }: {
  label: string;
  percentage: string;
  width: string;
  color: string;
  isDark: boolean;
}) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span style={{ color: isDark ? '#cbd5e1' : '#374151' }}>{label}</span>
      <span style={{ color: isDark ? '#cbd5e1' : '#374151' }}>{percentage}</span>
    </div>
    <div 
      className="w-full rounded-full h-2"
      style={{ backgroundColor: isDark ? '#475569' : '#e2e8f0' }}
    >
      <div className={`${color} h-2 rounded-full`} style={{ width }}></div>
    </div>
  </div>
);

// Componente para elementos de hábito
const HabitItem = ({ 
  habit, 
  isDark, 
  onToggle 
}: { 
  habit: any; 
  isDark: boolean; 
  onToggle: () => void;
}) => {
  const getCheckboxClasses = () => {
    if (habit.isCompletedToday) return 'bg-green-500 border-green-500 cursor-pointer';
    return `${isDark ? 'border-slate-600' : 'border-slate-300'} cursor-pointer hover:border-green-400`;
  };

  const getTextClasses = () => {
    if (habit.isCompletedToday) return 'line-through text-slate-500';
    return isDark ? 'text-slate-300' : 'text-slate-700';
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
          ${getCheckboxClasses()}
        `}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-label={habit.isCompletedToday ? 'Marcar hábito como incompleto' : 'Marcar hábito como completado'}
        type="button"
      >
        {habit.isCompletedToday && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <span className="text-xl">{habit.icon}</span>
      <div className="flex-1">
        <span className={`block ${getTextClasses()}`}>
          {habit.name}
        </span>
        {habit.target_frequency > 1 && (
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {habit.todayAmount}/{habit.target_frequency} {habit.target_unit}
          </span>
        )}
      </div>
      {habit.progressPercentage > 0 && habit.progressPercentage < 100 && (
        <div className="w-16">
          <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'} rounded-full h-1.5`}>
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${habit.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
