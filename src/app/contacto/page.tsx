"use client";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import '../../i18n';

export default function Contacto() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", message: "", general: "" });
  const [announceMessage, setAnnounceMessage] = useState("");
  
  // Referencias para gestión del foco
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Anunciar mensajes para lectores de pantalla
  useEffect(() => {
    if (announceMessage) {
      const timer = setTimeout(() => setAnnounceMessage(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [announceMessage]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", message: "", general: "" };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = t('contact.form.error');
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = t('contact.form.errorName');
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = t('contact.form.error');
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = t('contact.form.errorEmail');
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = t('contact.form.error');
      isValid = false;
    } else if (form.message.trim().length < 10) {
      newErrors.message = t('contact.form.errorMessage');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: "", email: "", message: "", general: "" });
    setSuccess(false);

    if (!validateForm()) {
      // Anunciar errores y enfocar el primer campo con error
      setAnnounceMessage(t('contact.form.error'));
      if (errors.name && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (errors.email && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (errors.message && messageInputRef.current) {
        messageInputRef.current.focus();
      }
      return;
    }

    setLoading(true);
    setAnnounceMessage(t('contact.form.sending'));
    
    const { error } = await supabase.from('contact_messages').insert([
      { 
        name: form.name.trim(), 
        email: form.email.trim(), 
        message: form.message.trim() 
      }
    ]);
    setLoading(false);

    if (error) {
      setErrors({ ...errors, general: t('contact.form.errorServer') });
      setAnnounceMessage(t('contact.form.errorServer'));
      // Mantener el foco en el botón para que el usuario sepa el resultado
      if (submitButtonRef.current) {
        submitButtonRef.current.focus();
      }
    } else {
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
      setAnnounceMessage(t('contact.form.success'));
      // Enfocar el primer campo después del éxito para reiniciar el flujo
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center fade-in bg-gradient-main px-2">
      {/* Live region para anuncios de accesibilidad */}
      <output 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {announceMessage}
      </output>

      <div className="w-full flex flex-col items-center justify-center">
        <header className="card w-full max-w-2xl mx-auto text-center mb-8 shadow-primary animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight drop-shadow-lg animate-fade-in">
            {t('contact.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in">
            {t('contact.description')}
          </p>
        </header>

        <section className="w-full max-w-xl mx-auto mb-12 animate-fade-in" aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">{t('contact.form.formTitle')}</h2>
          <p className="sr-only">{t('contact.form.formDescription')}</p>
          
          <form 
            className="card p-6 flex flex-col gap-4 border border-border shadow-primary" 
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="required-fields-note"
          >
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Información personal</legend>
              <label htmlFor="name" className="text-sm font-medium text-primary">
                {t('contact.form.name')} <span className="text-red-500" aria-label={t('contact.form.requiredField')}>*</span>
              </label>
              <input 
                ref={nameInputRef}
                id="name" 
                name="name" 
                type="text" 
                value={form.name} 
                onChange={handleChange} 
                placeholder={t('contact.form.namePlaceholder')} 
                className={`input rounded-lg border px-3 py-2 bg-card/80 text-card-foreground focus:outline-none focus:ring-2 transition-colors ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'
                }`}
                required
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={`name-help ${errors.name ? 'name-error' : ''}`.trim()}
                autoComplete="name"
              />
              {errors.name && (
                <p id="name-error" className="text-red-500 text-xs mt-1" role="alert" aria-live="polite">
                  {errors.name}
                </p>
              )}
              <p id="name-help" className="text-xs text-muted-foreground">{t('contact.form.nameHelp')}</p>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Información de contacto</legend>
              <label htmlFor="email" className="text-sm font-medium text-primary">
                {t('contact.form.email')} <span className="text-red-500" aria-label={t('contact.form.requiredField')}>*</span>
              </label>
              <input 
                ref={emailInputRef}
                id="email" 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder={t('contact.form.emailPlaceholder')} 
                className={`input rounded-lg border px-3 py-2 bg-card/80 text-card-foreground focus:outline-none focus:ring-2 transition-colors ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'
                }`}
                required
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={`email-help ${errors.email ? 'email-error' : ''}`.trim()}
                autoComplete="email"
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1" role="alert" aria-live="polite">
                  {errors.email}
                </p>
              )}
              <p id="email-help" className="text-xs text-muted-foreground">{t('contact.form.emailHelp')}</p>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Mensaje</legend>
              <label htmlFor="message" className="text-sm font-medium text-primary">
                {t('contact.form.message')} <span className="text-red-500" aria-label={t('contact.form.requiredField')}>*</span>
              </label>
              <textarea 
                ref={messageInputRef}
                id="message" 
                name="message" 
                rows={5} 
                value={form.message} 
                onChange={handleChange} 
                placeholder={t('contact.form.messagePlaceholder')} 
                className={`input rounded-lg border px-3 py-2 bg-card/80 text-card-foreground focus:outline-none focus:ring-2 transition-colors resize-none ${
                  errors.message ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary'
                }`}
                required
                aria-required="true"
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={`message-help ${errors.message ? 'message-error' : ''}`.trim()}
                minLength={10}
              />
              {errors.message && (
                <p id="message-error" className="text-red-500 text-xs mt-1" role="alert" aria-live="polite">
                  {errors.message}
                </p>
              )}
              <p id="message-help" className="text-xs text-muted-foreground">{t('contact.form.messageHelp')}</p>
            </fieldset>

            {errors.general && (
              <div 
                className="bg-red-50 border border-red-200 rounded-lg p-3" 
                role="alert" 
                aria-live="assertive"
              >
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {success && (
              <div 
                className="bg-green-50 border border-green-200 rounded-lg p-3" 
                role="alert" 
                aria-live="polite"
              >
                <p className="text-green-700 text-sm font-medium mb-1">{t('contact.form.success')}</p>
                <p className="text-green-600 text-xs">{t('contact.form.successDetails')}</p>
              </div>
            )}

            <button 
              ref={submitButtonRef}
              type="submit" 
              className="btn bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold py-3 px-6 rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
              disabled={loading}
              aria-describedby={loading ? 'button-loading' : undefined}
              aria-label={loading ? t('contact.form.loadingAria') : t('contact.form.submitAria')}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg 
                    className="animate-spin h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('contact.form.sending')}
                </span>
              ) : (
                t('contact.form.cta')
              )}
            </button>
            {loading && (
              <span id="button-loading" className="sr-only">{t('contact.form.loadingAria')}</span>
            )}

            <p id="required-fields-note" className="text-xs text-muted-foreground text-center mt-2">
              <span className="text-red-500" aria-label={t('contact.form.requiredField')}>*</span> Campos obligatorios
            </p>
          </form>
        </section>
        <aside className="w-full max-w-xl mx-auto text-center animate-fade-in mb-8" aria-labelledby="alternative-contact-title">
          <div className="card p-6 border border-border shadow-primary">
            <h3 id="alternative-contact-title" className="text-lg font-semibold text-primary mb-3 drop-shadow-lg">
              {t('contact.alt.title')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('contact.alt.description')}
            </p>
            <nav aria-label="Métodos de contacto alternativos">
              <ul className="flex flex-col gap-3 items-center list-none">
                <li>
                  <a 
                    href="mailto:contacto@vivesano.com"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors p-3 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={t('contact.alt.emailAria')}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path 
                        d="M21 15V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M3 7l9 6 9-6" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t('contact.alt.email')}: contacto@vivesano.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+34600123456"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors p-3 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={t('contact.alt.phoneAria')}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path 
                        d="M22 16.92V19a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2h2.09a2 2 0 012 1.72c.13.81.39 1.6.76 2.34a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 012.11-.45c.74.37 1.53.63 2.34.76A2 2 0 0121 17.91V20a2 2 0 01-2 2z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t('contact.alt.phone')}: +34 600 123 456</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg" role="note" aria-label="Consejo útil">
              <p className="text-xs text-blue-700">
                💡 <strong>Consejo:</strong> Para consultas técnicas o reportes de errores, incluye detalles específicos en tu mensaje para poder ayudarte mejor.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
