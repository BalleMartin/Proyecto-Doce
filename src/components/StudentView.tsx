/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ecosistema DOCE - IFTS N.º 12
 * Vista del Estudiante según el Catálogo Oficial de Mockups Definitivos (Pantallas 1, 2, 3, 4 y 7)
 * "Una identidad cercana y adulta · Tu acompañamiento a medida"
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  HelpCircle,
  FileText,
  Send,
  MessageCircle,
  Bot,
  Flame,
  ArrowRight,
  TrendingUp,
  Brain,
  Headphones,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  Layers,
  Check,
  ChevronRight,
  Lightbulb,
  Sun,
  ListTodo,
  ExternalLink,
  Plus,
  Trash2,
  ShieldCheck,
  X,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react';
import {
  Estudiante,
  PrediccionRiesgo,
  Alerta,
  InteraccionDOC,
  ModoDOC,
  RitmoEstudio,
} from '../domain/models.js';
import { ambientAudio } from '../utils/ambientAudio.js';
import { AuthUserResponse } from '../services/api.js';

export interface CursadaDetalleUI {
  codigo: string;
  nombre: string;
  subtitulo: string;
  estado: string;
  progreso: number;
  alDia: boolean;
  icono: 'book' | 'layers' | 'code';
}

export interface EstudianteDataPreset {
  metas: Array<{ id: string; texto: string; completada: boolean; materia: string }>;
  microVictorias: {
    porcentaje: number;
    mensaje: string;
    detalle: string;
    motivacion: string;
    insignia: string;
    nivel: string;
    puntos: number;
    historico: string;
  };
  pistaRecomendada: 'Tarde lluviosa' | 'Café de estudio' | 'Ondas Alpha';
  cursadas: CursadaDetalleUI[];
  adelantoOpcional: {
    titulo: string;
    etiqueta: string;
  };
  momentoSugerido: string;
  tiempoSugerido: string;
  perfilSocioLaboral: {
    horasTrabajo: number;
    minutosViaje: number;
    personasCargo: number;
    estres: number;
    ritmo: RitmoEstudio;
  };
}

export const PRESETS_ESTUDIANTES: Record<string, EstudianteDataPreset> = {
  'est-alex-12': {
    metas: [
      { id: 'm1', texto: 'Terminar el capítulo de Historia', completada: true, materia: 'Historia de los Medios' },
      { id: 'm2', texto: 'Practicar álgebra 30 min', completada: false, materia: 'Álgebra Lineal' },
      { id: 'm3', texto: 'Revisar apunte de Redes Neuronales', completada: false, materia: 'Inteligencia Artificial I' },
    ],
    microVictorias: {
      porcentaje: 75,
      mensaje: '¡Buen Trabajo, Álex!',
      detalle: '3 de 4 tareas semanales al día',
      motivacion: 'Cada avance cuenta. Paso a paso vas sosteniendo tu cursada en el IFTS N.º 12.',
      insignia: '🎖️ ¡3 Trabajos Aprobados esta semana!',
      nivel: '¡Nivel 2 Desbloqueado! ✨',
      puntos: 420,
      historico: '“Hace 1 mes tenías 3 tareas atrasadas... ¡Hoy estás 100% al día!”',
    },
    pistaRecomendada: 'Tarde lluviosa',
    cursadas: [
      { codigo: 'CDIA-101', nombre: 'Estadística y Probabilidad Aplicada', subtitulo: 'Semana 8 · Muestreo y Esperanza Matemática', estado: 'Al día (75%)', progreso: 75, alDia: true, icono: 'book' },
      { codigo: 'CDIA-102', nombre: 'Inteligencia Artificial I (Machine Learning)', subtitulo: 'Avance de TP: Modelo de Regresión', estado: 'En curso (35%)', progreso: 35, alDia: false, icono: 'layers' },
      { codigo: 'CDIA-103', nombre: 'Álgebra Lineal y Computacional', subtitulo: 'Matrices y Tensores en Python', estado: 'Al día (60%)', progreso: 60, alDia: true, icono: 'code' },
    ],
    adelantoOpcional: {
      titulo: 'Defensa oral de TP2 (Sábado 24)',
      etiqueta: 'Flexibilizado',
    },
    momentoSugerido: 'Momento sugerido',
    tiempoSugerido: 'Bloque suave de 20 minutos',
    perfilSocioLaboral: {
      horasTrabajo: 38,
      minutosViaje: 75,
      personasCargo: 1,
      estres: 7,
      ritmo: 'Fragmentado',
    },
  },
  'est-24192': {
    metas: [
      { id: 'm1', texto: 'Descargar notebook de Pandas y NumPy', completada: true, materia: 'Programación para Ciencia de Datos (Python)' },
      { id: 'm2', texto: 'Repasar consultas JOIN y GROUP BY en SQLite', completada: false, materia: 'Bases de Datos & SQL' },
      { id: 'm3', texto: 'Resolver ejercicio de sintaxis de bucles for', completada: false, materia: 'Programación para Ciencia de Datos (Python)' },
      { id: 'm4', texto: 'Confirmar prórroga pedagógica con cátedra', completada: true, materia: 'Acompañamiento DOCE' },
    ],
    microVictorias: {
      porcentaje: 50,
      mensaje: '¡Gran avance, Camila!',
      detalle: '2 de 4 tareas semanales completadas',
      motivacion: 'Superaste el tramo de viaje largo y regularizaste la primera entrega de Python. Cada bloque cuenta para tu avance.',
      insignia: '🛡️ ¡Resiliencia y Compromiso!',
      nivel: 'Nivel 1 — En Ascenso 🌿',
      puntos: 280,
      historico: '“Completaste el módulo inicial de Python compensando 44h de jornada laboral y viaje desde AMBA.”',
    },
    pistaRecomendada: 'Café de estudio',
    cursadas: [
      { codigo: 'CDIA-104', nombre: 'Programación para Ciencia de Datos (Python)', subtitulo: 'Estructuras de Control y Funciones · Prórroga concedida', estado: 'Recuperando (35%)', progreso: 35, alDia: false, icono: 'code' },
      { codigo: 'CDIA-105', nombre: 'Bases de Datos & SQL para Analytics', subtitulo: 'Modelado Relacional y Consultas Agrupadas', estado: 'En curso (30%)', progreso: 30, alDia: false, icono: 'layers' },
    ],
    adelantoOpcional: {
      titulo: 'Entrega flexible de TP2 Programación (Miércoles 28)',
      etiqueta: 'Prórroga Activa',
    },
    momentoSugerido: 'Micro-módulo móvil',
    tiempoSugerido: 'Bloque de 15 min en transporte',
    perfilSocioLaboral: {
      horasTrabajo: 44,
      minutosViaje: 95,
      personasCargo: 1,
      estres: 8,
      ritmo: 'Fragmentado',
    },
  },
  'est-24155': {
    metas: [
      { id: 'm1', texto: 'Diagramar árbol binario de búsqueda en papel', completada: true, materia: 'Algoritmos y Estructuras de Datos' },
      { id: 'm2', texto: 'Configurar simulación de subredes en Packet Tracer', completada: true, materia: 'Redes y Comunicaciones' },
      { id: 'm3', texto: 'Completar cuestionario de la Unidad 3 antes del turno', completada: false, materia: 'Algoritmos y Estructuras de Datos' },
    ],
    microVictorias: {
      porcentaje: 66,
      mensaje: '¡Excelente ritmo, Juan Manuel!',
      detalle: '4 de 6 módulos aprobados con solidez',
      motivacion: 'Organización eficiente entre tus turnos de fábrica y las prácticas de algoritmos.',
      insignia: '⚙️ ¡Constancia en Algoritmos!',
      nivel: '¡Nivel 2 Desbloqueado! ✨',
      puntos: 375,
      historico: '“Mantuviste el promedio de 7.0 coordinando tus horarios de guardia rotativa.”',
    },
    pistaRecomendada: 'Ondas Alpha',
    cursadas: [
      { codigo: 'TSDS-201', nombre: 'Algoritmos y Estructuras de Datos', subtitulo: 'Pilas, Colas y Complejidad Asintótica Big-O', estado: 'Al día (55%)', progreso: 55, alDia: true, icono: 'code' },
      { codigo: 'TSDS-202', nombre: 'Redes y Comunicaciones', subtitulo: 'Modelo OSI y Direccionamiento IPv4/IPv6', estado: 'Al día (50%)', progreso: 50, alDia: true, icono: 'layers' },
    ],
    adelantoOpcional: {
      titulo: 'Laboratorio virtual de enrutamiento estático',
      etiqueta: 'Práctica opcional',
    },
    momentoSugerido: 'Ventana de descanso',
    tiempoSugerido: 'Bloque focalizado de 25 min',
    perfilSocioLaboral: {
      horasTrabajo: 30,
      minutosViaje: 45,
      personasCargo: 1,
      estres: 6,
      ritmo: 'Regular',
    },
  },
  'est-23910': {
    metas: [
      { id: 'm1', texto: 'Revisar diagrama UML de clases del proyecto grupal', completada: true, materia: 'Programación Orientada a Objetos' },
      { id: 'm2', texto: 'Redactar informe de avance semanal de práctica', completada: true, materia: 'Práctica Profesionalizante I' },
      { id: 'm3', texto: 'Implementar patrón Observer en Java', completada: false, materia: 'Programación Orientada a Objetos' },
    ],
    microVictorias: {
      porcentaje: 90,
      mensaje: '¡Desempeño Sobresaliente, Sofía!',
      detalle: '5 de 5 entregas al día',
      motivacion: 'Trayectoria académica consolidada con alta participación en los laboratorios.',
      insignia: '💎 ¡Excelencia Técnica!',
      nivel: '¡Nivel 3 Maestro! 🚀',
      puntos: 560,
      historico: '“9.0 en POO y liderazgo activo en Práctica Profesionalizante I.”',
    },
    pistaRecomendada: 'Tarde lluviosa',
    cursadas: [
      { codigo: 'TSDS-203', nombre: 'Programación Orientada a Objetos', subtitulo: 'Patrones de Diseño y Polimorfismo', estado: 'Al día (75%)', progreso: 75, alDia: true, icono: 'code' },
      { codigo: 'TSDS-204', nombre: 'Práctica Profesionalizante I', subtitulo: 'Desarrollo de Software para Entorno Real', estado: 'Al día (70%)', progreso: 70, alDia: true, icono: 'book' },
    ],
    adelantoOpcional: {
      titulo: 'Entrega final Sprint 2 de Práctica Profesionalizante',
      etiqueta: 'Adelantado',
    },
    momentoSugerido: 'Momento óptimo',
    tiempoSugerido: 'Bloque de estudio de 30 min',
    perfilSocioLaboral: {
      horasTrabajo: 18,
      minutosViaje: 25,
      personasCargo: 0,
      estres: 3,
      ritmo: 'Intensivo',
    },
  },
};

interface StudentViewProps {
  usuario?: AuthUserResponse | null;
  estudiante: Estudiante;
  prediccion: PrediccionRiesgo | null;
  alerta: Alerta | null;
  interaccionesDOC: InteraccionDOC[];
  onActualizarPerfil: (datos: {
    horas_trabajo_semanal: number;
    minutos_viaje: number;
    personas_a_cargo: number;
    nivel_estres_percibido: number;
    ritmo_estudio: RitmoEstudio;
  }) => Promise<{ ok: boolean; error?: string; fecha_actualizacion?: string } | void>;
  onEnviarMensajeDOC: (mensaje: string, modo: ModoDOC) => Promise<void>;
  onDesglosarTextoDOC: (texto: string, materia: string) => Promise<string>;
  cargandoDOC: boolean;
}

export type PantallaEstudiante =
  | 'corcho' // Pantalla 1: Home — Tablero de Corcho Virtual (Moodboard Inspirador)
  | 'onboarding' // Pantalla 2: Onboarding inicial y Mi perfil
  | 'cursada_foco' // Pantalla 3: Plan de Cursada & Temporizador Adaptativo
  | 'doc' // Pantalla 4: Interfaz Conversacional del Asistente DOC
  | 'gamificacion'; // Pantalla 7: Módulo de Motivación, Gamificación y Visión a Futuro

export const StudentView: React.FC<StudentViewProps> = ({
  usuario,
  estudiante,
  prediccion,
  alerta,
  interaccionesDOC,
  onActualizarPerfil,
  onEnviarMensajeDOC,
  onDesglosarTextoDOC,
  cargandoDOC,
}) => {
  // Identificar si la vista está siendo consultada por Coordinación / Dirección
  const esCoordinacion = usuario?.rol === 'admin' || usuario?.id === 'user-adm-direccion';

  // Navegación por las pantallas del estudiante; si no tiene perfil completado, iniciar en onboarding
  const [onboardingOmitido, setOnboardingOmitido] = useState(false);
  const [pantallaActiva, setPantallaActiva] = useState<PantallaEstudiante>(() =>
    !esCoordinacion && estudiante.perfilEstudio === null ? 'onboarding' : 'corcho'
  );

  // Preset de datos precargados para el estudiante actual
  const presetActivo = useMemo(() => {
    return PRESETS_ESTUDIANTES[estudiante.id_usuario] || PRESETS_ESTUDIANTES['est-alex-12'];
  }, [estudiante.id_usuario]);

  // --- ESTADO PANTALLA 1: TABLERO DE CORCHO & REPRODUCTOR AMBIENTAL ---
  const [metasCorcho, setMetasCorcho] = useState(presetActivo.metas);
  const [nuevaMetaInput, setNuevaMetaInput] = useState('');
  const [audioReproduciendo, setAudioReproduciendo] = useState(false);
  const [pistaActual, setPistaActual] = useState<'Tarde lluviosa' | 'Café de estudio' | 'Ondas Alpha'>(presetActivo.pistaRecomendada);

  // --- ESTADO BIENVENIDA ANIMADA DE DOC (UNA VEZ POR SESIÓN) ---
  const sessionKeyPrefix = `doce_bienvenida_${usuario?.id || 'estudiante'}`;
  const videoSessionKey = `${sessionKeyPrefix}_video_visto`;
  const dismissSessionKey = `${sessionKeyPrefix}_cerrada`;

  const [prefiereMovimientoReducido, setPrefiereMovimientoReducido] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [bienvenidaCerrada, setBienvenidaCerrada] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        window.sessionStorage.getItem(dismissSessionKey) === '1' ||
        window.sessionStorage.getItem(videoSessionKey) === '1'
      );
    } catch {
      return false;
    }
  });

  const [bienvenidaDesvaneciendo, setBienvenidaDesvaneciendo] = useState<boolean>(false);

  const [usarAvatarEstatico, setUsarAvatarEstatico] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  const bienvenidaVideoRef = useRef<HTMLVideoElement | null>(null);
  const bienvenidaMostradaEnCorchoRef = useRef<boolean>(false);
  const cierreIniciadoRef = useRef<boolean>(false);
  const montadoRef = useRef<boolean>(true);
  const fadeTimeoutRef = useRef<number | null>(null);
  const autoCloseTimeoutRef = useRef<number | null>(null);
  const duracionLecturaMsRef = useRef<number>(4000);
  const prefiereMovimientoReducidoRef = useRef<boolean>(prefiereMovimientoReducido);

  useEffect(() => {
    prefiereMovimientoReducidoRef.current = prefiereMovimientoReducido;
  }, [prefiereMovimientoReducido]);

  const persistirVideoVisto = () => {
    try {
      window.sessionStorage.setItem(videoSessionKey, '1');
    } catch {
      // Ignorar si sessionStorage no está disponible
    }
  };

  const persistirBienvenidaCompletada = () => {
    try {
      window.sessionStorage.setItem(videoSessionKey, '1');
      window.sessionStorage.setItem(dismissSessionKey, '1');
    } catch {
      // Ignorar si sessionStorage no está disponible
    }
  };

  const cancelarTemporizadoresBienvenida = () => {
    if (autoCloseTimeoutRef.current !== null) {
      window.clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
  };

  const cerrarBienvenida = (inmediato = false) => {
    if (!montadoRef.current || cierreIniciadoRef.current) return;
    cierreIniciadoRef.current = true;

    cancelarTemporizadoresBienvenida();
    persistirBienvenidaCompletada();

    const sinAnimacion =
      inmediato ||
      prefiereMovimientoReducidoRef.current ||
      (typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (sinAnimacion) {
      setBienvenidaDesvaneciendo(false);
      setBienvenidaCerrada(true);
      return;
    }

    setBienvenidaDesvaneciendo(true);
    fadeTimeoutRef.current = window.setTimeout(() => {
      fadeTimeoutRef.current = null;
      if (!montadoRef.current) return;
      setBienvenidaCerrada(true);
      setBienvenidaDesvaneciendo(false);
    }, 250);
  };

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
      cancelarTemporizadoresBienvenida();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefiereMovimientoReducido(e.matches);
      if (e.matches) {
        setUsarAvatarEstatico(true);
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const handleVideoFinalizado = () => {
    if (!montadoRef.current || cierreIniciadoRef.current) return;
    persistirVideoVisto();
    duracionLecturaMsRef.current = 5000;
    setUsarAvatarEstatico(true);
  };

  const activarFallbackEstatico = () => {
    if (!montadoRef.current || cierreIniciadoRef.current) return;
    persistirVideoVisto();
    duracionLecturaMsRef.current = 4000;
    setUsarAvatarEstatico(true);
  };

  const handleCerrarBienvenida = () => {
    cerrarBienvenida(false);
  };

  useEffect(() => {
    if (esCoordinacion || bienvenidaCerrada) return;

    if (pantallaActiva === 'corcho') {
      bienvenidaMostradaEnCorchoRef.current = true;
      if (!usarAvatarEstatico && !prefiereMovimientoReducido && bienvenidaVideoRef.current) {
        const playPromise = bienvenidaVideoRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // Si el navegador bloquea la reproducción automática, mostrar avatar estático breve y cerrar luego
            activarFallbackEstatico();
          });
        }
      }
    } else if (bienvenidaMostradaEnCorchoRef.current) {
      // Al cambiar a otra sección dentro de la misma sesión, cerrar y evitar que vuelva a mostrarse al regresar
      cerrarBienvenida(true);
    }
  }, [pantallaActiva, esCoordinacion, bienvenidaCerrada, usarAvatarEstatico, prefiereMovimientoReducido]);

  useEffect(() => {
    if (esCoordinacion || bienvenidaCerrada || pantallaActiva !== 'corcho') return;
    if (!usarAvatarEstatico && !prefiereMovimientoReducido) return;

    // Mantener visible el mensaje con el avatar estático durante el tiempo de lectura antes de cerrar
    persistirVideoVisto();
    if (autoCloseTimeoutRef.current === null && !cierreIniciadoRef.current) {
      autoCloseTimeoutRef.current = window.setTimeout(() => {
        autoCloseTimeoutRef.current = null;
        if (!montadoRef.current) return;
        cerrarBienvenida(prefiereMovimientoReducidoRef.current);
      }, duracionLecturaMsRef.current);
    }

    return () => {
      if (autoCloseTimeoutRef.current !== null) {
        window.clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
    };
  }, [pantallaActiva, esCoordinacion, bienvenidaCerrada, usarAvatarEstatico, prefiereMovimientoReducido]);

  const toggleAudio = () => {
    const estado = ambientAudio.toggle(0.18);
    setAudioReproduciendo(estado);
  };

  const agregarMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaMetaInput.trim()) return;
    setMetasCorcho((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, texto: nuevaMetaInput.trim(), completada: false, materia: 'Ciencia de Datos' },
    ]);
    setNuevaMetaInput('');
  };

  const toggleMeta = (id: string) => {
    setMetasCorcho((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completada: !m.completada } : m))
    );
  };

  // --- ESTADO PANTALLA 2: ONBOARDING INICIAL Y MI PERFIL (5 PREGUNTAS) ---
  const tienePerfilGuardado = estudiante.perfilEstudio !== null;
  const totalPasosOnboarding = 5;
  const [pasoOnboarding, setPasoOnboarding] = useState<number>(1);
  const [draftOnboarding, setDraftOnboarding] = useState<{
    horas_trabajo_semanal: string;
    minutos_viaje: string;
    personas_a_cargo: string;
    nivel_estres_percibido: number | null;
    ritmo_estudio: RitmoEstudio | null;
  }>({
    horas_trabajo_semanal: '',
    minutos_viaje: '',
    personas_a_cargo: '',
    nivel_estres_percibido: null,
    ritmo_estudio: null,
  });

  // Campos editables de Mi perfil (cuando ya existe PerfilEstudio recuperado)
  const [horasTrabajoInput, setHorasTrabajoInput] = useState<string>(() =>
    estudiante.perfilEstudio ? String(estudiante.perfilEstudio.horas_trabajo_semanal) : ''
  );
  const [minutosViajeInput, setMinutosViajeInput] = useState<string>(() =>
    estudiante.perfilEstudio ? String(estudiante.perfilEstudio.minutos_viaje) : ''
  );
  const [personasCargoInput, setPersonasCargoInput] = useState<string>(() =>
    estudiante.perfilEstudio ? String(estudiante.perfilEstudio.personas_a_cargo) : ''
  );
  const [estresInput, setEstresInput] = useState<number | null>(() =>
    estudiante.perfilEstudio ? estudiante.perfilEstudio.nivel_estres_percibido : null
  );
  const [ritmoInput, setRitmoInput] = useState<RitmoEstudio | null>(() =>
    estudiante.perfilEstudio ? estudiante.perfilEstudio.ritmo_estudio : null
  );

  const [guardandoPerfil, setGuardandoPerfil] = useState<boolean>(false);
  const [errorGuardadoPerfil, setErrorGuardadoPerfil] = useState<string | null>(null);
  const [confirmacionGuardadoPerfil, setConfirmacionGuardadoPerfil] = useState<string | null>(null);

  // Sincronizar corcho por estudiante y Mi perfil cuando existe perfilEstudio en backend
  useEffect(() => {
    const p = PRESETS_ESTUDIANTES[estudiante.id_usuario] || PRESETS_ESTUDIANTES['est-alex-12'];
    setMetasCorcho(p.metas);
    setPistaActual(p.pistaRecomendada);
    setErrorGuardadoPerfil(null);
    setConfirmacionGuardadoPerfil(null);
    setOnboardingOmitido(false);
    setPasoOnboarding(1);
    setDraftOnboarding({
      horas_trabajo_semanal: '',
      minutos_viaje: '',
      personas_a_cargo: '',
      nivel_estres_percibido: null,
      ritmo_estudio: null,
    });
    if (!esCoordinacion && estudiante.perfilEstudio === null) {
      setPantallaActiva('onboarding');
    }
  }, [estudiante.id_usuario, esCoordinacion]);

  useEffect(() => {
    const perf = estudiante.perfilEstudio;
    if (perf) {
      setHorasTrabajoInput(String(perf.horas_trabajo_semanal));
      setMinutosViajeInput(String(perf.minutos_viaje));
      setPersonasCargoInput(String(perf.personas_a_cargo));
      setEstresInput(perf.nivel_estres_percibido);
      setRitmoInput(perf.ritmo_estudio);
    } else {
      setHorasTrabajoInput('');
      setMinutosViajeInput('');
      setPersonasCargoInput('');
      setEstresInput(null);
      setRitmoInput(null);
    }
  }, [estudiante.id_usuario, estudiante.perfilEstudio?.id_perfil, estudiante.perfilEstudio?.fecha_actualizacion]);

  const opcionesRitmoEstudio: Array<{
    valor: RitmoEstudio;
    titulo: string;
    descripcion: string;
  }> = [
    {
      valor: 'Fragmentado',
      titulo: 'Fragmentado',
      descripcion: 'Fragmentado: varios bloques breves con pausas.',
    },
    {
      valor: 'Regular',
      titulo: 'Regular',
      descripcion: 'Regular: sesiones de duración intermedia.',
    },
    {
      valor: 'Intensivo',
      titulo: 'Intensivo',
      descripcion: 'Intensivo: sesiones más largas cuando dispongo de tiempo.',
    },
  ];

  const validarCampoIndividual = (
    paso: number,
    datos: {
      horas_trabajo_semanal: string;
      minutos_viaje: string;
      personas_a_cargo: string;
      nivel_estres_percibido: number | null;
      ritmo_estudio: RitmoEstudio | null;
    }
  ): string | null => {
    if (paso === 1) {
      const raw = datos.horas_trabajo_semanal.trim();
      if (raw === '') return 'Ingresá cuántas horas por semana trabajás actualmente (indicá 0 si no trabajás).';
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0 || n > 168) {
        return 'Las horas semanales de trabajo deben estar entre 0 y 168.';
      }
      return null;
    }
    if (paso === 2) {
      const raw = datos.minutos_viaje.trim();
      if (raw === '') return 'Ingresá los minutos habituales de un traslado de ida (indicá 0 si cursás a distancia).';
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0 || n > 600) {
        return 'El tiempo de traslado debe estar entre 0 y 600 minutos.';
      }
      return null;
    }
    if (paso === 3) {
      const raw = datos.personas_a_cargo.trim();
      if (raw === '') return 'Ingresá cuántas personas dependen habitualmente de tus cuidados (indicá 0 si corresponde).';
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0 || n > 20) {
        return 'Indicá un número entero entre 0 y 20.';
      }
      return null;
    }
    if (paso === 4) {
      const n = datos.nivel_estres_percibido;
      if (n === null || !Number.isInteger(n) || n < 1 || n > 10) {
        return 'Seleccioná un valor del 1 al 10 para describir tu nivel de estrés.';
      }
      return null;
    }
    if (paso === 5) {
      const r = datos.ritmo_estudio;
      if (r !== 'Fragmentado' && r !== 'Regular' && r !== 'Intensivo') {
        return 'Elegí una opción de ritmo de estudio para continuar.';
      }
      return null;
    }
    return null;
  };

  const ejecutarGuardadoValidado = async (datos: {
    horas_trabajo_semanal: string;
    minutos_viaje: string;
    personas_a_cargo: string;
    nivel_estres_percibido: number | null;
    ritmo_estudio: RitmoEstudio | null;
  }, esOnboardingInicial: boolean) => {
    setErrorGuardadoPerfil(null);
    setConfirmacionGuardadoPerfil(null);

    for (let paso = 1; paso <= 5; paso++) {
      const err = validarCampoIndividual(paso, datos);
      if (err) {
        if (esOnboardingInicial) {
          setPasoOnboarding(paso);
        }
        setErrorGuardadoPerfil(err);
        return;
      }
    }

    setGuardandoPerfil(true);
    try {
      const res = await onActualizarPerfil({
        horas_trabajo_semanal: Number(datos.horas_trabajo_semanal.trim()),
        minutos_viaje: Number(datos.minutos_viaje.trim()),
        personas_a_cargo: Number(datos.personas_a_cargo.trim()),
        nivel_estres_percibido: Number(datos.nivel_estres_percibido),
        ritmo_estudio: datos.ritmo_estudio as RitmoEstudio,
      });

      if (res && res.ok === false) {
        setErrorGuardadoPerfil(
          res.error || 'No se pudieron guardar tus cambios. Tus datos anteriores se conservan.'
        );
        return;
      }

      setOnboardingOmitido(false);
      setConfirmacionGuardadoPerfil(
        esOnboardingInicial
          ? 'Tu perfil se guardó correctamente. Podés actualizar estas respuestas cuando lo necesites.'
          : 'Cambios guardados correctamente.'
      );
    } catch (err: any) {
      setErrorGuardadoPerfil(
        err?.message || 'No se pudieron guardar tus cambios. Verificá tu conexión e intentá nuevamente.'
      );
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const handleOmitirOnboarding = () => {
    setErrorGuardadoPerfil(null);
    setConfirmacionGuardadoPerfil(null);
    setOnboardingOmitido(true);
    setPantallaActiva('corcho');
  };

  const formatearFechaPerfil = (iso?: string | null): string | null => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- ESTADO PANTALLA 3: PLAN DE CURSADA & TEMPORIZADOR ADAPTATIVO ---
  const [duracionMinutos, setDuracionMinutos] = useState(25);
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);
  const [timerActivo, setTimerActivo] = useState(false);
  const [modoFoco, setModoFoco] = useState<'Enfoque Suave' | 'Micro-Bloque (15 min)' | 'Pausa Reparadora (5 min)'>('Enfoque Suave');

  useEffect(() => {
    let interval: any = null;
    if (timerActivo && segundosRestantes > 0) {
      interval = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    } else if (segundosRestantes === 0 && timerActivo) {
      setTimerActivo(false);
      ambientAudio.stop();
      setAudioReproduciendo(false);
    }
    return () => clearInterval(interval);
  }, [timerActivo, segundosRestantes]);

  const cambiarModoTimer = (min: number, nombre: 'Enfoque Suave' | 'Micro-Bloque (15 min)' | 'Pausa Reparadora (5 min)') => {
    setTimerActivo(false);
    setDuracionMinutos(min);
    setSegundosRestantes(min * 60);
    setModoFoco(nombre);
  };

  const toggleTimer = () => {
    setTimerActivo(!timerActivo);
    if (!timerActivo && audioReproduciendo === false) {
      // Activar lluvia suave automáticamente al enfocar
      ambientAudio.playRain(0.12);
      setAudioReproduciendo(true);
    }
  };

  const resetTimer = () => {
    setTimerActivo(false);
    setSegundosRestantes(duracionMinutos * 60);
  };

  const formatearTiempo = (seg: number) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- ESTADO PANTALLA 4: CHAT CON DOC & DESGLOSE ---
  const [mensajeInput, setMensajeInput] = useState('');
  const [modoDOC, setModoDOC] = useState<ModoDOC>('motivacion');
  const [textoParaDesglose, setTextoParaDesglose] = useState(
    'En el entrenamiento de redes neuronales artificiales, el algoritmo de retropropagación (backpropagation) calcula el gradiente de la función de pérdida con respecto a los pesos sinápticos mediante la regla de la cadena, permitiendo ajustar los hiperparámetros capa por capa.'
  );
  const [desgloseResultado, setDesgloseResultado] = useState('');
  const [desglosando, setDesglosando] = useState(false);

  const handleEnviarChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensajeInput.trim() || cargandoDOC) return;
    const txt = mensajeInput;
    setMensajeInput('');
    await onEnviarMensajeDOC(txt, modoDOC);
  };

  const handleEjecutarDesglose = async () => {
    let texto = textoParaDesglose.trim();
    if (!texto) {
      texto =
        'En el entrenamiento de redes neuronales artificiales, el algoritmo de retropropagación (backpropagation) calcula el gradiente de la función de pérdida con respecto a los pesos sinápticos mediante la regla de la cadena, permitiendo ajustar los hiperparámetros capa por capa.';
      setTextoParaDesglose(texto);
    }
    if (desglosando) return;
    setDesglosando(true);
    try {
      const res = await onDesglosarTextoDOC(texto, 'Inteligencia Artificial I');
      setDesgloseResultado(res);
    } catch (err) {
      setDesgloseResultado(
        '🎯 Concepto Clave: El algoritmo de retropropagación calcula cómo varía el error respecto a cada peso para corregirlo en sentido inverso.\n💡 Ejemplo Cotidiano: Es como ajustar el volumen de cada instrumento en una consola de sonido tras escuchar cómo suena la mezcla final.\n🚀 Micro-Acción para Hoy: Dibuja un esquema de 3 capas (entrada, oculta, salida) y anota dónde se calcula el error antes de descansar. ¡Listo por hoy!'
      );
    } finally {
      setDesglosando(false);
    }
  };

  const avatarDOC = '/assets/doce/doc_avatar_oficial.jpg';

  const handleAbrirAsistenteDOC = () => {
    setPantallaActiva('doc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Barra de Navegación del Catálogo de 5 Pantallas del Estudiante */}
      <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-2.5 sm:p-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 px-1 lg:px-0">
            <span className="font-serif font-bold text-[#263A50] text-sm flex items-center space-x-1.5">
              <span>DOCE Estudiante</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Secciones del estudiante"
            className="w-full lg:w-auto grid grid-cols-2 md:flex md:items-center gap-1 bg-[#EEE7D7]/70 p-1 rounded-xl border border-[#E2DBCF] text-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={pantallaActiva === 'corcho'}
              onClick={() => setPantallaActiva('corcho')}
              className={`min-h-[44px] md:min-h-[34px] px-2.5 md:px-3.5 py-2 md:py-1.5 rounded-lg font-medium transition-all flex items-center justify-center text-center leading-tight md:whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                pantallaActiva === 'corcho'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>Inicio</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={pantallaActiva === 'onboarding'}
              onClick={() => setPantallaActiva('onboarding')}
              className={`min-h-[44px] md:min-h-[34px] px-2.5 md:px-3.5 py-2 md:py-1.5 rounded-lg font-medium transition-all flex items-center justify-center text-center leading-tight md:whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                pantallaActiva === 'onboarding'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>Mi perfil</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={pantallaActiva === 'cursada_foco'}
              onClick={() => setPantallaActiva('cursada_foco')}
              className={`min-h-[44px] md:min-h-[34px] px-2.5 md:px-3.5 py-2 md:py-1.5 rounded-lg font-medium transition-all flex items-center justify-center text-center leading-tight md:whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                pantallaActiva === 'cursada_foco'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>Cursada y foco</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={pantallaActiva === 'gamificacion'}
              onClick={() => setPantallaActiva('gamificacion')}
              className={`min-h-[44px] md:min-h-[34px] px-2.5 md:px-3.5 py-2 md:py-1.5 rounded-lg font-medium transition-all flex items-center justify-center text-center leading-tight md:whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                pantallaActiva === 'gamificacion'
                  ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                  : 'text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1]'
              }`}
            >
              <span>Mis avances</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANTALLA 1: HOME — TABLERO DE CORCHO VIRTUAL (MOODBOARD INSPIRADOR)        */}
      {/* ========================================================================= */}
      {pantallaActiva === 'corcho' && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
          {/* Header empático o institucional según rol (En Coordinación no dar bienvenida) */}
          <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2 min-w-0">
              <div className="flex items-center space-x-2">
                {esCoordinacion ? (
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#819783] shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8863A] shrink-0" />
                )}
                <span className="text-[11px] sm:text-xs uppercase font-bold text-[#819783] tracking-wider leading-snug">
                  {esCoordinacion
                    ? 'Supervisión Institucional · Coordinación General IFTS N.º 12'
                    : 'Tu espacio de estudio · IFTS N.º 12'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#263A50] leading-tight break-words">
                {esCoordinacion ? (
                  <span>Supervisión de Trayectoria: {estudiante.nombre}</span>
                ) : (
                  <span>Hola, {estudiante.nombre.split(' ')[0]}</span>
                )}
                <span className="inline-block w-2 h-2 rounded-full bg-[#819783] ml-2.5 align-middle" />
              </h1>
              <p className="text-xs sm:text-sm text-[#586879] max-w-2xl leading-relaxed">
                {esCoordinacion
                  ? 'Panel de supervisión pedagógica institucional. Auditoría del avance curricular, metas de estudio y factores de permanencia sin intervención punitiva.'
                  : 'Organizá tus actividades y avanzá a tu ritmo, sumando pequeños logros durante la semana.'}
              </p>
            </div>

            {/* Selector de pantalla rápida / estado */}
            <div className="w-full md:w-auto bg-[#FAF8F1] border border-[#E5DFD3] rounded-2xl p-3.5 sm:p-4 flex items-center space-x-3.5 sm:space-x-4 shrink-0 shadow-xs">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center shrink-0">
                {esCoordinacion ? (
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                ) : (
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#263A50]">
                  {esCoordinacion ? 'Caso Académico Auditado' : presetActivo.momentoSugerido}
                </div>
                <div className="text-[11px] text-[#586879] leading-snug">
                  {esCoordinacion ? `Legajo ${estudiante.legajo}` : presetActivo.tiempoSugerido}
                </div>
                <div className="text-[10px] text-[#819783] font-medium flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783] shrink-0" />
                  <span className="truncate">
                    {esCoordinacion
                      ? estudiante.carrera.replace('Tecnicatura en ', '').replace('Tecnicatura Superior en ', '')
                      : `Estilo: ${estudiante.estilo_aprendizaje}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta breve y discreta de bienvenida de DOC (cierre automático al finalizar el video o tras breve lapso en modo estático) */}
          {!esCoordinacion && !bienvenidaCerrada && (
            <section
              aria-label="Bienvenida de DOC"
              className={`bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl p-4 sm:p-5 shadow-xs flex items-start sm:items-center justify-between gap-4 ${
                prefiereMovimientoReducido ? '' : 'transition-opacity duration-250 ease-out'
              } ${bienvenidaDesvaneciendo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden border border-[#E5DFD3] bg-[#EEE7D7]/50 shrink-0 shadow-xs">
                  {usarAvatarEstatico || prefiereMovimientoReducido ? (
                    <img
                      src={avatarDOC}
                      alt="DOC, tu compañero de estudio"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      ref={bienvenidaVideoRef}
                      src="/assets/doce/doc_bienvenida.mp4"
                      poster={avatarDOC}
                      muted
                      playsInline
                      autoPlay
                      preload="metadata"
                      onEnded={handleVideoFinalizado}
                      onError={activarFallbackEstatico}
                      aria-label="Animación breve de bienvenida de DOC"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="space-y-1.5 min-w-0 py-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#819783] shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#819783]">
                      DOC · Tu Compañero de Estudio
                    </span>
                  </div>
                  <p className="font-serif text-sm sm:text-base text-[#263A50] leading-relaxed">
                    «Hola, soy DOC. Estoy acá para ayudarte a organizar tu estudio, un paso a la vez».
                  </p>
                  <p className="text-[11px] text-[#586879]">
                    Cuando quieras, podés escribirme para ordenar tus entregas o repasar un tema.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCerrarBienvenida}
                aria-label="Omitir bienvenida de DOC"
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[11px] font-medium text-[#586879] hover:text-[#263A50] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#819783]"
              >
                <span className="hidden sm:inline">Omitir</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </section>
          )}

          {/* El Tablero de Corcho Virtual (Textura cálida con notas adhesivas) */}
          <div className="relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 bg-[#DCD4C4] border-4 sm:border-8 border-[#C5BBA7] shadow-inner space-y-4 sm:space-y-6">
            {/* Chinchetas en esquinas del marco (simplificadas en celular) */}
            <div className="hidden sm:block absolute top-3 left-3 w-3 h-3 rounded-full bg-[#819783] border-2 border-white shadow-xs" />
            <div className="hidden sm:block absolute top-3 right-3 w-3 h-3 rounded-full bg-[#819783] border-2 border-white shadow-xs" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#C5BBA7]/60">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold text-[#263A50] uppercase tracking-wider min-w-0">
                <span>Tablero personal</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-[#586879] font-normal normal-case">
                  Mis actividades de esta semana
                </span>
              </div>
              <span className="self-start sm:self-auto shrink-0 text-[11px] text-[#263A50] bg-white/75 px-2.5 py-0.5 rounded-full border border-[#C5BBA7]">
                Semana 8 · 1° Cuatrimestre
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
              {/* Nota Adhesiva 1: Tus Metas de Estudio (Amarillo suave con chincheta) */}
              <div className="md:col-span-6 bg-[#FEF9E7] border border-[#F9E79F] rounded-2xl p-4 sm:p-6 shadow-md relative md:transform md:-rotate-0.5 md:hover:rotate-0 transition-transform">
                <div className="hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#B85D43] border border-white shadow-xs" />
                <div className="flex items-center space-x-2 mb-3">
                  <Coffee className="w-4 h-4 text-[#B8863A] shrink-0" />
                  <h3 className="font-serif text-base font-bold text-[#263A50]">
                    Tus metas de estudio
                  </h3>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-4">
                  {metasCorcho.map((meta) => (
                    <label
                      key={meta.id}
                      className="flex items-start gap-3 p-2.5 min-h-[44px] rounded-xl hover:bg-[#FAF8F1] active:bg-[#FAF8F1] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={meta.completada}
                        onChange={() => toggleMeta(meta.id)}
                        className="w-5 h-5 sm:w-4 sm:h-4 mt-0.5 accent-[#819783] rounded cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                        <span
                          className={`text-sm sm:text-xs leading-snug break-words ${
                            meta.completada
                              ? 'line-through text-[#8C98A4]'
                              : 'text-[#263A50] font-medium'
                          }`}
                        >
                          {meta.texto}
                        </span>
                        <span className="text-[11px] sm:text-[10px] text-[#586879] font-mono sm:text-right sm:shrink-0">
                          {meta.materia}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <form onSubmit={agregarMeta} className="flex items-center gap-2 pt-3 border-t border-[#F9E79F]">
                  <input
                    type="text"
                    value={nuevaMetaInput}
                    onChange={(e) => setNuevaMetaInput(e.target.value)}
                    placeholder="Agregar una nueva meta..."
                    aria-label="Nueva meta de estudio"
                    className="min-w-0 flex-1 min-h-[44px] sm:min-h-[38px] px-3.5 py-2 sm:py-1.5 text-sm sm:text-xs bg-[#FAF8F1] border border-[#F0E6BD] rounded-xl text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden focus:border-[#819783]"
                  />
                  <button
                    type="submit"
                    aria-label="Agregar meta"
                    className="min-w-[44px] min-h-[44px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center rounded-xl bg-[#263A50] text-white hover:bg-[#1E2E40] cursor-pointer shrink-0 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Nota Adhesiva 2: Micro-Victorias (Verde sabio suave) */}
              <div className="md:col-span-6 bg-[#EBF1EC] border border-[#CDE0D0] rounded-2xl p-4 sm:p-6 shadow-md relative md:transform md:rotate-0.5 md:hover:rotate-0 transition-transform flex flex-col justify-between">
                <div className="hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#819783] border border-white shadow-xs" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Award className="w-4 h-4 text-[#819783] shrink-0" />
                      <h3 className="font-serif text-base font-bold text-[#263A50]">
                        Logros de la semana
                      </h3>
                      <span className="text-[10px] font-medium text-[#586879] bg-white/70 px-1.5 py-0.5 rounded border border-[#CDE0D0]">
                        Ejemplo
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#819783] bg-white px-2.5 py-0.5 rounded-md border border-[#CDE0D0] shrink-0">
                      {presetActivo.microVictorias.porcentaje}%
                    </span>
                  </div>

                  <p className="text-xs text-[#586879] mb-4 leading-relaxed">
                    {presetActivo.microVictorias.motivacion}
                  </p>

                  <div className="bg-white/80 p-3.5 rounded-xl border border-[#CDE0D0] flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#819783] text-white flex items-center justify-center shrink-0 text-lg">
                      🌱
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#263A50]">
                        Avance semanal: {presetActivo.microVictorias.porcentaje}%
                      </div>
                      <div className="text-[11px] text-[#819783] font-semibold leading-snug">
                        {presetActivo.microVictorias.mensaje}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-[11px] text-[#586879] pt-2.5 border-t border-[#CDE0D0]">
                  <span>{presetActivo.microVictorias.detalle}</span>
                  <button
                    onClick={() => setPantallaActiva('gamificacion')}
                    className="min-h-[44px] sm:min-h-0 px-2 -mr-2 text-[#263A50] font-bold hover:underline inline-flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <span>Ver mis avances</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              </div>

              {/* Widget de Audio Ambiental: Lo-Fi Beats & Lluvia */}
              <div className="md:col-span-7 bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center shrink-0 shadow-xs">
                    <Headphones className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] sm:text-xs uppercase font-bold text-[#819783] tracking-wider">
                      Sonido ambiente · Lo-Fi
                    </div>
                    <div className="text-sm font-serif font-bold text-[#263A50] leading-snug break-words">
                      {audioReproduciendo ? 'Sonando ahora:' : 'Pista elegida:'} “{pistaActual}”
                    </div>
                    <div className="text-[11px] text-[#586879] flex items-center space-x-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#819783] animate-pulse shrink-0" />
                      <span>Sonido suave para ayudarte a concentrar</span>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2.5 pt-2.5 border-t border-[#F0EBE0] lg:pt-0 lg:border-t-0">
                  <div className="flex items-center flex-wrap gap-1.5">
                    {(['Tarde lluviosa', 'Café de estudio', 'Ondas Alpha'] as const).map((pista) => (
                      <button
                        key={pista}
                        onClick={() => {
                          setPistaActual(pista);
                          if (!audioReproduciendo) toggleAudio();
                        }}
                        className={`min-h-[40px] sm:min-h-[32px] px-2.5 py-1.5 sm:py-1 rounded-lg text-xs sm:text-[10px] font-medium border cursor-pointer transition-colors ${
                          pistaActual === pista
                            ? 'bg-[#EEE7D7] text-[#263A50] border-[#DDD4C0]'
                            : 'bg-[#FAF8F1] sm:bg-white text-[#586879] border-[#E5DFD3] sm:border-transparent hover:bg-[#FAF8F1]'
                        }`}
                      >
                        {pista.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={toggleAudio}
                    aria-label={audioReproduciendo ? 'Pausar audio ambiental' : 'Reproducir audio ambiental'}
                    className={`w-11 h-11 min-w-[44px] min-h-[44px] sm:w-10 sm:h-10 sm:min-w-[40px] sm:min-h-[40px] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
                      audioReproduciendo
                        ? 'bg-[#819783] text-white hover:bg-[#6E8370]'
                        : 'bg-[#263A50] text-white hover:bg-[#1E2E40]'
                    }`}
                    title={audioReproduciendo ? 'Pausar audio' : 'Reproducir audio ambiental'}
                  >
                    {audioReproduciendo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* Menú de Accesos Directos Integrado */}
              <div className="md:col-span-5 bg-[#FAF8F1] border border-[#DDD4C0] rounded-2xl p-3.5 sm:p-4 shadow-md flex flex-col justify-between">
                <div className="text-[11px] uppercase font-bold text-[#819783] tracking-wider mb-2.5 px-0.5">
                  Accesos rápidos
                </div>
                <div className="grid grid-cols-2 gap-2.5 items-stretch">
                  <button
                    type="button"
                    onClick={() => setPantallaActiva('cursada_foco')}
                    className="min-h-[68px] p-2.5 rounded-xl bg-white/75 hover:bg-white active:bg-white border border-[#E5DFD3]/80 flex flex-col items-center justify-center space-y-1.5 text-xs text-[#263A50] font-semibold hover:text-[#819783] transition-colors cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] flex items-center justify-center shadow-xs">
                      <BookOpen className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <span className="leading-tight">Plan Cursada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPantallaActiva('onboarding')}
                    className="min-h-[68px] p-2.5 rounded-xl bg-white/75 hover:bg-white active:bg-white border border-[#E5DFD3]/80 flex flex-col items-center justify-center space-y-1.5 text-xs text-[#263A50] font-semibold hover:text-[#819783] transition-colors cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F1] border border-[#E5DFD3] flex items-center justify-center shadow-xs">
                      <Compass className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <span className="leading-tight">Mi perfil</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 2: ONBOARDING INICIAL Y MI PERFIL                                */}
      {/* ========================================================================= */}
      {pantallaActiva === 'onboarding' && (
        <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-300">
          {!tienePerfilGuardado ? (
            /* EXPERIENCIA A: ONBOARDING INICIAL (5 PREGUNTAS, SIN VALORES FICTICIOS) */
            <section
              aria-label="Cuestionario inicial de perfil"
              className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs space-y-6"
            >
              <div className="space-y-2 pb-4 border-b border-[#F0EBE0]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EBF1EC] text-[#263A50] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                    <span>DOCE · Primeros pasos</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleOmitirOnboarding}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1] border border-transparent hover:border-[#E5DFD3] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50]"
                  >
                    Omitir por ahora
                  </button>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#263A50] pt-1">
                  Contanos un poco sobre tu cursada
                </h2>
                <p className="text-xs sm:text-sm text-[#586879] leading-relaxed">
                  Estas respuestas nos ayudan a adaptar las herramientas de estudio a tus horarios y necesidades. Podés actualizarlas más adelante desde Mi perfil. Completar el cuestionario es voluntario.
                </p>
              </div>

              {/* Progreso real 1 a 5 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#586879]">
                  <span className="font-semibold text-[#263A50]">
                    Pregunta {pasoOnboarding} de {totalPasosOnboarding}
                  </span>
                  <span>{Math.round((pasoOnboarding / totalPasosOnboarding) * 100)}%</span>
                </div>
                <div
                  className="w-full h-2 bg-[#EEE7D7] rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pasoOnboarding}
                  aria-valuemin={1}
                  aria-valuemax={totalPasosOnboarding}
                >
                  <div
                    className="h-full bg-[#819783] transition-all duration-300"
                    style={{ width: `${(pasoOnboarding / totalPasosOnboarding) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pregunta activa */}
              <div className="space-y-4">
                {pasoOnboarding === 1 && (
                  <div className="space-y-3">
                    <label
                      htmlFor="onb-horas-trabajo"
                      className="block font-serif text-lg sm:text-xl font-bold text-[#263A50]"
                    >
                      ¿Cuántas horas por semana trabajás actualmente?
                    </label>
                    <p id="onb-horas-ayuda" className="text-xs sm:text-sm text-[#586879]">
                      Ingresá un valor entre 0 y 168. El valor 0 significa que no trabajás actualmente.
                    </p>
                    <input
                      id="onb-horas-trabajo"
                      type="number"
                      min={0}
                      max={168}
                      step="any"
                      inputMode="decimal"
                      aria-describedby="onb-horas-ayuda"
                      value={draftOnboarding.horas_trabajo_semanal}
                      onChange={(e) => {
                        setErrorGuardadoPerfil(null);
                        setDraftOnboarding((prev) => ({
                          ...prev,
                          horas_trabajo_semanal: e.target.value,
                        }));
                      }}
                      placeholder="Ej.: 0, 20 o 40"
                      className="w-full sm:max-w-xs min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#DDD4C0] text-sm font-medium text-[#263A50] focus:outline-none focus:ring-2 focus:ring-[#819783]"
                    />
                  </div>
                )}

                {pasoOnboarding === 2 && (
                  <div className="space-y-3">
                    <label
                      htmlFor="onb-minutos-viaje"
                      className="block font-serif text-lg sm:text-xl font-bold text-[#263A50]"
                    >
                      ¿Cuántos minutos te lleva habitualmente un traslado para cursar?
                    </label>
                    <p id="onb-viaje-ayuda" className="text-xs sm:text-sm text-[#586879]">
                      Considerá un trayecto de ida. Si cursás a distancia y no te trasladás, podés indicar 0 (máximo 600).
                    </p>
                    <input
                      id="onb-minutos-viaje"
                      type="number"
                      min={0}
                      max={600}
                      step="any"
                      inputMode="decimal"
                      aria-describedby="onb-viaje-ayuda"
                      value={draftOnboarding.minutos_viaje}
                      onChange={(e) => {
                        setErrorGuardadoPerfil(null);
                        setDraftOnboarding((prev) => ({
                          ...prev,
                          minutos_viaje: e.target.value,
                        }));
                      }}
                      placeholder="Ej.: 0, 35 o 90"
                      className="w-full sm:max-w-xs min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#DDD4C0] text-sm font-medium text-[#263A50] focus:outline-none focus:ring-2 focus:ring-[#819783]"
                    />
                  </div>
                )}

                {pasoOnboarding === 3 && (
                  <div className="space-y-3">
                    <label
                      htmlFor="onb-personas-cargo"
                      className="block font-serif text-lg sm:text-xl font-bold text-[#263A50]"
                    >
                      ¿Cuántas personas dependen habitualmente de tus cuidados?
                    </label>
                    <p id="onb-personas-ayuda" className="text-xs sm:text-sm text-[#586879]">
                      Indicá un número entero entre 0 y 20. No hace falta detallar tu situación familiar.
                    </p>
                    <input
                      id="onb-personas-cargo"
                      type="number"
                      min={0}
                      max={20}
                      step={1}
                      inputMode="numeric"
                      aria-describedby="onb-personas-ayuda"
                      value={draftOnboarding.personas_a_cargo}
                      onChange={(e) => {
                        setErrorGuardadoPerfil(null);
                        setDraftOnboarding((prev) => ({
                          ...prev,
                          personas_a_cargo: e.target.value,
                        }));
                      }}
                      placeholder="Ej.: 0, 1 o 2"
                      className="w-full sm:max-w-xs min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF8F1] border border-[#DDD4C0] text-sm font-medium text-[#263A50] focus:outline-none focus:ring-2 focus:ring-[#819783]"
                    />
                  </div>
                )}

                {pasoOnboarding === 4 && (
                  <div className="space-y-3">
                    <div className="font-serif text-lg sm:text-xl font-bold text-[#263A50]">
                      En estos días, ¿cómo describirías tu nivel de estrés?
                    </div>
                    <p className="text-xs sm:text-sm text-[#586879]">
                      Escala del 1 al 10 (1 = Muy bajo · 10 = Muy alto). Es una percepción personal, no una evaluación médica ni un diagnóstico.
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Nivel de estrés percibido del 1 al 10"
                      className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((valor) => {
                        const seleccionado = draftOnboarding.nivel_estres_percibido === valor;
                        return (
                          <button
                            key={valor}
                            type="button"
                            role="radio"
                            aria-checked={seleccionado}
                            onClick={() => {
                              setErrorGuardadoPerfil(null);
                              setDraftOnboarding((prev) => ({
                                ...prev,
                                nivel_estres_percibido: valor,
                              }));
                            }}
                            className={`min-h-[44px] rounded-xl text-sm font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                              seleccionado
                                ? 'bg-[#263A50] border-[#263A50] text-[#FAF8F1] shadow-xs'
                                : 'bg-[#FAF8F1] border-[#DDD4C0] text-[#263A50] hover:bg-[#EEE7D7]'
                            }`}
                          >
                            {valor}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[11px] text-[#586879] pt-0.5">
                      <span>1 = Muy bajo</span>
                      <span>10 = Muy alto</span>
                    </div>
                  </div>
                )}

                {pasoOnboarding === 5 && (
                  <div className="space-y-3">
                    <div className="font-serif text-lg sm:text-xl font-bold text-[#263A50]">
                      ¿Qué ritmo preferís para organizar tus momentos de estudio?
                    </div>
                    <div role="radiogroup" aria-label="Ritmo de estudio preferido" className="space-y-2.5 pt-1">
                      {opcionesRitmoEstudio.map((op) => {
                        const seleccionado = draftOnboarding.ritmo_estudio === op.valor;
                        return (
                          <button
                            key={op.valor}
                            type="button"
                            role="radio"
                            aria-checked={seleccionado}
                            onClick={() => {
                              setErrorGuardadoPerfil(null);
                              setDraftOnboarding((prev) => ({
                                ...prev,
                                ritmo_estudio: op.valor,
                              }));
                            }}
                            className={`w-full min-h-[52px] p-4 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                              seleccionado
                                ? 'bg-[#EBF1EC] border-[#819783] text-[#263A50] shadow-xs'
                                : 'bg-[#FAF8F1] border-[#E5DFD3] hover:bg-[#F2ECE0] text-[#263A50]'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="text-sm font-semibold">{op.titulo}</div>
                              <div className="text-xs text-[#586879]">{op.descripcion}</div>
                            </div>
                            {seleccionado && <Check className="w-5 h-5 text-[#819783] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mensajes de validación o error de servidor */}
              {errorGuardadoPerfil && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-[#D8B4A6] bg-[#FBF2EE] px-4 py-3 text-xs text-[#7B3421] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-[#B85D43] shrink-0 mt-0.5" />
                  <span>{errorGuardadoPerfil}</span>
                </div>
              )}

              {/* Controles de navegación entre pasos */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F0EBE0]">
                <button
                  type="button"
                  disabled={pasoOnboarding <= 1 || guardandoPerfil}
                  onClick={() => {
                    setErrorGuardadoPerfil(null);
                    setPasoOnboarding((p) => Math.max(1, p - 1));
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-[#586879] hover:text-[#263A50] hover:bg-[#FAF8F1] disabled:opacity-35 cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center space-x-1.5" aria-label="Ir a paso">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      disabled={guardandoPerfil}
                      onClick={() => {
                        if (n <= pasoOnboarding) {
                          setErrorGuardadoPerfil(null);
                          setPasoOnboarding(n);
                        } else {
                          const err = validarCampoIndividual(pasoOnboarding, draftOnboarding);
                          if (err) {
                            setErrorGuardadoPerfil(err);
                            return;
                          }
                          setErrorGuardadoPerfil(null);
                          setPasoOnboarding(n);
                        }
                      }}
                      aria-label={`Pregunta ${n}`}
                      aria-current={pasoOnboarding === n ? 'step' : undefined}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                        pasoOnboarding === n
                          ? 'bg-[#263A50] text-white'
                          : 'bg-[#FAF8F1] border border-[#E5DFD3] text-[#586879] hover:bg-[#EEE7D7]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {pasoOnboarding < totalPasosOnboarding ? (
                  <button
                    type="button"
                    disabled={guardandoPerfil}
                    onClick={() => {
                      const err = validarCampoIndividual(pasoOnboarding, draftOnboarding);
                      if (err) {
                        setErrorGuardadoPerfil(err);
                        return;
                      }
                      setErrorGuardadoPerfil(null);
                      setPasoOnboarding((p) => Math.min(totalPasosOnboarding, p + 1));
                    }}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[#263A50] text-white text-xs font-semibold hover:bg-[#1E2E40] cursor-pointer flex items-center space-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50]"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={guardandoPerfil}
                    onClick={() => ejecutarGuardadoValidado(draftOnboarding, true)}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[#819783] hover:bg-[#6E8370] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer flex items-center space-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50]"
                  >
                    <span>{guardandoPerfil ? 'Guardando...' : 'Guardar mi perfil'}</span>
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </section>
          ) : (
            /* EXPERIENCIA B: MI PERFIL EDITABLE (CUANDO YA EXISTE PerfilEstudio) */
            <section
              aria-label="Mi perfil de estudio"
              className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs space-y-6"
            >
              <div className="space-y-2 pb-4 border-b border-[#F0EBE0]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EBF1EC] text-[#263A50] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                    <span>Mi perfil</span>
                  </span>
                  {formatearFechaPerfil(estudiante.perfilEstudio?.fecha_actualizacion) && (
                    <span className="text-[11px] text-[#586879]">
                      Última actualización: {formatearFechaPerfil(estudiante.perfilEstudio?.fecha_actualizacion)}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#263A50] pt-1">
                  Tus preferencias y tiempos de cursada
                </h2>
                <p className="text-xs sm:text-sm text-[#586879] leading-relaxed">
                  Estas respuestas nos ayudan a adaptar las herramientas de estudio a tus horarios y necesidades. Podés revisarlas y actualizarlas en cualquier momento.
                </p>
              </div>

              <div className="space-y-5">
                {/* 1. Horas de trabajo */}
                <div className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-2">
                  <label htmlFor="perfil-horas-trabajo" className="block text-sm font-semibold text-[#263A50]">
                    ¿Cuántas horas por semana trabajás actualmente?
                  </label>
                  <p id="perfil-horas-ayuda" className="text-xs text-[#586879]">
                    Valor entre 0 y 168. El valor 0 significa que no trabajás actualmente.
                  </p>
                  <input
                    id="perfil-horas-trabajo"
                    type="number"
                    min={0}
                    max={168}
                    step="any"
                    inputMode="decimal"
                    aria-describedby="perfil-horas-ayuda"
                    value={horasTrabajoInput}
                    onChange={(e) => {
                      setErrorGuardadoPerfil(null);
                      setConfirmacionGuardadoPerfil(null);
                      setHorasTrabajoInput(e.target.value);
                    }}
                    className="w-full sm:max-w-xs min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#DDD4C0] text-sm font-medium text-[#263A50] focus:outline-none focus:ring-2 focus:ring-[#819783]"
                  />
                </div>

                {/* 2. Traslado */}
                <div className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-2">
                  <label htmlFor="perfil-minutos-viaje" className="block text-sm font-semibold text-[#263A50]">
                    ¿Cuántos minutos te lleva habitualmente un traslado para cursar?
                  </label>
                  <p id="perfil-viaje-ayuda" className="text-xs text-[#586879]">
                    Considerá un trayecto de ida. Si cursás a distancia y no te trasladás, podés indicar 0 (0 a 600).
                  </p>
                  <input
                    id="perfil-minutos-viaje"
                    type="number"
                    min={0}
                    max={600}
                    step="any"
                    inputMode="decimal"
                    aria-describedby="perfil-viaje-ayuda"
                    value={minutosViajeInput}
                    onChange={(e) => {
                      setErrorGuardadoPerfil(null);
                      setConfirmacionGuardadoPerfil(null);
                      setMinutosViajeInput(e.target.value);
                    }}
                    className="w-full sm:max-w-xs min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#DDD4C0] text-sm font-medium text-[#263A50] focus:outline-none focus:ring-2 focus:ring-[#819783]"
                  />
                </div>

                {/* 3. Personas a cargo */}
                <div className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-2">
                  <label htmlFor="perfil-personas-cargo" className="block text-sm font-semibold text-[#263A50]">
                    ¿Cuántas personas dependen habitualmente de tus cuidados?
                  </label>
                  <p id="perfil-personas-ayuda" className="text-xs text-[#586879]">
                    Número entero entre 0 y 20.
                  </p>
                  <input
                    id="perfil-personas-cargo"
                    type="number"
                    min={0}
                    max={20}
                    step={1}
                    inputMode="numeric"
                    aria-describedby="perfil-personas-ayuda"
                    value={personasCargoInput}
                    onChange={(e) => {
                      setErrorGuardadoPerfil(null);
                      setConfirmacionGuardadoPerfil(null);
                      setPersonasCargoInput(e.target.value);
                    }}
                    className="w-full sm:max-w-xs min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#DDD4C0] text-sm font-medium text-[#263A50] focus:outline-none focus:ring-2 focus:ring-[#819783]"
                  />
                </div>

                {/* 4. Nivel de estrés percibido */}
                <div className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-2.5">
                  <div className="text-sm font-semibold text-[#263A50]">
                    En estos días, ¿cómo describirías tu nivel de estrés?
                  </div>
                  <p className="text-xs text-[#586879]">
                    1 = Muy bajo · 10 = Muy alto. Es una percepción personal, no una evaluación médica ni un diagnóstico.
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Nivel de estrés percibido del 1 al 10"
                    className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-1"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((valor) => {
                      const seleccionado = estresInput === valor;
                      return (
                        <button
                          key={valor}
                          type="button"
                          role="radio"
                          aria-checked={seleccionado}
                          onClick={() => {
                            setErrorGuardadoPerfil(null);
                            setConfirmacionGuardadoPerfil(null);
                            setEstresInput(valor);
                          }}
                          className={`min-h-[44px] rounded-xl text-sm font-semibold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                            seleccionado
                              ? 'bg-[#263A50] border-[#263A50] text-[#FAF8F1] shadow-xs'
                              : 'bg-white border-[#DDD4C0] text-[#263A50] hover:bg-[#EEE7D7]'
                          }`}
                        >
                          {valor}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Ritmo de estudio */}
                <div className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-2.5">
                  <div className="text-sm font-semibold text-[#263A50]">
                    ¿Qué ritmo preferís para organizar tus momentos de estudio?
                  </div>
                  <div role="radiogroup" aria-label="Ritmo de estudio preferido" className="space-y-2 pt-1">
                    {opcionesRitmoEstudio.map((op) => {
                      const seleccionado = ritmoInput === op.valor;
                      return (
                        <button
                          key={op.valor}
                          type="button"
                          role="radio"
                          aria-checked={seleccionado}
                          onClick={() => {
                            setErrorGuardadoPerfil(null);
                            setConfirmacionGuardadoPerfil(null);
                            setRitmoInput(op.valor);
                          }}
                          className={`w-full min-h-[48px] p-3.5 rounded-xl text-left border transition-all flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50] ${
                            seleccionado
                              ? 'bg-[#EBF1EC] border-[#819783] text-[#263A50] shadow-xs'
                              : 'bg-white border-[#E5DFD3] hover:bg-[#F2ECE0] text-[#263A50]'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs sm:text-sm font-semibold">{op.titulo}</div>
                            <div className="text-xs text-[#586879]">{op.descripcion}</div>
                          </div>
                          {seleccionado && <Check className="w-4 h-4 text-[#819783] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {errorGuardadoPerfil && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-[#D8B4A6] bg-[#FBF2EE] px-4 py-3 text-xs text-[#7B3421] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-[#B85D43] shrink-0 mt-0.5" />
                  <span>{errorGuardadoPerfil}</span>
                </div>
              )}

              {confirmacionGuardadoPerfil && !errorGuardadoPerfil && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-[#C6D9C7] bg-[#EBF1EC] px-4 py-3 text-xs text-[#263A50] flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#819783] shrink-0" />
                  <span>{confirmacionGuardadoPerfil}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  disabled={guardandoPerfil}
                  onClick={() =>
                    ejecutarGuardadoValidado(
                      {
                        horas_trabajo_semanal: horasTrabajoInput,
                        minutos_viaje: minutosViajeInput,
                        personas_a_cargo: personasCargoInput,
                        nivel_estres_percibido: estresInput,
                        ritmo_estudio: ritmoInput,
                      },
                      false
                    )
                  }
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#819783] hover:bg-[#6E8370] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#263A50]"
                >
                  {guardandoPerfil ? 'Guardando cambios...' : 'Guardar cambios'}
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 3: PLAN DE CURSADA & TEMPORIZADOR ADAPTATIVO                     */}
      {/* ========================================================================= */}
      {pantallaActiva === 'cursada_foco' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Plan de Asignaturas Semanales */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#263A50] flex items-center space-x-2">
                      <span>Mi plan de cursada</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                    </h2>
                    <p className="text-xs text-[#586879]">
                      Organizá tus materias y entregas de la semana paso a paso
                    </p>
                  </div>
                </div>

                {/* Lo que tenemos para esta semana */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] uppercase font-bold text-[#819783] tracking-wider flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                      <span>Para esta semana</span>
                    </div>
                    <span className="text-[10px] text-[#586879]">Datos ilustrativos</span>
                  </div>

                  {presetActivo.cursadas.map((cur) => (
                    <div
                      key={cur.codigo}
                      className="p-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] hover:border-[#819783] transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EEE7D7] text-[#263A50] flex items-center justify-center">
                          {cur.icono === 'book' ? (
                            <BookOpen className="w-4 h-4 stroke-[1.75]" />
                          ) : cur.icono === 'code' ? (
                            <FileText className="w-4 h-4 stroke-[1.75]" />
                          ) : (
                            <Layers className="w-4 h-4 stroke-[1.75]" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#263A50]">
                            {cur.nombre}
                          </div>
                          <div className="text-[11px] text-[#586879]">
                            {cur.subtitulo}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
                          cur.alDia
                            ? 'text-[#819783] bg-[#EBF1EC] border-[#D0DEC7]'
                            : 'text-[#B8863A] bg-[#FEF9E7] border-[#F9E79F]'
                        }`}
                      >
                        {cur.estado}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Lo que podés ir adelantando */}
                <div className="pt-3 border-t border-[#F0EBE0] space-y-2">
                  <div className="text-[11px] uppercase font-bold text-[#586879] tracking-wider">
                    Si querés adelantar (opcional)
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5DFD3] text-xs text-[#586879] flex items-center justify-between">
                    <span>{presetActivo.adelantoOpcional.titulo}</span>
                    <span className="text-[10px] text-[#819783] font-semibold">
                      {presetActivo.adelantoOpcional.etiqueta}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Adaptive Focus Timer (Temporizador de Foco Adaptativo) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-7 shadow-xs text-center space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#263A50] flex items-center justify-center space-x-1.5">
                    <span>Temporizador de estudio</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                  </h3>
                  <p className="text-xs text-[#586879] mt-0.5">
                    Elegí bloques de tiempo cortos con pausas para estudiar sin agotarte
                  </p>
                </div>

                {/* Display Circular del Temporizador */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#EEE7D7"
                      strokeWidth="7"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#819783"
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={
                        2 * Math.PI * 42 * (1 - segundosRestantes / (duracionMinutos * 60))
                      }
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-3xl font-bold text-[#263A50] tracking-tight">
                      {formatearTiempo(segundosRestantes)}
                    </span>
                    <span className="text-[11px] text-[#819783] font-semibold mt-0.5">
                      {modoFoco}
                    </span>
                  </div>
                </div>

                {/* Botones de Control Play / Pausa / Reset */}
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={toggleTimer}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer shadow-sm ${
                      timerActivo
                        ? 'bg-[#B8863A] hover:bg-[#A0742E]'
                        : 'bg-[#263A50] hover:bg-[#1E2E40]'
                    }`}
                  >
                    {timerActivo ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-2xl bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[#586879] flex items-center justify-center transition-colors cursor-pointer"
                    title="Reiniciar bloque"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Modos rápidos de foco */}
                <div className="flex justify-center space-x-1.5 pt-2 border-t border-[#F0EBE0]">
                  <button
                    onClick={() => cambiarModoTimer(25, 'Enfoque Suave')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      duracionMinutos === 25
                        ? 'bg-[#263A50] text-white border-[#263A50]'
                        : 'bg-[#FAF8F1] text-[#586879] border-[#E5DFD3]'
                    }`}
                  >
                    25 min · Enfoque
                  </button>
                  <button
                    onClick={() => cambiarModoTimer(15, 'Micro-Bloque (15 min)')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      duracionMinutos === 15
                        ? 'bg-[#263A50] text-white border-[#263A50]'
                        : 'bg-[#FAF8F1] text-[#586879] border-[#E5DFD3]'
                    }`}
                  >
                    15 min · Corto
                  </button>
                  <button
                    onClick={() => cambiarModoTimer(5, 'Pausa Reparadora (5 min)')}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                      duracionMinutos === 5
                        ? 'bg-[#819783] text-white border-[#819783]'
                        : 'bg-[#FAF8F1] text-[#586879] border-[#E5DFD3]'
                    }`}
                  >
                    5 min · Pausa
                  </button>
                </div>

                {/* Interruptor de Audio Ambiental Lluvia / Lo-Fi */}
                <div className="bg-[#FAF8F1] p-3 rounded-2xl border border-[#E5DFD3] flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-left">
                    <Headphones className="w-4 h-4 text-[#819783]" />
                    <div>
                      <div className="text-xs font-bold text-[#263A50]">Sonido ambiente</div>
                      <div className="text-[10px] text-[#586879]">Lluvia suave para acompañar el estudio</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleAudio}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      audioReproduciendo
                        ? 'bg-[#819783] text-white shadow-xs'
                        : 'bg-[#EEE7D7] text-[#586879]'
                    }`}
                  >
                    {audioReproduciendo ? 'Activo' : 'Silencio'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 4: INTERFAZ CONVERSACIONAL DEL ASISTENTE DOC                     */}
      {/* ========================================================================= */}
      {pantallaActiva === 'doc' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Modal / Chat con Avatar de DOC */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl overflow-hidden shadow-xs flex flex-col h-[680px]">
              
              {/* Header con Avatar oficial de DOC */}
              <div className="p-4 sm:p-5 border-b border-[#E5DFD3] bg-[#FAF8F1] flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={avatarDOC}
                    alt="DOC - Tu Compañero de Estudio"
                    className="w-12 h-12 rounded-2xl object-cover object-[50%_28%] border border-[#E5DFD3] shadow-xs bg-white"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-[#263A50] text-base">
                        DOC · Tu Compañero de Estudio
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#819783]" />
                    </div>
                    <p className="text-[11px] text-[#586879]">
                      Asistente de estudio con IA · ¿En qué te ayudo hoy?
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-[#EEE7D7]/70 p-1 rounded-xl border border-[#E2DBCF] text-xs">
                  <button
                    type="button"
                    onClick={() => setModoDOC('motivacion')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      modoDOC === 'motivacion'
                        ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                        : 'text-[#586879] hover:text-[#263A50]'
                    }`}
                  >
                    Motivación
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoDOC('desglose_lectura')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      modoDOC === 'desglose_lectura'
                        ? 'bg-[#263A50] text-[#FAF8F1] shadow-xs'
                        : 'text-[#586879] hover:text-[#263A50]'
                    }`}
                  >
                    Desglose
                  </button>
                </div>
              </div>

              {/* Historial de Mensajes */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF8F1]/40">
                {interaccionesDOC.map((inter) => (
                  <div key={inter.id_interaccion} className="space-y-3">
                    {/* Mensaje del Estudiante */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#263A50] text-[#FAF8F1] rounded-2xl rounded-tr-xs p-3.5 text-xs shadow-xs leading-relaxed">
                        <p>{inter.mensaje_usuario}</p>
                      </div>
                    </div>

                    {/* Respuesta de DOC */}
                    <div className="flex items-start space-x-3">
                      <img
                        src={avatarDOC}
                        alt="DOC"
                        className="w-8 h-8 rounded-xl object-cover object-[50%_28%] shrink-0 border border-[#E5DFD3] bg-white shadow-xs mt-1"
                      />
                      <div className="max-w-[88%] bg-[#FFFFFF] border border-[#E5DFD3] rounded-2xl rounded-tl-xs p-4 text-xs text-[#263A50] shadow-xs space-y-2">
                        <p className="whitespace-pre-wrap leading-relaxed">{inter.respuesta_doc}</p>
                        {inter.fue_fallback && (
                          <div className="flex items-center justify-end text-[10px] text-[#586879] pt-1.5 border-t border-[#F0EBE0]">
                            <span className="bg-[#EEE7D7] text-[#263A50] px-1.5 py-0.5 rounded">
                              Respuesta de respaldo local
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {cargandoDOC && (
                  <div className="flex items-center space-x-3 text-xs text-[#586879] animate-pulse">
                    <img src={avatarDOC} alt="DOC" className="w-8 h-8 rounded-xl object-cover object-[50%_28%] opacity-70" />
                    <span>DOC está escribiendo...</span>
                  </div>
                )}
              </div>

              {/* Botonera de Acciones Rápidas (según el Mockup Pantalla 4) */}
              <div className="p-3 bg-[#FAF8F1] border-t border-[#E5DFD3] flex items-center space-x-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleEjecutarDesglose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEE7D7] border border-[#DDD4C0] text-xs font-semibold text-[#263A50] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  📑 Desglosar en 3 puntos
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onEnviarMensajeDOC(
                      'DOC, ¿podés generarme una plantilla estructurada para el Trabajo Práctico de Regresión?',
                      'asistencia_tecnica'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEE7D7] border border-[#DDD4C0] text-xs font-semibold text-[#263A50] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  📝 Pedir esquema para TP
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onEnviarMensajeDOC(
                      'DOC, esta semana tengo horas extras en el trabajo. ¿Cómo reorganizamos las entregas para no quemarme?',
                      'planificacion'
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EEE7D7] border border-[#DDD4C0] text-xs font-semibold text-[#263A50] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  🔄 Reorganizar entregas
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleEnviarChat} className="p-4 bg-white border-t border-[#E5DFD3] flex space-x-2">
                <input
                  type="text"
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  placeholder="Contale a DOC qué necesitás organizar o repasar hoy..."
                  className="flex-1 px-4 py-2.5 text-xs bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden focus:border-[#819783]"
                />
                <button
                  type="submit"
                  disabled={!mensajeInput.trim() || cargandoDOC}
                  className="px-4 py-2.5 rounded-xl bg-[#263A50] hover:bg-[#1E2E40] text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Columna Derecha: Herramienta de Desglose de Lecturas */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#819783] stroke-[1.75]" />
                  <h3 className="font-serif text-base font-bold text-[#263A50]">
                    Resumir una lectura en 3 puntos
                  </h3>
                </div>

                <p className="text-xs text-[#586879] leading-relaxed">
                  Pegá un texto o apunte que te resulte complejo y DOC lo ordena en: <strong>1 idea clave</strong>, <strong>1 ejemplo cotidiano</strong> y <strong>1 paso práctico de 15 minutos</strong>.
                </p>

                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={textoParaDesglose}
                    onChange={(e) => setTextoParaDesglose(e.target.value)}
                    placeholder="Pegá acá el fragmento del apunte que quieras aclarar..."
                    className="w-full bg-[#FAF8F1] border border-[#E5DFD3] rounded-xl p-3 text-xs text-[#263A50] placeholder-[#8C98A4] focus:outline-hidden focus:border-[#819783]"
                  />

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#586879] uppercase font-semibold tracking-wider block">
                      Probá con un texto de ejemplo:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setTextoParaDesglose(
                            'En el entrenamiento de redes neuronales artificiales, el algoritmo de retropropagación (backpropagation) calcula el gradiente de la función de pérdida con respecto a los pesos sinápticos mediante la regla de la cadena, permitiendo ajustar los hiperparámetros capa por capa.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[11px] text-[#263A50] font-medium transition-colors cursor-pointer"
                      >
                        Redes: Backpropagation
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTextoParaDesglose(
                            'La matriz de confusión evalúa el rendimiento de un clasificador binario o multiclase detallando verdaderos positivos, falsos positivos, verdaderos negativos y falsos negativos, sirviendo de base para calcular métricas como Precisión, Recall y F1-Score.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F1] hover:bg-[#EEE7D7] border border-[#E5DFD3] text-[11px] text-[#263A50] font-medium transition-colors cursor-pointer"
                      >
                        Métricas: Matriz de Confusión
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleEjecutarDesglose}
                    disabled={desglosando}
                    className="w-full py-2.5 rounded-xl bg-[#263A50] hover:bg-[#1E2E40] text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 stroke-[1.75]" />
                    <span>{desglosando ? 'Armando resumen...' : 'Resumir en 3 puntos'}</span>
                  </button>
                </div>

                {desgloseResultado && (
                  <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#819783]/40 space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-[#819783] font-bold uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" />
                        <span>Resumen de DOC:</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onEnviarMensajeDOC(`DOC, te comparto el desglose que hicimos:\n${desgloseResultado}`, 'desglose_lectura')
                        }
                        className="text-[10px] text-[#263A50] hover:text-[#819783] font-semibold underline cursor-pointer"
                      >
                        Enviar al chat
                      </button>
                    </div>
                    <div className="text-xs text-[#263A50] whitespace-pre-wrap leading-relaxed font-sans">
                      {desgloseResultado}
                    </div>
                  </div>
                )}
              </div>

              {/* Aprendé a tu ritmo */}
              <div className="p-5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl space-y-2 text-xs text-[#586879] shadow-xs">
                <div className="font-serif font-bold text-[#263A50] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#819783]" />
                  <span>Aprendé a tu ritmo</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Podés preguntar y retomar cuando lo necesites. Este espacio está pensado para ayudarte a avanzar paso a paso según tus horarios reales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PANTALLA 7: MÓDULO DE MOTIVACIÓN, GAMIFICACIÓN Y VISIÓN A FUTURO          */}
      {/* ========================================================================= */}
      {pantallaActiva === 'gamificacion' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Banner de Nivel Desbloqueado */}
          <div className="bg-[#FEF9E7] border border-[#F9E79F] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#B8863A] text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm shrink-0">
                🏆
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#263A50]">
                    Mis avances
                  </h2>
                  <span className="text-[11px] font-medium text-[#586879] bg-white/80 px-2 py-0.5 rounded-md border border-[#F9E79F]">
                    Datos de ejemplo
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#B8863A] mt-0.5">
                  {presetActivo.microVictorias.nivel}
                </p>
              </div>
            </div>

            <div className="self-start sm:self-auto flex items-center space-x-2 text-xs font-semibold text-[#263A50] bg-white px-3.5 py-1.5 rounded-xl border border-[#F9E79F] shadow-xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#819783]" />
              <span>{presetActivo.microVictorias.puntos} Puntos DOCE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Tarjeta 1: Micro-Victoria */}
            <div className="md:col-span-6 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center">
                  <Award className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#263A50]">
                  Logro destacado de la semana
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#EBF1EC] border-2 border-[#819783] mx-auto flex items-center justify-center text-2xl">
                  🎖️
                </div>
                <div className="font-serif text-lg font-bold text-[#263A50]">
                  {presetActivo.microVictorias.insignia}
                </div>
                <p className="text-xs text-[#586879] max-w-sm mx-auto">
                  {presetActivo.microVictorias.motivacion}
                </p>
              </div>
            </div>

            {/* Tarjeta 2: Progreso Mensual (Histórico Positivo) */}
            <div className="md:col-span-6 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEE7D7] text-[#263A50] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#263A50]">
                  Progreso Mensual
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-[#EBF1EC] border border-[#CDE0D0] text-center space-y-2">
                <div className="text-xs font-semibold text-[#819783] uppercase tracking-wider">
                  Evolución en la cohorte
                </div>
                <div className="font-serif text-xl font-bold text-[#263A50]">
                  {presetActivo.microVictorias.historico}
                </div>
                <p className="text-xs text-[#586879]">
                  Reconocimiento al avance sostenido y compatibilización con tus tiempos personales.
                </p>
              </div>
            </div>

            {/* Tarjeta 3: Proyección 2° Año (Visión de Futuro Profesional) */}
            <div className="md:col-span-7 bg-[#FFFFFF] border border-[#E5DFD3] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center">
                    <Brain className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#263A50]">
                      Proyección 2° Año · Ciencia de Datos e IA
                    </h3>
                    <div className="text-[11px] text-[#586879]">
                      El camino que estás construyendo en el IFTS N.º 12
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#819783] bg-[#EBF1EC] px-2.5 py-1 rounded-full border border-[#D0DEC7]">
                  Contenidos de 2° año
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F1] border border-[#E5DFD3] space-y-3">
                <p className="text-xs text-[#263A50] leading-relaxed">
                  En <strong>Ciencia de Datos II</strong> vas a construir tus propios recomendadores de IA basados en redes neuronales profundas y procesamiento de lenguaje natural (NLP).
                </p>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-[#263A50]">
                  <div className="p-2.5 bg-white rounded-xl border border-[#E5DFD3]">
                    🐍 Python Avanzado
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#E5DFD3]">
                    ⚡ PyTorch & HuggingFace
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#E5DFD3]">
                    🚀 Despliegue en Cloud
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 4: Mensaje Final de DOC */}
            <div className="md:col-span-5 bg-[#263A50] text-[#FAF8F1] rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={avatarDOC}
                    alt="DOC"
                    className="w-10 h-10 rounded-xl object-cover object-[50%_28%] bg-white p-0.5 border border-white/20"
                  />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#819783]">
                      DOC
                    </div>
                    <div className="font-serif text-sm font-bold">
                      Organizá tu próximo bloque
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#EEE7D7]">
                  “¿Tenés un rato libre de 15 minutos hoy? Podés usarlo para adelantar una lectura o revisar tus materias de la semana.”
                </p>
              </div>

              <button
                onClick={() => setPantallaActiva('cursada_foco')}
                className="w-full py-2.5 rounded-xl bg-[#819783] hover:bg-[#6E8370] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Ir a Cursada y foco</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón discreto de acceso rápido al Asistente DOC (visible en todas las pantallas excepto 'doc') */}
      {pantallaActiva !== 'doc' && (
        <button
          type="button"
          onClick={handleAbrirAsistenteDOC}
          aria-label="Hablar con DOC"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center space-x-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-[#FAF8F1]/95 backdrop-blur-md border border-[#DDD4C0] hover:border-[#819783] text-[#263A50] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#819783] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F1]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#E5DFD3] bg-white shrink-0 shadow-xs">
            <img
              src={avatarDOC}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-[50%_28%] group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="text-left leading-tight">
            <span className="text-xs font-semibold text-[#263A50] flex items-center space-x-1.5">
              <span>Hablar con DOC</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#819783] shrink-0" />
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
