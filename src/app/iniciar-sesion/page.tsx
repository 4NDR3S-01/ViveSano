"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { supabase } from "../../supabaseClient";
import '../../i18n';

// Helper functions extracted outside the component to reduce complexity
function getSupabaseErrorMessage(error: any, t: any) {
  if (!error) return "";
  switch (error.message) {
    case 'Invalid login credentials':
      return t('auth.error.invalidCredentials');
    case 'User not found':
      return t('auth.error.userNotFound');
    case 'Too many requests':
      return t('auth.error.tooManyAttempts');
    case 'Network request failed':
      return t('auth.error.networkError');
    default:
      return t('auth.error.invalid');
  }
}

function validateEmailField(email: string, t: any) {
  if (!email.trim()) {
    return t('auth.error.emailRequired');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return t('auth.error.emailInvalid');
  }
  return "";
}

function validatePasswordField(password: string, t: any) {
  if (!password.trim()) {
    return t('auth.error.passwordRequired');
  }
  if (password.length < 6) {
    return t('auth.error.passwordTooShort');
  }
  return "";
}

async function verifySessionAfterLogin(setLoading: any, setErrors: any) {
  try {
    const { data: sessionCheck, error: sessionError } = await supabase.auth.getSession();
    console.log('Login - Verificación de sesión después del login:', {
      hasSession: !!sessionCheck?.session,
      hasUser: !!sessionCheck?.session?.user,
      userEmail: sessionCheck?.session?.user?.email,
      sessionError: sessionError
    });

    if (sessionCheck?.session) {
      console.log('Login - Sesión confirmada, redirigiendo al dashboard...');
      setLoading(false);
      window.location.href = '/dashboard';
    } else {
      console.error('Login - Sesión no persistió correctamente');
      setLoading(false);
      setErrors({ email: "", password: "", general: "Error de sesión. Intenta de nuevo." });
    }
  } catch (error) {
    console.error('Login - Error verificando sesión:', error);
    setLoading(false);
    setErrors({ email: "", password: "", general: "Error de sesión. Intenta de nuevo." });
  }
}

async function submitLogin({
  email,
  password,
  t,
  setErrors,
  setLoading,
  setAnnounceMessage,
  setAttemptCount,
  attemptCount,
  setIsBlocked,
  setBlockTimeLeft,
  submitButtonRef,
  validateFieldsAndHandleFocus,
  isBlocked,
  blockTimeLeft,
}: any) {
  if (isBlocked) {
    setAnnounceMessage(t('auth.error.blocked', { time: blockTimeLeft }));
    setLoading(false);
    return;
  }
  setErrors({ email: "", password: "", general: "" });
  setLoading(true);
  if (!validateFieldsAndHandleFocus()) {
    setLoading(false);
    return;
  }
  const newAttemptCount = attemptCount + 1;
  setAttemptCount(newAttemptCount);
  setAnnounceMessage(t('auth.loginAttempt', { count: newAttemptCount }));

  console.log('Intentando login con:', email); // Debug

  try {
    console.log('Login - Datos recibidos:', { email: email.trim() });

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    console.log('Login - Respuesta de Supabase:', {
      hasData: !!data,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      userEmail: data?.user?.email,
      sessionId: data?.session?.access_token?.slice(0, 20) + '...',
      error: supabaseError
    });

    if (supabaseError) {
      console.log('Login - Error de Supabase:', supabaseError);
      setLoading(false);
      const errorMessage = getSupabaseErrorMessage(supabaseError, t);
      setErrors({ email: "", password: "", general: errorMessage });
      setAnnounceMessage(errorMessage);
      if (newAttemptCount >= 3) {
        setIsBlocked(true);
        setBlockTimeLeft(30);
        setAnnounceMessage(t('auth.error.blocked', { time: 30 }));
      }
      if (submitButtonRef.current) {
        submitButtonRef.current.focus();
      }
      return;
    }

    if (data?.session && data?.user) {
      // Login exitoso con sesión válida
      setErrors({ email: "", password: "", general: "" });
      setAttemptCount(0);
      setAnnounceMessage("¡Inicio de sesión exitoso!");

      console.log('Login exitoso - sesión creada para:', data.user.email);

      // Pequeña pausa para asegurar que las cookies se establezcan
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificar que la sesión esté realmente guardada
      await verifySessionAfterLogin(setLoading, setErrors);
      return;
    }

    // Si no hay error pero tampoco sesión válida
    console.error('Login aparentemente exitoso pero sin sesión válida');
    setLoading(false);
    setErrors({ email: "", password: "", general: "Error de autenticación. Intenta de nuevo." });

  } catch (unknownError) {
    setLoading(false);
    console.error('Login error:', unknownError);
    const errorMessage = t('auth.error.networkError');
    setErrors({ email: "", password: "", general: errorMessage });
    setAnnounceMessage(errorMessage);
    if (submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  }
}

function EmailField({
  email,
  emailInputRef,
  handleEmailChange,
  handleKeyDown,
  validateEmailField,
  t,
  setErrors,
  setAnnounceMessage,
  errors,
  fieldValidation,
  getValidationClasses,
}: any) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="email"
          ref={emailInputRef}
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'nextField')}
          onBlur={() => {
            const error = validateEmailField(email, t);
            setErrors((prev: any) => ({ ...prev, email: error }));
            if (error) setAnnounceMessage(error);
          }}
          placeholder={t('auth.email', { defaultValue: 'Correo electrónico' })}
          className={`w-full pl-12 pr-12 py-4 text-lg rounded-xl border-2 transition-all duration-300 shadow-lg focus:shadow-xl focus:outline-none ${getValidationClasses('email')}`}
          aria-label={t('auth.email', { defaultValue: 'Correo electrónico' })}
          aria-invalid={!!errors.email}
          aria-describedby={`email-help ${errors.email ? "email-error" : ""} ${fieldValidation.email.isValid && fieldValidation.email.isTouched ? "email-success" : ""}`.trim()}
          autoComplete="email"
          required
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-xl text-gray-500 dark:text-gray-400" aria-hidden="true">📧</span>
        </div>
        {fieldValidation.email.isTouched && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`text-lg font-bold ${
                fieldValidation.email.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
              aria-hidden="true"
            >
              {fieldValidation.email.isValid ? '✅' : '❌'}
            </span>
          </div>
        )}
      </div>
      <div className="px-2">
        <p id="email-help" className="text-xs text-gray-500 dark:text-gray-400">
          💡 {t('auth.emailHelp', { defaultValue: 'Ingresa un email válido, ej: usuario@email.com' })}
        </p>
      </div>
      <div className="px-2">
        {errors.email && (
          <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm animate-pulse bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">
            <span className="text-base mt-0.5 flex-shrink-0" aria-label="Error">⚠️</span>
            <p id="email-error" role="alert" aria-live="polite">{errors.email}</p>
          </div>
        )}
        {fieldValidation.email.isValid && fieldValidation.email.isTouched && !errors.email && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-200 dark:border-green-800">
            <span className="text-base flex-shrink-0" aria-label="Válido">✅</span>
            <p id="email-success" aria-live="polite">{t('auth.fieldValid', { defaultValue: 'Válido' })}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordField({
  password,
  passwordInputRef,
  handlePasswordChange,
  handleKeyDown,
  validatePasswordField,
  t,
  setErrors,
  setAnnounceMessage,
  errors,
  fieldValidation,
  getValidationClasses,
  showPassword,
  togglePasswordVisibility,
}: any) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          ref={passwordInputRef}
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'submit')}
          onBlur={() => {
            const error = validatePasswordField(password, t);
            setErrors((prev: any) => ({ ...prev, password: error }));
            if (error) setAnnounceMessage(error);
          }}
          placeholder={t('auth.password', { defaultValue: 'Contraseña' })}
          className={`w-full pl-12 pr-20 py-4 text-lg rounded-xl border-2 transition-all duration-300 shadow-lg focus:shadow-xl focus:outline-none ${getValidationClasses('password')}`}
          aria-label={t('auth.password', { defaultValue: 'Contraseña' })}
          aria-invalid={!!errors.password}
          aria-describedby={`password-help ${errors.password ? "password-error" : ""} ${fieldValidation.password.isValid && fieldValidation.password.isTouched ? "password-success" : ""}`.trim()}
          autoComplete="current-password"
          required
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-xl text-gray-500 dark:text-gray-400" aria-hidden="true">🔒</span>
        </div>
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600 dark:focus:text-blue-400 transition-all duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            tabIndex={0}
          >
            <span className="text-lg" aria-hidden="true">
              {showPassword ? '🙈' : '👁️'}
            </span>
          </button>
        </div>
        {fieldValidation.password.isTouched && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`text-lg font-bold ${
                fieldValidation.password.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
              aria-hidden="true"
            >
              {fieldValidation.password.isValid ? '✅' : '❌'}
            </span>
          </div>
        )}
      </div>
      <div className="px-2">
        <p id="password-help" className="text-xs text-gray-500 dark:text-gray-400">
          🔑 {t('auth.passwordHelp', { defaultValue: 'Ingresa tu contraseña (mínimo 6 caracteres)' })}
        </p>
      </div>
      <div className="px-2">
        {errors.password && (
          <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm animate-pulse bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">
            <span className="text-base mt-0.5 flex-shrink-0" aria-label="Error">⚠️</span>
            <p id="password-error" role="alert" aria-live="polite">{errors.password}</p>
          </div>
        )}
        {fieldValidation.password.isValid && fieldValidation.password.isTouched && !errors.password && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-200 dark:border-green-800">
            <span className="text-base flex-shrink-0" aria-label="Válido">✅</span>
            <p id="password-success" aria-live="polite">{t('auth.fieldValid', { defaultValue: 'Válido' })}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IniciarSesion() {
  // Forzar la clase dark y el idioma en <html> según preferencia del usuario
  const { t, i18n } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [loading, setLoading] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({ 
    email: { isValid: false, isTouched: false }, 
    password: { isValid: false, isTouched: false } 
  });
  
  // Referencias para gestión del foco
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Hook para manejar el montaje del componente
  useEffect(() => setMounted(true), []);

  // Verificación automática de sesión existente para usuarios ya logueados
  useEffect(() => {
    const checkExistingSession = async () => {
      if (!mounted || loading) return;
      
      console.log('Verificando sesión existente en página de login...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Sesión existente en login:', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          userEmail: session?.user?.email 
        });
        
        if (session?.user && !error) {
          console.log('Usuario ya logueado, redirigiendo al dashboard...');
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Error verificando sesión existente:', error);
      }
    };

    if (mounted) {
      const timeoutId = setTimeout(checkExistingSession, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [mounted, loading]);

  // Anunciar mensajes para lectores de pantalla
  useEffect(() => {
    if (announceMessage) {
      const timer = setTimeout(() => setAnnounceMessage(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [announceMessage]);

  // Foco automático en el campo de email al cargar
  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  // Manejo del bloqueo temporal por intentos fallidos
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && blockTimeLeft > 0) {
      timer = setTimeout(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAnnounceMessage(t('auth.unblocked', { defaultValue: 'Ya puedes intentar iniciar sesión nuevamente.' }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isBlocked, blockTimeLeft, t]);

  // Effect para manejar configuración inicial
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    const lang = localStorage.getItem('vivesano_lang') || localStorage.getItem('i18nextLng') || 'es';
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.setAttribute('lang', lang);
    // Actualiza el idioma en i18next si es diferente
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  // Effect para forzar re-renderización cuando cambia el tema
  useEffect(() => {
    if (mounted && resolvedTheme) {
      setFieldValidation(prev => ({ ...prev }));
    }
  }, [resolvedTheme, mounted]);

  // Helper for email change
  function handleEmailChangeHelper(
    value: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setFieldValidation: React.Dispatch<React.SetStateAction<any>>,
    setErrors: React.Dispatch<React.SetStateAction<any>>,
    setAnnounceMessage: React.Dispatch<React.SetStateAction<string>>,
    t: any,
    errors: any
  ) {
    setEmail(value);
    const emailError = validateEmailField(value, t);
    const isValid = !emailError;
    setFieldValidation((prev: any) => ({ ...prev, email: { isValid, isTouched: true } }));
    if (errors.email || value.trim()) {
      setErrors((prev: any) => ({ ...prev, email: emailError, general: "" }));
    }
    if (value.trim()) {
      setAnnounceMessage(isValid ? t('auth.fieldValid', { defaultValue: 'Válido' }) : emailError);
    }
  }
  
  // Helper for password change
  function handlePasswordChangeHelper(
    value: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    setFieldValidation: React.Dispatch<React.SetStateAction<any>>,
    setErrors: React.Dispatch<React.SetStateAction<any>>,
    setAnnounceMessage: React.Dispatch<React.SetStateAction<string>>,
    t: any,
    errors: any
  ) {
    setPassword(value);
    const passwordError = validatePasswordField(value, t);
    const isValid = !passwordError;
    setFieldValidation((prev: any) => ({ ...prev, password: { isValid, isTouched: true } }));
    if (errors.password || value.trim()) {
      setErrors((prev: any) => ({ ...prev, password: passwordError, general: "" }));
    }
    if (value.trim()) {
      setAnnounceMessage(isValid ? t('auth.fieldValid', { defaultValue: 'Válido' }) : passwordError);
    }
  }
  
  // Validación en tiempo real para email
  const handleEmailChange = (value: string) => {
    handleEmailChangeHelper(value, setEmail, setFieldValidation, setErrors, setAnnounceMessage, t, errors);
  };
  
  // Validación en tiempo real para password
  const handlePasswordChange = (value: string) => {
    handlePasswordChangeHelper(value, setPassword, setFieldValidation, setErrors, setAnnounceMessage, t, errors);
  };

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(prev => {
      const newState = !prev;
      setAnnounceMessage(newState ? t('auth.showPassword') : t('auth.hidePassword'));
      return newState;
    });
  };

  // Función para manejar navegación por teclado
  const handleKeyDown = (e: React.KeyboardEvent, action: 'nextField' | 'submit') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'nextField' && passwordInputRef.current) {
        passwordInputRef.current.focus();
      } else if (action === 'submit' && submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  // Función para obtener clases de validación
  const getValidationClasses = (field: 'email' | 'password') => {
    if (!mounted) return 'border-gray-300 bg-white text-gray-900 placeholder-gray-500';
    const validation = fieldValidation[field];
    const isDark = resolvedTheme === 'dark';
    if (!validation.isTouched) {
      return isDark 
        ? 'border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400'
        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:ring-purple-600';
    }
    let resultClass = '';
    if (validation.isValid) {
      resultClass = isDark
        ? 'border-green-400 bg-green-900/20 text-gray-100 focus:border-green-300 focus:ring-green-400'
        : 'border-green-500 bg-green-50 text-gray-900 focus:border-green-600 focus:ring-green-500';
    } else {
      resultClass = isDark
        ? 'border-red-400 bg-red-900/20 text-gray-100 focus:border-red-300 focus:ring-red-400'
        : 'border-red-500 bg-red-50 text-gray-900 focus:border-red-600 focus:ring-red-500';
    }
    return resultClass;
  };

  // Funciones auxiliares para el botón de envío
  const getButtonAriaLabel = () => {
    if (loading) return t('auth.loading', { defaultValue: 'Ingresando...' });
    if (isBlocked) return `Bloqueado por ${blockTimeLeft} segundos`;
    return t('auth.login', { defaultValue: 'Ingresar' });
  };

  const getButtonText = () => {
    if (loading) return t('auth.loading', { defaultValue: 'Ingresando...' });
    if (isBlocked) return `Bloqueado (${blockTimeLeft}s)`;
    return t('auth.login', { defaultValue: 'Ingresar' });
  };

  // Helper to handle validation and focus
  const validateFieldsAndHandleFocus = () => {
    const emailError = validateEmailField(email, t);
    const passwordError = validatePasswordField(password, t);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError, general: "" });
      setAnnounceMessage(t('auth.error.required'));
      setLoading(false);
      if (emailError && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (passwordError && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLogin({
      email,
      password,
      t,
      setErrors,
      setLoading,
      setAnnounceMessage,
      setAttemptCount,
      attemptCount,
      setIsBlocked,
      setBlockTimeLeft,
      submitButtonRef,
      validateFieldsAndHandleFocus,
      isBlocked,
      blockTimeLeft,
    });
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-main px-4 py-12">
      <section className="card w-full max-w-lg mx-auto text-center shadow-2xl animate-fade-in backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border-2 border-primary/50 rounded-3xl p-12 transition-all duration-300 flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-8 tracking-tight drop-shadow-lg animate-fade-in">
          {t('auth.title', { defaultValue: 'Iniciar sesión' })}
        </h1>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <EmailField
            email={email}
            emailInputRef={emailInputRef}
            handleEmailChange={handleEmailChange}
            handleKeyDown={handleKeyDown}
            validateEmailField={validateEmailField}
            t={t}
            setErrors={setErrors}
            setAnnounceMessage={setAnnounceMessage}
            errors={errors}
            fieldValidation={fieldValidation}
            getValidationClasses={getValidationClasses}
          />
          <PasswordField
            password={password}
            passwordInputRef={passwordInputRef}
            handlePasswordChange={handlePasswordChange}
            handleKeyDown={handleKeyDown}
            validatePasswordField={validatePasswordField}
            t={t}
            setErrors={setErrors}
            setAnnounceMessage={setAnnounceMessage}
            errors={errors}
            fieldValidation={fieldValidation}
            getValidationClasses={getValidationClasses}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
          
          {/* Alertas del sistema */}
          <div className="space-y-3">
            {/* Alerta de bloqueo */}
            {isBlocked && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-2xl" aria-label="Bloqueado">🚫</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-800 dark:text-red-200 text-lg mb-2">ACCESO BLOQUEADO</h3>
                    <p className="text-red-700 dark:text-red-300 mb-3">{t('auth.error.blocked', { time: blockTimeLeft })}</p>
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg" aria-label="Reloj">⏱️</span>
                        <span className="text-red-800 dark:text-red-200 font-medium">Tiempo restante:</span>
                        <span className="text-red-900 dark:text-red-100 font-mono text-xl font-bold">{blockTimeLeft}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contador de intentos */}
            {attemptCount > 0 && !isBlocked && (
              <div className={`rounded-xl p-4 border-2 ${
                attemptCount >= 2 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-xl">
                      {attemptCount >= 2 ? '⚠️' : 'ℹ️'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Intento {attemptCount} de 3</span>
                      {attemptCount >= 2 && (
                        <span className="px-2 py-1 bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-200 rounded-full text-xs font-medium">
                          ¡ÚLTIMO INTENTO!
                        </span>
                      )}
                    </div>
                    {attemptCount >= 2 && (
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-base mt-0.5">🚨</span>
                        <p>Un intento más y serás bloqueado temporalmente</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-xl" aria-label="Error">❌</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">Error de Autenticación</h3>
                    <p id="general-error" className="text-red-700 dark:text-red-300" role="alert" aria-live="polite">
                      {errors.general}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <div className="mt-6">
            <button
              ref={submitButtonRef}
              type="submit"
              className={`w-full py-4 px-8 text-lg font-bold rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                loading || isBlocked 
                  ? 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 border-blue-600 dark:border-blue-500 text-white hover:scale-105'
              }`}
              disabled={loading || isBlocked}
              aria-describedby={`${errors.general ? "general-error" : ""} ${isBlocked ? "blocked-message" : ""} button-help`.trim()}
              aria-label={getButtonAriaLabel()}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl">
                  {loading && '⏳'}
                  {isBlocked && '🚫'}
                  {!loading && !isBlocked && '🚀'}
                </span>
                <span className="font-semibold">{getButtonText()}</span>
              </div>
            </button>
            
            {/* Texto de ayuda para navegación */}
            <div className="text-center mt-3">
              <p id="button-help" className="text-xs text-gray-500 dark:text-gray-400">
                💡 {t('auth.accessibilityInstructions', { defaultValue: 'Instrucciones de accesibilidad: ' })}
                </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('auth.accessibilityInstructions1', { defaultValue: 'Usa Tab para navegar entre campos.' })}
                <br />
                {t('auth.accessibilityInstructions2', { defaultValue: 'Presiona Shift + Tab para retroceder.' })}
                <br />
                {t('auth.accessibilityInstructions3', { defaultValue: 'Presiona Enter para enviar el formulario.' })}
                <br />
              </p>
            </div>
          </div>
        </form>

        {/* Enlaces adicionales */}
        <div className="mt-8 flex flex-col gap-4 items-center text-base">
          <a href="/olvido-contrasena" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:underline font-semibold transition-colors">
            🔐 {t('auth.forgot', { defaultValue: '¿Olvidaste tu contraseña?' })}
          </a>
          <a href="/registrarse" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 hover:underline font-semibold transition-colors">
            ✨ {t('auth.register', { defaultValue: '¿No tienes cuenta? Regístrate aquí.' })}
          </a>
        </div>

        {/* Región para anuncios de lectores de pantalla */}
        <output
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {announceMessage}
        </output>
      </section>
    </main>
  );
}
