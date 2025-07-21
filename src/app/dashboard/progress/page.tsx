"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "../../../hooks/useThemeForce";
import { useDashboard } from "../../../hooks/useDashboard";
import '../../../i18n';

// Componente de carga
const LoadingSkeleton = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded mb-2 w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded mb-8 w-1/2"></div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-200 rounded-xl h-24"></div>
        ))}
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-200 rounded-xl h-64"></div>
        <div className="bg-slate-200 rounded-xl h-64"></div>
      </div>
    </div>
  </div>
);

// Componente de estadística
const StatCard = ({ stat, isDark }: { stat: any; isDark: boolean }) => (
  <div
    className="border rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg"
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0',
      color: isDark ? '#f1f5f9' : '#1e293b'
    }}
  >
    <div className="text-3xl mb-2">{stat.icon}</div>
    <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
      {stat.value}
      {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
    </div>
    <h3 className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
      {stat.title}
    </h3>
  </div>
);

// Componente de gráfico simple (mockup)
const SimpleChart = ({ title, data, isDark, type = 'bar' }: { 
  title: string; 
  data: any[]; 
  isDark: boolean;
  type?: 'bar' | 'line';
}) => (
  <div
    className="border rounded-xl p-6"
    style={{
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#475569' : '#e2e8f0',
      color: isDark ? '#f1f5f9' : '#1e293b'
    }}
  >
    <h3 className="text-lg font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
      {title}
    </h3>
    <div className="h-48 flex items-end justify-between gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="bg-violet-500 rounded-t min-h-4 w-full mb-2 transition-all duration-300 hover:bg-violet-600"
            style={{ height: `${item.value}%` }}
          />
          <span className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Componente de actividad reciente
const RecentActivity = ({ isDark, t }: { isDark: boolean; t: any }) => {
  const activities = [
    {
      id: '1',
      action: 'Completó hábito "Beber agua"',
      time: 'Hace 2 horas',
      icon: '💧',
      points: '+10'
    },
    {
      id: '2',
      action: 'Completó hábito "Meditación"',
      time: 'Hace 5 horas',
      icon: '🧘',
      points: '+25'
    },
    {
      id: '3',
      action: 'Unido al desafío "7 días de ejercicio"',
      time: 'Ayer',
      icon: '🏃',
      points: '+50'
    }
  ];

  return (
    <div
      className="border rounded-xl p-6"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderColor: isDark ? '#475569' : '#e2e8f0',
        color: isDark ? '#f1f5f9' : '#1e293b'
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
        Actividad Reciente
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 py-2">
            <span className="text-2xl">{activity.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {activity.time}
              </p>
            </div>
            <span className="text-sm font-medium text-green-600">
              {activity.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProgressPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [mounted, setMounted] = useState(false);
  
  // Usar datos reales del dashboard
  const { 
    isLoading, 
    error, 
    getFormattedStats
  } = useDashboard();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Obtener estadísticas reales
  const stats = getFormattedStats(t) || [];

  // Datos de ejemplo para los gráficos
  const weeklyData = [
    { label: 'Lun', value: 80 },
    { label: 'Mar', value: 65 },
    { label: 'Mié', value: 90 },
    { label: 'Jue', value: 75 },
    { label: 'Vie', value: 95 },
    { label: 'Sáb', value: 70 },
    { label: 'Dom', value: 85 }
  ];

  const monthlyData = [
    { label: 'S1', value: 60 },
    { label: 'S2', value: 75 },
    { label: 'S3', value: 85 },
    { label: 'S4', value: 70 }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header de la página */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('progress.title', { defaultValue: 'Mi Progreso' })}
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t('progress.subtitle', { defaultValue: 'Visualiza tu evolución y logros a lo largo del tiempo' })}
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} isDark={isDark} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SimpleChart 
          title={t('progress.weekly', { defaultValue: 'Esta Semana' })}
          data={weeklyData}
          isDark={isDark}
          type="bar"
        />
        <SimpleChart 
          title={t('progress.monthly', { defaultValue: 'Este Mes' })}
          data={monthlyData}
          isDark={isDark}
          type="bar"
        />
      </div>

      {/* Actividad reciente */}
      <RecentActivity isDark={isDark} t={t} />
    </div>
  );
}
