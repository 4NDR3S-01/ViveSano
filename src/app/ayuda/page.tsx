"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import '../../i18n';

export default function Ayuda() {
  const { t } = useTranslation();
  const faqs = t('help.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pregunta = params.get("pregunta");
    if (pregunta) {
      setQuery(pregunta);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(query.toLowerCase()) || faq.a.toLowerCase().includes(query.toLowerCase())
  );
  const autoSelectedFaq = filteredFaqs.length === 1 ? filteredFaqs[0] : null;

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center fade-in bg-gradient-main px-2 py-8">
      <div className="w-full flex flex-col items-center justify-center">
        <section className="card w-full max-w-2xl mx-auto text-center mb-8 shadow-primary animate-fade-in backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border border-primary/20 rounded-3xl p-8 transition-all duration-300">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight drop-shadow-lg animate-fade-in">
            {t('help.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in">
            {t('help.description')}
          </p>
        </section>
        <section className="w-full max-w-2xl mx-auto mb-12 animate-fade-in">
          <div className="card w-full bg-white/80 dark:bg-gray-900/80 border border-primary/10 rounded-2xl shadow-xl p-6 flex flex-col gap-4 transition-all duration-300">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
              className="input-solid focus:ring-2 focus:ring-primary transition-all duration-200 mb-2"
              aria-label={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
              style={{ fontSize: '1.1rem' }}
            />
            {autoSelectedFaq && (
              <div className="card p-4 border border-primary mb-2 bg-primary/10 rounded-xl animate-fade-in">
                <h3 className="font-bold text-primary mb-2">{autoSelectedFaq.q}</h3>
                <p className="text-muted-foreground text-sm">{autoSelectedFaq.a}</p>
              </div>
            )}
            <ul className="flex flex-col gap-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/60 scrollbar-track-card dark:scrollbar-thumb-primary/80 dark:scrollbar-track-card/60 transition-all duration-200">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <li key={faq.q} className="p-4 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 cursor-pointer" aria-label={faq.q}>
                    <h3 className="font-bold text-primary mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-center py-8">
                  {t('help.faq.noResults', { defaultValue: 'No se encontraron preguntas relacionadas.' })}
                </li>
              )}
            </ul>
          </div>
        </section>
        <section className="w-full max-w-2xl mx-auto text-center animate-fade-in mb-8">
          <h3 className="text-lg font-semibold text-primary mb-2 drop-shadow-lg">{t('help.contact.title')}</h3>
          <p className="text-muted-foreground mb-4">{t('help.contact.desc')}</p>
          <a href="/contacto" className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-2 px-6 rounded-lg shadow hover:scale-105 transition-transform">
            {t('help.contact.cta')}
          </a>
        </section>
      </div>
    </main>
  );
}
