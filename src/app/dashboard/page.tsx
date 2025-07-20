"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import '../../i18n';

// Datos mock para el dashboard
const getDashboardStats = (t: any, isDark: boolean) => [
  {
    id: 'habits',
    title: t('dashboard.overview.habits_completed'),
    value: "8",
    total: "12",
    icon: "✅",
    color: "text-green-600",
    bg: isDark ? "bg-green-900/20" : "bg-green-50",
    border: isDark ? "border-green-700" : "border-green-200",
  },
  {
    id: 'streak',
    title: t('dashboard.overview.current_streak'),
    value: "15",
    unit: "días",
    icon: "🔥",
    color: "text-orange-600",
    bg: isDark ? "bg-orange-900/20" : "bg-orange-50",
    border: isDark ? "border-orange-700" : "border-orange-200",
  },
  {
    id: 'points',
    title: t('dashboard.overview.total_points'),
    value: "1,250",
    icon: "⭐",
    color: "text-purple-600",
    bg: isDark ? "bg-purple-900/20" : "bg-purple-50",
    border: isDark ? "border-purple-700" : "border-purple-200",
  },
  {
    id: 'level',
    title: t('dashboard.overview.level'),
    value: "7",
    icon: "🏆",
    color: "text-blue-600",
    bg: isDark ? "bg-blue-900/20" : "bg-blue-50",
    border: isDark ? "border-blue-700" : "border-blue-200",
  },
];

const getQuickActions = (t: any, isDark: boolean) => [
  {
    id: 'add-habit',
    title: t('dashboard.quick_actions.add_habit'),
    icon: "➕",
    color: "text-green-600",
    bg: isDark ? "bg-green-900/20" : "bg-green-50",
    border: isDark ? "border-green-700" : "border-green-200",
    href: "/dashboard/habits/new"
  },
  {
    id: 'log-activity',
    title: t('dashboard.quick_actions.log_activity'),
    icon: "📝",
    color: "text-blue-600",
    bg: isDark ? "bg-blue-900/20" : "bg-blue-50",
    border: isDark ? "border-blue-700" : "border-blue-200",
    href: "/dashboard/activities/log"
  },
  {
    id: 'view-challenges',
    title: t('dashboard.quick_actions.view_challenges'),
    icon: "🎯",
    color: "text-purple-600",
    bg: isDark ? "bg-purple-900/20" : "bg-purple-50",
    border: isDark ? "border-purple-700" : "border-purple-200",
    href: "/dashboard/challenges"
  },
];

const getTodayHabits = () => [
  { id: 'water', name: "Beber 8 vasos de agua", completed: true, icon: "💧" },
  { id: 'exercise', name: "Ejercicio 30 min", completed: true, icon: "🏃‍♂️" },
  { id: 'meditation', name: "Meditación 10 min", completed: false, icon: "🧘‍♀️" },
  { id: 'reading', name: "Leer 20 páginas", completed: false, icon: "📖" },
];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem('theme') || 'light';
    const lang = localStorage.getItem('vivesano_lang') || localStorage.getItem('i18nextLng') || 'es';
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    html.setAttribute('lang', lang);
    
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  const isDark = resolvedTheme === 'dark';
  const stats = getDashboardStats(t, isDark);
  const quickActions = getQuickActions(t, isDark);
  const todayHabits = getTodayHabits();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardHeader t={t} />
      <StatsGrid stats={stats} />
      <QuickActionsSection t={t} actions={quickActions} />
      <RecentProgressSection isDark={isDark} habits={todayHabits} />
    </div>
  );
}

// Componente de carga
const LoadingSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-200 rounded-lg h-24"></div>
        <div className="bg-gray-200 rounded-lg h-24"></div>
        <div className="bg-gray-200 rounded-lg h-24"></div>
        <div className="bg-gray-200 rounded-lg h-24"></div>
      </div>
    </div>
  </div>
);

// Componente del header
const DashboardHeader = ({ t }: { t: any }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      {t('dashboard.overview.title')}
    </h1>
    <p className="text-gray-600 dark:text-gray-400">
      {t('dashboard.overview.subtitle')}
    </p>
  </div>
);

// Componente de estadísticas
const StatsGrid = ({ stats }: { stats: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat) => (
      <StatCard key={stat.id} stat={stat} />
    ))}
  </div>
);

// Componente para tarjeta de estadística individual
const StatCard = ({ stat }: { stat: any }) => (
  <div
    className={`
      ${stat.bg} ${stat.border} border rounded-xl p-6 
      transition-all duration-200 hover:shadow-lg hover:scale-105
    `}
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-2xl">{stat.icon}</span>
      <div className={`text-2xl font-bold ${stat.color}`}>
        {stat.value}
        {stat.total && <span className="text-sm text-gray-500 dark:text-gray-400">/{stat.total}</span>}
        {stat.unit && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{stat.unit}</span>}
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {stat.title}
    </h3>
  </div>
);

// Componente de acciones rápidas
const QuickActionsSection = ({ t, actions }: { t: any; actions: any[] }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
const RecentProgressSection = ({ isDark, habits }: { isDark: boolean; habits: any[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <HabitsCard isDark={isDark} habits={habits} />
    <WeeklyProgressCard isDark={isDark} />
  </div>
);

// Componente de hábitos
const HabitsCard = ({ isDark, habits }: { isDark: boolean; habits: any[] }) => (
  <div className={`
    ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
    border rounded-xl p-6 shadow-sm
  `}>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Hábitos de hoy
    </h3>
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} isDark={isDark} />
      ))}
    </div>
  </div>
);

// Componente de progreso semanal
const WeeklyProgressCard = ({ isDark }: { isDark: boolean }) => (
  <div className={`
    ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
    border rounded-xl p-6 shadow-sm
  `}>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Progreso semanal
    </h3>
    <div className="space-y-4">
      <ProgressBar
        label="Hábitos completados"
        percentage="75%"
        width="75%"
        color="bg-green-500"
        isDark={isDark}
      />
      <ProgressBar
        label="Retos activos"
        percentage="3/5"
        width="60%"
        color="bg-blue-500"
        isDark={isDark}
      />
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
    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
      <span>{label}</span>
      <span>{percentage}</span>
    </div>
    <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
      <div className={`${color} h-2 rounded-full`} style={{ width }}></div>
    </div>
  </div>
);

// Componente para elementos de hábito
const HabitItem = ({ habit, isDark }: { habit: any; isDark: boolean }) => {
  const getCheckboxClasses = () => {
    if (habit.completed) return 'bg-green-500 border-green-500';
    return isDark ? 'border-gray-600' : 'border-gray-300';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`
        w-4 h-4 rounded-full border-2 flex items-center justify-center
        ${getCheckboxClasses()}
      `}>
        {habit.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="text-xl">{habit.icon}</span>
      <span className={`flex-1 ${habit.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
        {habit.name}
      </span>
    </div>
  );
};
