"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import '../../i18n';
import { useThemeForce } from "@/hooks/useThemeForce";

export default function Ayuda() {
  const { t } = useTranslation();
  const { isDark } = useThemeForce();
  const [query, setQuery] = useState("");

  const faqs = [
    { q: t('help.faq.1.q', { defaultValue: '¿Cómo puedo crear una cuenta?' }), a: t('help.faq.1.a', { defaultValue: 'Puedes registrarte haciendo clic en "Registrarse" y completando el formulario con tus datos.' }) },
    { q: t('help.faq.2.q', { defaultValue: '¿Es segura mi información personal?' }), a: t('help.faq.2.a', { defaultValue: 'Sí, utilizamos encriptación de alta seguridad para proteger todos tus datos personales.' }) },
    { q: t('help.faq.3.q', { defaultValue: '¿Puedo cambiar mi plan más tarde?' }), a: t('help.faq.3.a', { defaultValue: 'Por supuesto, puedes actualizar o cambiar tu plan en cualquier momento desde tu configuración.' }) },
    { q: t('help.faq.4.q', { defaultValue: '¿Cómo funciona la gamificación?' }), a: t('help.faq.4.a', { defaultValue: 'Ganas puntos y logros completando hábitos saludables, creando una experiencia motivadora.' }) },
    { q: t('help.faq.5.q', { defaultValue: '¿Hay una aplicación móvil?' }), a: t('help.faq.5.a', { defaultValue: 'Actualmente es una aplicación web optimizada para móviles, pronto tendremos apps nativas.' }) }
  ];

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
    <main className="min-h-[80vh] flex flex-col items-center justify-center fade-in px-2 py-8">
      <div className="w-full flex flex-col items-center justify-center">
        <section className={`w-full max-w-2xl mx-auto text-center mb-8 shadow-lg animate-fade-in rounded-xl p-8 border ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg animate-fade-in ${
            isDark ? 'text-violet-400' : 'text-violet-600'
          }`}>
            {t('help.title', { defaultValue: 'Centro de Ayuda' })}
          </h1>
          <p className={`text-lg md:text-xl mb-6 animate-fade-in ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {t('help.description', { defaultValue: 'Encuentra respuestas a tus preguntas más frecuentes' })}
          </p>
        </section>

        <section className="w-full max-w-2xl mx-auto mb-12 animate-fade-in">
          <div className={`w-full rounded-xl shadow-xl p-6 flex flex-col gap-4 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 ${
                isDark 
                  ? 'border-slate-600 bg-slate-700 text-white' 
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
              aria-label={t('header.search.placeholder', { defaultValue: 'Buscar...' })}
              style={{ fontSize: '1.1rem' }}
            />
            {autoSelectedFaq && (
              <div className={`p-4 mb-2 rounded-xl animate-fade-in border ${
                isDark 
                  ? 'border-violet-700 bg-violet-900/30' 
                  : 'border-violet-200 bg-violet-50'
              }`}>
                <h3 className={`font-bold mb-2 ${
                  isDark ? 'text-violet-400' : 'text-violet-600'
                }`}>{autoSelectedFaq.q}</h3>
                <p className={`text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>{autoSelectedFaq.a}</p>
              </div>
            )}
            <ul className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <li key={faq.q} className={`p-4 rounded-xl transition-colors duration-200 cursor-pointer ${
                    isDark ? 'hover:bg-violet-900/30' : 'hover:bg-violet-50'
                  }`} aria-label={faq.q}>
                    <h3 className={`font-bold mb-2 ${
                      isDark ? 'text-violet-400' : 'text-violet-600'
                    }`}>{faq.q}</h3>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>{faq.a}</p>
                  </li>
                ))
              ) : (
                <li className={`text-center py-8 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {t('help.faq.noResults', { defaultValue: 'No se encontraron preguntas relacionadas.' })}
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="w-full max-w-2xl mx-auto text-center animate-fade-in mb-8">
          <h3 className={`text-lg font-semibold mb-2 drop-shadow-lg ${
            isDark ? 'text-violet-400' : 'text-violet-600'
          }`}>{t('help.contact.title', { defaultValue: '¿Necesitas más ayuda?' })}</h3>
          <p className={`mb-4 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>{t('help.contact.desc', { defaultValue: 'Si no encuentras lo que buscas, contáctanos directamente.' })}</p>
          <a href="/contacto" className="bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold py-2 px-6 rounded-lg shadow hover:scale-105 transition-transform">
            {t('help.contact.cta', { defaultValue: 'Contactar Soporte' })}
          </a>
        </section>
      </div>
    </main>
  );
}
