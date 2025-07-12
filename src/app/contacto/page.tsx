"use client";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import '../../i18n';

export default function Contacto() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!form.name || !form.email || !form.message) {
      setError(t('contact.form.error', { defaultValue: 'Por favor, completa todos los campos.' }));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert([
      { name: form.name, email: form.email, message: form.message }
    ]);
    setLoading(false);
    if (error) {
      setError(t('contact.form.errorServer', { defaultValue: 'Hubo un error al enviar el mensaje.' }));
    } else {
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center fade-in bg-gradient-main px-2">
      <div className="w-full flex flex-col items-center justify-center">
        <section className="card w-full max-w-2xl mx-auto text-center mb-8 shadow-primary animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight drop-shadow-lg animate-fade-in">
            {t('contact.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in">
            {t('contact.description')}
          </p>
        </section>
        <section className="w-full max-w-xl mx-auto mb-12 animate-fade-in">
          <form className="card p-6 flex flex-col gap-4 border border-border shadow-primary" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-primary">{t('contact.form.name')}</label>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder={t('contact.form.namePlaceholder')} className="input rounded-lg border border-border px-3 py-2 bg-card/80 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">{t('contact.form.email')}</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder={t('contact.form.emailPlaceholder')} className="input rounded-lg border border-border px-3 py-2 bg-card/80 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-primary">{t('contact.form.message')}</label>
              <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} placeholder={t('contact.form.messagePlaceholder')} className="input rounded-lg border border-border px-3 py-2 bg-card/80 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mb-2">{t('contact.form.success', { defaultValue: '¡Mensaje enviado correctamente!' })}</div>}
            <button type="submit" className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-2 px-6 rounded-lg shadow hover:scale-105 transition-transform" disabled={loading}>
              {loading ? t('contact.form.sending', { defaultValue: 'Enviando...' }) : t('contact.form.cta')}
            </button>
          </form>
        </section>
        <section className="w-full max-w-xl mx-auto text-center animate-fade-in mb-8">
          <h3 className="text-lg font-semibold text-primary mb-2 drop-shadow-lg">{t('contact.subtitle')}</h3>
          <div className="flex flex-col gap-2 items-center">
            <span className="flex items-center gap-2 text-muted-foreground">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 15V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>{t('contact.alt.email')}: contacto@vivesano.com</span>
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2h2.09a2 2 0 012 1.72c.13.81.39 1.6.76 2.34a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 012.11-.45c.74.37 1.53.63 2.34.76A2 2 0 0121 17.91V20a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              <span>{t('contact.alt.phone')}: +34 600 123 456</span>
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
