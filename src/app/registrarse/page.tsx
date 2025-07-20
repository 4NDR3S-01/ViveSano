"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { supabase } from "@/supabaseClient";
import "../../i18n";

export default function Registrarse() {
  const { t, i18n } = useTranslation();
  const { resolvedTheme } = useTheme();
  
  // Estados del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    general: "" 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [announceMessage, setAnnounceMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    criteria: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      special: false
    }
  });
  const [fieldValidation, setFieldValidation] = useState({ 
    name: { touched: false, focused: false },
    email: { touched: false, focused: false },
    password: { touched: false, focused: false },
    confirmPassword: { touched: false, focused: false }
  });
  
  // Estado adicional para compatibilidad
  const [error, setError] = useState("");

  // Referencias para el manejo del foco
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Hook para manejar el montaje del componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Efectos para manejo de mensajes y foco
  useEffect(() => {
    if (announceMessage) {
      const timer = setTimeout(() => setAnnounceMessage(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [announceMessage]);

  // Foco automático en el campo de nombre al cargar
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Manejo del bloqueo temporal por intentos fallidos
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && blockTimeLeft > 0) {
      timer = setTimeout(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAnnounceMessage(t('auth.unblocked', { defaultValue: 'Ya puedes intentar registrarte nuevamente.' }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isBlocked, blockTimeLeft, t]);

  // Funciones de validación en tiempo real
  const validateName = (value: string) => {
    if (!value.trim()) {
      return t('auth.error.name_required', { defaultValue: 'El nombre es obligatorio.' });
    }
    if (value.trim().length < 2) {
      return t('auth.error.name_min_length', { defaultValue: 'El nombre debe tener al menos 2 caracteres.' });
    }
    if (value.trim().length > 50) {
      return t('auth.error.name_max_length', { defaultValue: 'El nombre no puede exceder 50 caracteres.' });
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value.trim())) {
      return t('auth.error.name_invalid_chars', { defaultValue: 'El nombre solo puede contener letras y espacios.' });
    }
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return t('auth.error.email_required', { defaultValue: 'El correo electrónico es obligatorio.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return t('auth.error.email_invalid', { defaultValue: 'Ingresa un correo electrónico válido.' });
    }
    if (value.length > 254) {
      return t('auth.error.email_too_long', { defaultValue: 'El correo electrónico es demasiado largo.' });
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return t('auth.error.password_required', { defaultValue: 'La contraseña es obligatoria.' });
    }
    if (value.length < 6) {
      return t('auth.error.password_min_length', { defaultValue: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    if (value.length > 128) {
      return t('auth.error.password_too_long', { defaultValue: 'La contraseña es demasiado larga.' });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return t('auth.error.password_weak', { defaultValue: 'La contraseña debe incluir mayúsculas, minúsculas y números.' });
    }
    return "";
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      return t('auth.error.confirm_password_required', { defaultValue: 'Confirma tu contraseña.' });
    }
    if (value !== password) {
      return t('auth.error.passwords_no_match', { defaultValue: 'Las contraseñas no coinciden.' });
    }
    return "";
  };

  // Función para evaluar la fortaleza de la contraseña
  const evaluatePasswordStrength = (value: string) => {
    const criteria = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      numbers: /\d/.test(value),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)
    };

    const metCriteria = Object.values(criteria).filter(Boolean).length;
    let score = 0;
    let feedback = '';

    if (value.length === 0) {
      score = 0;
      feedback = t('auth.password_strength.empty', { defaultValue: 'Ingresa una contraseña' });
    } else if (value.length < 6) {
      score = 1;
      feedback = t('auth.password_strength.too_short', { defaultValue: 'Muy débil - mínimo 6 caracteres' });
    } else if (metCriteria <= 2) {
      score = 2;
      feedback = t('auth.password_strength.weak', { defaultValue: 'Débil - incluye mayúsculas y números' });
    } else if (metCriteria === 3) {
      score = 3;
      feedback = t('auth.password_strength.fair', { defaultValue: 'Regular - agrega caracteres especiales' });
    } else if (metCriteria === 4) {
      score = 4;
      feedback = t('auth.password_strength.good', { defaultValue: 'Buena - casi perfecta' });
    } else {
      score = 5;
      feedback = t('auth.password_strength.strong', { defaultValue: 'Muy fuerte - excelente seguridad' });
    }

    return { score, feedback, criteria };
  };

  // Componente de barra de fortaleza de contraseña
  const PasswordStrengthBar = () => {
    const isDark = resolvedTheme === 'dark';
    const { score, feedback, criteria } = passwordStrength;
    
    const getStrengthColor = () => {
      switch (score) {
        case 0: return isDark ? 'bg-gray-600' : 'bg-gray-300';
        case 1: return 'bg-red-500';
        case 2: return 'bg-orange-500';
        case 3: return 'bg-yellow-500';
        case 4: return 'bg-blue-500';
        case 5: return 'bg-green-500';
        default: return isDark ? 'bg-gray-600' : 'bg-gray-300';
      }
    };

    const getStrengthWidth = () => {
      switch (score) {
        case 0: return '0%';
        case 1: return '20%';
        case 2: return '40%';
        case 3: return '60%';
        case 4: return '80%';
        case 5: return '100%';
        default: return '0%';
      }
    };

    const getAriaValueText = () => {
      const levels = [
        t('auth.password_strength.empty', { defaultValue: 'Vacía' }),
        t('auth.password_strength.very_weak', { defaultValue: 'Muy débil' }),
        t('auth.password_strength.weak', { defaultValue: 'Débil' }),
        t('auth.password_strength.fair', { defaultValue: 'Regular' }),
        t('auth.password_strength.good', { defaultValue: 'Buena' }),
        t('auth.password_strength.strong', { defaultValue: 'Muy fuerte' })
      ];
      return levels[score] || levels[0];
    };

    return (
      <div className="mt-3 space-y-2">
        {/* Barra de progreso */}
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('auth.password_strength.label', { defaultValue: 'Fortaleza:' })}
          </span>
          <div className="flex-1">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuetext={getAriaValueText()}
              aria-describedby="password-strength-feedback password-criteria"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: getStrengthWidth() }}
              />
            </div>
          </div>
        </div>

        {/* Feedback textual */}
        <div
          id="password-strength-feedback"
          className={`text-sm font-medium transition-colors duration-200 ${
            score <= 2 ? 'text-red-600 dark:text-red-400' :
            score <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
            score <= 4 ? 'text-blue-600 dark:text-blue-400' :
            'text-green-600 dark:text-green-400'
          }`}
          aria-live="polite"
        >
          {feedback}
        </div>

        {/* Criterios de validación */}
        <div id="password-criteria" className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
          <div className={`flex items-center gap-2 ${criteria.length ? 'text-green-600 dark:text-green-400' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-base" role="img" aria-hidden="true">
              {criteria.length ? '✓' : '○'}
            </span>
            <span>{t('auth.password_criteria.length', { defaultValue: 'Al menos 8 caracteres' })}</span>
          </div>
          <div className={`flex items-center gap-2 ${criteria.uppercase ? 'text-green-600 dark:text-green-400' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-base" role="img" aria-hidden="true">
              {criteria.uppercase ? '✓' : '○'}
            </span>
            <span>{t('auth.password_criteria.uppercase', { defaultValue: 'Letras mayúsculas' })}</span>
          </div>
          <div className={`flex items-center gap-2 ${criteria.lowercase ? 'text-green-600 dark:text-green-400' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-base" role="img" aria-hidden="true">
              {criteria.lowercase ? '✓' : '○'}
            </span>
            <span>{t('auth.password_criteria.lowercase', { defaultValue: 'Letras minúsculas' })}</span>
          </div>
          <div className={`flex items-center gap-2 ${criteria.numbers ? 'text-green-600 dark:text-green-400' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-base" role="img" aria-hidden="true">
              {criteria.numbers ? '✓' : '○'}
            </span>
            <span>{t('auth.password_criteria.numbers', { defaultValue: 'Números' })}</span>
          </div>
          <div className={`flex items-center gap-2 sm:col-span-2 ${criteria.special ? 'text-green-600 dark:text-green-400' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="text-base" role="img" aria-hidden="true">
              {criteria.special ? '✓' : '○'}
            </span>
            <span>{t('auth.password_criteria.special', { defaultValue: 'Caracteres especiales (!@#$%^&*)' })}</span>
          </div>
        </div>
      </div>
    );
  };

  // Validación en tiempo real durante la escritura
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    const error = validateName(value);
    setErrors(prev => ({ ...prev, name: error }));
    
    if (fieldValidation.name.touched) {
      setFieldValidation(prev => ({
        ...prev,
        name: { ...prev.name, touched: true }
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    const error = validateEmail(value);
    setErrors(prev => ({ ...prev, email: error }));
    
    if (fieldValidation.email.touched) {
      setFieldValidation(prev => ({
        ...prev,
        email: { ...prev.email, touched: true }
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error }));
    
    // También validar confirmPassword si ya tiene valor
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
    
    if (fieldValidation.password.touched) {
      setFieldValidation(prev => ({
        ...prev,
        password: { ...prev.password, touched: true }
      }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    const error = validateConfirmPassword(value);
    setErrors(prev => ({ ...prev, confirmPassword: error }));
    
    if (fieldValidation.confirmPassword.touched) {
      setFieldValidation(prev => ({
        ...prev,
        confirmPassword: { ...prev.confirmPassword, touched: true }
      }));
    }
  };

  // Manejo del foco y blur para validación
  const handleFieldFocus = (field: string) => {
    setFieldValidation(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof prev], focused: true }
    }));
  };

  const handleFieldBlur = (field: string) => {
    setFieldValidation(prev => ({
      ...prev,
      [field]: { 
        ...prev[field as keyof typeof prev], 
        focused: false, 
        touched: true 
      }
    }));

    // Validar el campo al perder el foco
    let error = "";
    switch (field) {
      case 'name':
        error = validateName(name);
        break;
      case 'email':
        error = validateEmail(email);
        break;
      case 'password':
        error = validatePassword(password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(confirmPassword);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Manejo de navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent, nextField?: () => void) => {
    if (e.key === 'Enter' && nextField) {
      e.preventDefault();
      nextField();
    }
  };

  // Funciones de foco para navegación
  const focusEmail = () => emailInputRef.current?.focus();
  const focusPassword = () => passwordInputRef.current?.focus();
  const focusConfirmPassword = () => confirmPasswordInputRef.current?.focus();
  const focusSubmit = () => submitButtonRef.current?.focus();

  // Función para obtener clases de validación con soporte completo de modo oscuro
  const getValidationClasses = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    if (!mounted) return 'w-full py-4 text-lg rounded-2xl border-2 transition-all duration-200 shadow-lg focus:shadow-xl focus:outline-none border-gray-300 bg-white text-gray-900';
    
    const validation = fieldValidation[field];
    const hasError = errors[field];
    const isDark = resolvedTheme === 'dark';
    
    // Clases base
    const baseClasses = 'w-full py-4 text-lg rounded-2xl border-2 transition-all duration-200 shadow-lg focus:shadow-xl focus:outline-none';
    
    // Estados de color basados en el tema actual
    if (hasError) {
      return isDark 
        ? `${baseClasses} border-red-400 bg-red-900/20 text-gray-100 placeholder-gray-400 focus:border-red-300 focus:ring-4 focus:ring-red-400/30`
        : `${baseClasses} border-red-500 bg-red-50 text-gray-900 placeholder-gray-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/20`;
    }
    
    if (validation.focused) {
      return isDark 
        ? `${baseClasses} border-purple-400 bg-blue-900/20 text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30`
        : `${baseClasses} border-purple-600 bg-blue-50 text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/20`;
    }
    
    if (validation.touched && !hasError) {
      return isDark 
        ? `${baseClasses} border-green-400 bg-green-900/20 text-gray-100 placeholder-gray-400 focus:border-green-300 focus:ring-4 focus:ring-green-400/30`
        : `${baseClasses} border-green-500 bg-green-50 text-gray-900 placeholder-gray-500 focus:border-green-600 focus:ring-4 focus:ring-green-500/20`;
    }
    
    // Estado por defecto
    return isDark 
      ? `${baseClasses} border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 hover:border-purple-400/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30`
      : `${baseClasses} border-gray-300 bg-white text-gray-900 placeholder-gray-500 hover:border-purple-600/50 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/20`;
  };
  
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
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  // Effect para forzar re-renderización cuando cambia el tema
  useEffect(() => {
    if (mounted && resolvedTheme) {
      // Forzar re-renderización de los inputs
      setFieldValidation(prev => ({ ...prev }));
    }
  }, [resolvedTheme, mounted]);

  // Effect para evaluar la fortaleza de la contraseña
  useEffect(() => {
    const strength = evaluatePasswordStrength(password);
    setPasswordStrength(strength);
    
    // Anunciar cambios de fortaleza para lectores de pantalla
    if (password && mounted) {
      setAnnounceMessage(`${t('auth.password_strength.updated', { defaultValue: 'Fortaleza actualizada:' })} ${strength.feedback}`);
    }
  }, [password, t, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir múltiples envíos y verificar bloqueo
    if (loading || isBlocked) return;

    // Limpiar mensajes anteriores
    setError("");
    setSuccess("");
    setErrors({ name: "", email: "", password: "", confirmPassword: "", general: "" });
    
    // Validar todos los campos
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    const hasErrors = nameError || emailError || passwordError || confirmPasswordError;

    if (hasErrors) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        general: ""
      });
      
      // Incrementar contador de intentos y anunciar error
      setAttemptCount(prev => prev + 1);
      setAnnounceMessage(t('auth.form_has_errors', { 
        defaultValue: 'El formulario tiene errores. Por favor corrígelos.' 
      }));

      // Foco en el primer campo con error
      if (nameError && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (emailError && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (passwordError && passwordInputRef.current) {
        passwordInputRef.current.focus();
      } else if (confirmPasswordError && confirmPasswordInputRef.current) {
        confirmPasswordInputRef.current.focus();
      }
      
      return;
    }

    setLoading(true);
    setAnnounceMessage(t('auth.creating_account', { defaultValue: 'Creando cuenta...' }));

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        let errorMessage = t('auth.error.signup_failed', { 
          defaultValue: 'No se pudo crear la cuenta. Inténtalo de nuevo.' 
        });

        // Mensajes específicos según el tipo de error
        if (error.message.includes('User already registered')) {
          errorMessage = t('auth.error.user_exists', { 
            defaultValue: 'Ya existe una cuenta con este correo electrónico.' 
          });
        } else if (error.message.includes('Invalid email')) {
          errorMessage = t('auth.error.email_invalid', { 
            defaultValue: 'El formato del correo electrónico no es válido.' 
          });
          setErrors(prev => ({ ...prev, email: errorMessage }));
        } else if (error.message.includes('Password')) {
          errorMessage = t('auth.error.password_requirements', { 
            defaultValue: 'La contraseña no cumple con los requisitos.' 
          });
          setErrors(prev => ({ ...prev, password: errorMessage }));
        }

        setError(errorMessage);
        setAttemptCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setIsBlocked(true);
            setBlockTimeLeft(30);
            setAnnounceMessage(t('auth.too_many_attempts', { 
              defaultValue: 'Demasiados intentos fallidos. Inténtalo en 30 segundos.' 
            }));
          }
          return newCount;
        });
      } else {
        setSuccess(t('auth.signup_success', { 
          defaultValue: 'Cuenta creada exitosamente. Revisa tu correo para verificar tu cuenta.' 
        }));
        setAnnounceMessage(t('auth.signup_success_announce', { 
          defaultValue: 'Cuenta creada exitosamente.' 
        }));
        
        // Limpiar formulario después del éxito
        setTimeout(() => {
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setErrors({ name: "", email: "", password: "", confirmPassword: "", general: "" });
          setFieldValidation({
            name: { touched: false, focused: false },
            email: { touched: false, focused: false },
            password: { touched: false, focused: false },
            confirmPassword: { touched: false, focused: false }
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Error durante el registro:', err);
      setError(t('auth.error.network', { 
        defaultValue: 'Error de conexión. Verifica tu internet e inténtalo de nuevo.' 
      }));
      setAttemptCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-main px-4 py-12">
      {/* Anuncio accesible para lectores de pantalla */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announceMessage}
      </div>

      <section className="card w-full max-w-lg mx-auto text-center shadow-2xl animate-fade-in backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border-2 border-primary/50 rounded-3xl p-12 transition-all duration-300 flex flex-col gap-8">
        
        {/* Encabezado */}
        <header className="mb-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">👤</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-8 tracking-tight drop-shadow-lg animate-fade-in">
            {t('register.title', { defaultValue: 'Crear cuenta' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {t('register.subtitle', { defaultValue: 'Únete a ViveSano para comenzar tu viaje hacia una vida más saludable' })}
          </p>
        </header>

        <form 
          className="flex flex-col gap-8" 
          onSubmit={handleSubmit}
          noValidate
          aria-describedby="form-instructions"
        >
          
          {/* Instrucciones del formulario */}
          <div id="form-instructions" className="sr-only">
            {t('auth.form_instructions', { defaultValue: 'Complete todos los campos requeridos. Use Tab para navegar y Enter para enviar.' })}
          </div>

          {/* Campo Nombre */}
          <div className="relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-lg">👤</span>
                </div>
              </div>
              <input
                ref={nameInputRef}
                type="text"
                id="register-name"
                value={name}
                onChange={handleNameChange}
                onFocus={() => handleFieldFocus('name')}
                onBlur={() => handleFieldBlur('name')}
                onKeyDown={(e) => handleKeyDown(e, focusEmail)}
                placeholder={t('register.name', { defaultValue: 'Nombre completo' })}
                className={`${getValidationClasses('name')} pl-16 pr-4`}
                aria-label={t('register.name', { defaultValue: 'Nombre completo' })}
                aria-describedby={errors.name ? 'name-error' : 'name-help'}
                aria-invalid={!!errors.name}
                aria-required="true"
                autoComplete="name"
                disabled={loading || isBlocked}
              />
            </div>
            
            {/* Ayuda del campo */}
            <div id="name-help" className="sr-only">
              {t('auth.name_help', { defaultValue: 'Ingresa tu nombre completo. Mínimo 2 caracteres, solo letras y espacios.' })}
            </div>
            
            {/* Mensaje de error */}
            {errors.name && (
              <div 
                id="name-error" 
                className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-base" role="img" aria-label={t('auth.error_icon_label', { defaultValue: 'Error' })}>⚠️</span>
                <span>{errors.name}</span>
              </div>
            )}
            
            {/* Indicador de validez */}
            {name && !errors.name && fieldValidation.name.touched && (
              <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400 text-sm animate-fade-in">
                <span className="text-base" role="img" aria-label={t('auth.success_icon_label', { defaultValue: 'Válido' })}>✅</span>
                <span>{t('auth.field_valid', { defaultValue: 'Campo válido' })}</span>
              </div>
            )}
          </div>

          {/* Campo Email */}
          <div className="relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-lg">📧</span>
                </div>
              </div>
              <input
                ref={emailInputRef}
                type="email"
                id="register-email"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => handleFieldFocus('email')}
                onBlur={() => handleFieldBlur('email')}
                onKeyDown={(e) => handleKeyDown(e, focusPassword)}
                placeholder={t('register.email', { defaultValue: 'Correo electrónico' })}
                className={`${getValidationClasses('email')} pl-16 pr-4`}
                aria-label={t('register.email', { defaultValue: 'Correo electrónico' })}
                aria-describedby={errors.email ? 'email-error' : 'email-help'}
                aria-invalid={!!errors.email}
                aria-required="true"
                autoComplete="email"
                disabled={loading || isBlocked}
              />
            </div>
            
            <div id="email-help" className="sr-only">
              {t('auth.email_help', { defaultValue: 'Ingresa un correo electrónico válido. Lo usarás para iniciar sesión.' })}
            </div>
            
            {errors.email && (
              <div 
                id="email-error" 
                className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-base" role="img" aria-label={t('auth.error_icon_label', { defaultValue: 'Error' })}>⚠️</span>
                <span>{errors.email}</span>
              </div>
            )}
            
            {email && !errors.email && fieldValidation.email.touched && (
              <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400 text-sm animate-fade-in">
                <span className="text-base" role="img" aria-label={t('auth.success_icon_label', { defaultValue: 'Válido' })}>✅</span>
                <span>{t('auth.field_valid', { defaultValue: 'Campo válido' })}</span>
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-lg">🔐</span>
                </div>
              </div>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => handleFieldFocus('password')}
                onBlur={() => handleFieldBlur('password')}
                onKeyDown={(e) => handleKeyDown(e, focusConfirmPassword)}
                placeholder={t('register.password', { defaultValue: 'Contraseña' })}
                className={`${getValidationClasses('password')} pl-16 pr-16`}
                aria-label={t('register.password', { defaultValue: 'Contraseña' })}
                aria-describedby={`password-help password-strength-feedback password-criteria ${errors.password ? 'password-error' : ''}`}
                aria-invalid={!!errors.password}
                aria-required="true"
                autoComplete="new-password"
                disabled={loading || isBlocked}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={showPassword 
                  ? t('auth.hide_password', { defaultValue: 'Ocultar contraseña' })
                  : t('auth.show_password', { defaultValue: 'Mostrar contraseña' })
                }
                tabIndex={loading || isBlocked ? -1 : 0}
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            
            <div id="password-help" className="sr-only">
              {t('auth.password_help', { defaultValue: 'La contraseña debe tener al menos 6 caracteres, incluir mayúsculas, minúsculas y números.' })}
            </div>
            
            {/* Barra de fortaleza de contraseña */}
            {password && mounted && <PasswordStrengthBar />}
            
            {errors.password && (
              <div 
                id="password-error" 
                className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-base" role="img" aria-label={t('auth.error_icon_label', { defaultValue: 'Error' })}>⚠️</span>
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-lg">🔒</span>
                </div>
              </div>
              <input
                ref={confirmPasswordInputRef}
                type={showConfirmPassword ? 'text' : 'password'}
                id="register-confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onFocus={() => handleFieldFocus('confirmPassword')}
                onBlur={() => handleFieldBlur('confirmPassword')}
                onKeyDown={(e) => handleKeyDown(e, focusSubmit)}
                placeholder={t('register.confirmPassword', { defaultValue: 'Confirmar contraseña' })}
                className={`${getValidationClasses('confirmPassword')} pl-16 pr-16`}
                aria-label={t('register.confirmPassword', { defaultValue: 'Confirmar contraseña' })}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : 'confirm-password-help'}
                aria-invalid={!!errors.confirmPassword}
                aria-required="true"
                autoComplete="new-password"
                disabled={loading || isBlocked}
              />
              
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={showConfirmPassword 
                  ? t('auth.hide_password', { defaultValue: 'Ocultar contraseña' })
                  : t('auth.show_password', { defaultValue: 'Mostrar contraseña' })
                }
                tabIndex={loading || isBlocked ? -1 : 0}
              >
                <span className="text-lg" role="img" aria-hidden="true">
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            
            <div id="confirm-password-help" className="sr-only">
              {t('auth.confirm_password_help', { defaultValue: 'Vuelve a escribir tu contraseña para confirmar que coincida.' })}
            </div>
            
            {errors.confirmPassword && (
              <div 
                id="confirm-password-error" 
                className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-base" role="img" aria-label={t('auth.error_icon_label', { defaultValue: 'Error' })}>⚠️</span>
                <span>{errors.confirmPassword}</span>
              </div>
            )}
            
            {confirmPassword && !errors.confirmPassword && fieldValidation.confirmPassword.touched && (
              <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400 text-sm animate-fade-in">
                <span className="text-base" role="img" aria-label={t('auth.success_icon_label', { defaultValue: 'Válido' })}>✅</span>
                <span>{t('auth.passwords_match', { defaultValue: 'Las contraseñas coinciden' })}</span>
              </div>
            )}
          </div>

          {/* Mensajes de estado del formulario */}
          <div className="space-y-3">
            {error && (
              <div 
                className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-xl flex-shrink-0" role="img" aria-label={t('auth.error_icon_label', { defaultValue: 'Error' })}>❌</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            {success && (
              <div 
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-xl flex-shrink-0" role="img" aria-label={t('auth.success_icon_label', { defaultValue: 'Éxito' })}>✅</span>
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Mensaje de bloqueo temporal */}
            {isBlocked && (
              <div 
                className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-700 dark:text-yellow-300 animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-xl flex-shrink-0" role="img" aria-label={t('auth.warning_icon_label', { defaultValue: 'Advertencia' })}>⏱️</span>
                <div className="text-sm">
                  <p className="font-medium">{t('auth.temporarily_blocked', { defaultValue: 'Temporalmente bloqueado' })}</p>
                  <p>{t('auth.try_again_in', { defaultValue: 'Inténtalo nuevamente en' })} {blockTimeLeft} {t('auth.seconds', { defaultValue: 'segundos' })}</p>
                </div>
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={loading || isBlocked || (!name || !email || !password || !confirmPassword)}
            className={`
              relative w-full py-4 px-6 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl
              focus:outline-none focus:ring-4 focus:ring-purple-500/50 
              ${loading || isBlocked || (!name || !email || !password || !confirmPassword)
                ? (mounted && resolvedTheme === 'dark' 
                    ? 'bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed')
                : (mounted && resolvedTheme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border border-purple-500 hover:border-purple-400 shadow-lg hover:shadow-purple-500/30'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border border-purple-600 hover:border-purple-500 shadow-lg hover:shadow-purple-500/30')
              }
              ${loading || isBlocked || (!name || !email || !password || !confirmPassword) 
                ? '' 
                : 'hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
              }
              animate-fade-in overflow-hidden
            `}
            aria-describedby="submit-button-help"
          >
            {/* Efecto de brillo para botón activo */}
            {!loading && !isBlocked && name && email && password && confirmPassword && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}
            
            <div className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className={`w-5 h-5 border-2 rounded-full animate-spin ${
                    mounted && resolvedTheme === 'dark' 
                      ? 'border-purple-300/30 border-t-white' 
                      : 'border-white/30 border-t-white'
                  }`} 
                       aria-hidden="true"></div>
                  <span className="font-medium">{t('auth.creating_account', { defaultValue: 'Creando cuenta...' })}</span>
                </>
              ) : isBlocked ? (
                <>
                  <span className="text-xl" role="img" aria-hidden="true">⏱️</span>
                  <span className="font-medium">{t('auth.blocked', { defaultValue: 'Bloqueado temporalmente' })}</span>
                </>
              ) : (
                <>
                  <span className="text-xl" role="img" aria-hidden="true">🚀</span>
                  <span className="font-medium">{t('register.submit', { defaultValue: 'Crear cuenta' })}</span>
                </>
              )}
            </div>
          </button>
          
          <div id="submit-button-help" className="sr-only">
            {t('auth.submit_help', { defaultValue: 'Presiona Enter o haz clic para crear tu cuenta después de completar todos los campos.' })}
          </div>
        </form>

        {/* Enlaces de navegación */}
        <footer className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {t('register.already_have_account', { defaultValue: '¿Ya tienes una cuenta?' })}
          </p>
          <Link 
            href="/iniciar-sesion" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 rounded-lg px-3 py-2"
            aria-label={t('auth.go_to_login', { defaultValue: 'Ir al inicio de sesión' })}
          >
            <span className="text-lg">🔑</span>
            <span>{t('register.login_link', { defaultValue: 'Iniciar sesión' })}</span>
          </Link>
        </footer>
      </section>
    </main>
  );
}
