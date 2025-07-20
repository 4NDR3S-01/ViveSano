import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";

interface BuscadorFAQProps {
  readonly className?: string;
  readonly onSelect?: (faq: { q: string; a: string }) => void;
}

export default function BuscadorFAQ({ className = "", onSelect }: BuscadorFAQProps) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const faqs = t('help.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(query.toLowerCase()) || faq.a.toLowerCase().includes(query.toLowerCase())
  );

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setShowResults(true); }}
        placeholder={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
        className={`input rounded-lg border px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-purple-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
        }`}
        aria-label={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
        onBlur={() => setTimeout(() => setShowResults(false), 150)}
        onFocus={() => query && setShowResults(true)}
      />
      {showResults && query && (
        <div className={`absolute left-0 right-0 mt-2 border-2 rounded-xl shadow-xl z-50 max-h-64 overflow-auto backdrop-blur-md transition-all duration-200 ${
          isDark 
            ? 'bg-gray-900/95 border-purple-400' 
            : 'bg-white/95 border-purple-500'
        }`}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <button
                key={faq.q}
                className={`w-full text-left px-4 py-2 focus:outline-none text-sm rounded-lg transition-colors duration-150 ${
                  isDark 
                    ? 'text-gray-100 hover:bg-purple-900/30 focus:bg-purple-800/40' 
                    : 'text-gray-900 hover:bg-purple-100/50 focus:bg-purple-200/70'
                }`}
                onMouseDown={() => window.location.href = `/ayuda?pregunta=${encodeURIComponent(faq.q)}`}
                aria-label={faq.q}
              >
                <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{faq.q}</span>
              </button>
            ))
          ) : (
            <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('help.faq.noResults', { defaultValue: 'No se encontraron preguntas relacionadas.' })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
