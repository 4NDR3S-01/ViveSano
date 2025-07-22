"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeForce } from "../../../hooks/useThemeForce";
import { useDashboard } from "../../../hooks/useDashboard";
import { useProgress } from "../../../hooks/useProgress";
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
        <div key={`${item.label}-${index}`} className="flex flex-col items-center flex-1">
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
const RecentActivity = ({ isDark, t, activities }: { 
  isDark: boolean; 
  t: any; 
  activities: any[];
}) => {
  if (activities.length === 0) {
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
          {t('progress.recent_activity', { defaultValue: 'Actividad Reciente' })}
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {t('progress.no_activity', { defaultValue: 'No hay actividad reciente' })}
          </p>
        </div>
      </div>
    );
  }

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
        {t('progress.recent_activity', { defaultValue: 'Actividad Reciente' })}
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
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
  
  // Usar datos reales del dashboard y progreso
  const { 
    isLoading: dashboardLoading, 
    getFormattedStats
  } = useDashboard();
  
  const {
    weeklyData,
    monthlyData,
    recentActivity,
    isLoading: progressLoading,
    error
  } = useProgress();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (dashboardLoading || progressLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border`}>
          <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            {t('progress.error', { defaultValue: 'Error cargando datos de progreso' })}: {error}
          </p>
        </div>
      </div>
    );
  }

  // Obtener estadísticas reales
  const stats = getFormattedStats(t) || [];

  // Usar datos reales o datos de ejemplo como fallback
  const finalWeeklyData = weeklyData.length > 0 ? weeklyData : [
    { label: 'Lun', value: 0 },
    { label: 'Mar', value: 0 },
    { label: 'Mié', value: 0 },
    { label: 'Jue', value: 0 },
    { label: 'Vie', value: 0 },
    { label: 'Sáb', value: 0 },
    { label: 'Dom', value: 0 }
  ];

  const finalMonthlyData = monthlyData.length > 0 ? monthlyData : [
    { label: 'S1', value: 0 },
    { label: 'S2', value: 0 },
    { label: 'S3', value: 0 },
    { label: 'S4', value: 0 }
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
          data={finalWeeklyData}
          isDark={isDark}
          type="bar"
        />
        <SimpleChart 
          title={t('progress.monthly', { defaultValue: 'Este Mes' })}
          data={finalMonthlyData}
          isDark={isDark}
          type="bar"
        />
      </div>

      {/* Actividad reciente */}
      <RecentActivity isDark={isDark} t={t} activities={recentActivity} />
    </div>
  );
}
