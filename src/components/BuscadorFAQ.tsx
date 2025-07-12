import { useState } from "react";
import { useTranslation } from "react-i18next";

interface BuscadorFAQProps {
  readonly className?: string;
  readonly onSelect?: (faq: { q: string; a: string }) => void;
}

export default function BuscadorFAQ({ className = "", onSelect }: BuscadorFAQProps) {
  const { t } = useTranslation();
  const faqs = t('help.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(query.toLowerCase()) || faq.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setShowResults(true); }}
        placeholder={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
        className="input rounded-lg border border-border px-3 py-2 w-full bg-card/80 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        aria-label={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
        onBlur={() => setTimeout(() => setShowResults(false), 150)}
        onFocus={() => query && setShowResults(true)}
      />
      {showResults && query && (
        <div className="absolute left-0 right-0 mt-2 bg-white/95 dark:bg-gray-900/95 border-2 border-primary rounded-xl shadow-xl z-50 max-h-64 overflow-auto backdrop-blur-md">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <button
                key={faq.q}
                className="w-full text-left px-4 py-2 hover:bg-primary/10 focus:bg-primary/20 focus:outline-none text-sm text-foreground rounded-lg transition-colors duration-150"
                onMouseDown={() => window.location.href = `/ayuda?pregunta=${encodeURIComponent(faq.q)}`}
                aria-label={faq.q}
              >
                <span className="font-bold text-primary">{faq.q}</span>
              </button>
            ))
          ) : (
            <div className="text-muted-foreground text-center py-4">
              {t('help.faq.noResults', { defaultValue: 'No se encontraron preguntas relacionadas.' })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
