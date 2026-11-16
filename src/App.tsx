/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ecosistema DOCE - IFTS N.º 12
 * Arquitectura Separada Backend-Frontend con Control de Acceso por Roles (RBAC).
 * Interfaz Editorial Adulta: Domine Serif, Public Sans, Paleta Sabio-Marino-Crema.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/Header.js';
import { StudentView } from './components/StudentView.js';
import { TutorView } from './components/TutorView.js';
import { LabUmlView } from './components/LabUmlView.js';
import { CampaignStoryboardView } from './components/CampaignStoryboardView.js';
import { LoginView } from './components/LoginView.js';
import { inicializarEcosistema } from './domain/seedData.js';
import {
  Estudiante,
  PerfilEstudio,
  Tutor,
  Alerta,
  IntervencionPedagogica,
  InteraccionDOC,
  PrediccionRiesgo,
  RitmoEstudio,
  ModoDOC,
  AgenteDOC,
  AreaSistema,
} from './domain/models.js';
import { api, AuthUserResponse } from './services/api.js';
import { Bell, X, ShieldAlert, WifiOff, RefreshCw } from 'lucide-react';

export default function App() {
  const [dataEcosistema] = useState(() => inicializarEcosistema());

  // Estado de Autenticación y RBAC
  const [usuario, setUsuario] = useState<AuthUserResponse | null>(null);
  const [comprobandoSesion, setComprobandoSesion] = useState<boolean>(true);

  // Vista activa en el frontend (restringida a las áreas permitidas del usuario)
  const [vistaActiva, setVistaActiva] = useState<AreaSistema>('estudiante');

  // Datos del Ecosistema
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(dataEcosistema.estudiantes);
  const [estudianteActualId, setEstudianteActualId] = useState<string>(dataEcosistema.estudianteActualId);
  const [tutor] = useState<Tutor>(dataEcosistema.tutor);
  const [redNeuronal] = useState(dataEcosistema.redNeuronal);
  const [predicciones, setPredicciones] = useState<PrediccionRiesgo[]>(dataEcosistema.predicciones);
  const [alertas, setAlertas] = useState<Alerta[]>(dataEcosistema.alertas);
  const [intervenciones, setIntervenciones] = useState<IntervencionPedagogica[]>(dataEcosistema.intervenciones);
  const [interaccionesDOC, setInteraccionesDOC] = useState<InteraccionDOC[]>(dataEcosistema.interaccionesDOC);

  const [cargandoDOC, setCargandoDOC] = useState(false);
  const [toastNotif, setToastNotif] = useState<string | null>(null);
  const [errorSincronizacionPerfil, setErrorSincronizacionPerfil] = useState<string | null>(null);
  const [sincronizandoPerfil, setSincronizandoPerfil] = useState<boolean>(false);
  const [perfilSyncKey, setPerfilSyncKey] = useState<number>(0);

  // Guardas contra condiciones de carrera y sobrescrituras entre sesiones/usuarios
  const montadoRef = useRef<boolean>(true);
  const syncRequestSeqRef = useRef<number>(0);
  const activeUserIdRef = useRef<string | null>(null);
  const activeStudentIdRef = useRef<string>(dataEcosistema.estudianteActualId);
  const perfilGuardadoLocalTsRef = useRef<Record<string, number>>({});

  // AgenteDOC local para fallback
  const agenteDOC = useMemo(() => new AgenteDOC('motivacion'), []);

  // Reconstruir instancia de dominio PerfilEstudio desde JSON del backend respetando perfil nulo
  const reconstruirPerfilEstudio = (perfilJson: any, studentId: string): PerfilEstudio | null => {
    if (!perfilJson || typeof perfilJson !== 'object') {
      return null;
    }
    const perfilInstancia = new PerfilEstudio(
      perfilJson.id_perfil || `perf-${studentId}`,
      perfilJson.estudiante_id || studentId,
      Number(perfilJson.horas_trabajo_semanal),
      Number(perfilJson.minutos_viaje),
      Number(perfilJson.personas_a_cargo),
      Number(perfilJson.nivel_estres_percibido),
      perfilJson.ritmo_estudio as RitmoEstudio
    );
    if (perfilJson.fecha_actualizacion) {
      perfilInstancia.fecha_actualizacion = perfilJson.fecha_actualizacion;
    }
    return perfilInstancia;
  };

  // Aplicar respuesta validada del servidor sobre el estado React preservando Estudiante -> PerfilEstudio
  const aplicarPerfilDesdeServidor = (
    targetStudentId: string,
    estudianteBackendJson: any,
    incrementarSyncKey: boolean
  ) => {
    if (!estudianteBackendJson || estudianteBackendJson.id_usuario !== targetStudentId) {
      return;
    }
    const perfilReconstruido = reconstruirPerfilEstudio(estudianteBackendJson.perfilEstudio, targetStudentId);

    setEstudiantes((prev) =>
      prev.map((est) => {
        if (est.id_usuario !== targetStudentId) return est;
        est.perfilEstudio = perfilReconstruido;
        return est;
      })
    );

    if (incrementarSyncKey) {
      setPerfilSyncKey((k) => k + 1);
    }
  };

  // Recuperar perfil actualizado desde el backend con protección contra respuestas tardías o de otro usuario
  const cargarPerfilDesdeBackend = async (
    targetStudentId: string,
    expectedUserId: string,
    options?: { useQueryId?: boolean; incrementSyncKey?: boolean }
  ): Promise<boolean> => {
    const requestSeq = ++syncRequestSeqRef.current;
    const requestStartedAt = Date.now();
    setSincronizandoPerfil(true);

    try {
      const data = await api.estudiante.getPerfil(options?.useQueryId ? targetStudentId : undefined);

      if (!montadoRef.current) return false;
      if (requestSeq !== syncRequestSeqRef.current) return false;
      if (activeUserIdRef.current !== expectedUserId) return false;
      if (activeStudentIdRef.current !== targetStudentId) return false;
      if ((perfilGuardadoLocalTsRef.current[targetStudentId] || 0) > requestStartedAt) return false;

      if (!data?.estudiante || data.estudiante.id_usuario !== targetStudentId) {
        throw new Error('La respuesta del servidor no coincide con el estudiante autenticado.');
      }

      aplicarPerfilDesdeServidor(targetStudentId, data.estudiante, Boolean(options?.incrementSyncKey));
      setErrorSincronizacionPerfil(null);
      return true;
    } catch (err: any) {
      if (
        montadoRef.current &&
        requestSeq === syncRequestSeqRef.current &&
        activeUserIdRef.current === expectedUserId
      ) {
        const detalle = err?.message || '';
        const mensajeError =
          detalle.includes('Failed to fetch') || detalle.includes('NetworkError')
            ? 'Sin conexión con el servidor para recuperar tu perfil actualizado.'
            : detalle || 'No se pudo recuperar tu perfil desde el servidor.';
        setErrorSincronizacionPerfil(mensajeError);
      }
      return false;
    } finally {
      if (montadoRef.current && requestSeq === syncRequestSeqRef.current) {
        setSincronizandoPerfil(false);
      }
    }
  };

  // Verificar sesión existente en el backend al montar el componente (F5 / recarga)
  useEffect(() => {
    montadoRef.current = true;
    const verificarSesion = async () => {
      try {
        const usuarioSesion = await api.auth.getMe();
        if (!montadoRef.current || !usuarioSesion) return;

        if (usuarioSesion.rol === 'tutor' || usuarioSesion.id.includes('tutor')) {
          usuarioSesion.nombre = 'Prof. Lic. Valeria Morales';
        }

        activeUserIdRef.current = usuarioSesion.id;
        const targetStudentId = usuarioSesion.estudiante_id || activeStudentIdRef.current;
        activeStudentIdRef.current = targetStudentId;

        if (usuarioSesion.esContingenciaLocal) {
          setErrorSincronizacionPerfil(null);
        } else if (usuarioSesion.rol === 'estudiante' && usuarioSesion.estudiante_id) {
          await cargarPerfilDesdeBackend(usuarioSesion.estudiante_id, usuarioSesion.id, {
            useQueryId: false,
            incrementSyncKey: false,
          });
        } else if (usuarioSesion.rol === 'admin' && usuarioSesion.area_asignada === 'estudiante') {
          await cargarPerfilDesdeBackend(targetStudentId, usuarioSesion.id, {
            useQueryId: true,
            incrementSyncKey: false,
          });
        }

        if (!montadoRef.current) return;
        setUsuario(usuarioSesion);
        setVistaActiva(usuarioSesion.area_asignada);
        if (usuarioSesion.estudiante_id) {
          setEstudianteActualId(usuarioSesion.estudiante_id);
        }
      } catch (err: any) {
        console.warn('Error verificando sesión en backend:', err);
        if (montadoRef.current) {
          activeUserIdRef.current = null;
          setUsuario(null);
          const detalle = err?.message || '';
          setToastNotif(
            detalle.includes('Failed to fetch') || detalle.includes('NetworkError')
              ? 'No se pudo verificar tu sesión con el servidor. Verificá tu conexión e intentá nuevamente.'
              : detalle || 'No se pudo restaurar la sesión institucional.'
          );
        }
      } finally {
        if (montadoRef.current) setComprobandoSesion(false);
      }
    };

    verificarSesion();
    return () => {
      montadoRef.current = false;
    };
  }, []);

  // Estudiante actualmente seleccionado
  const estudianteActual = useMemo(() => {
    return estudiantes.find((e) => e.id_usuario === estudianteActualId) || estudiantes[0];
  }, [estudiantes, estudianteActualId]);

  // Predicción y Alerta correspondiente al estudiante actual
  const prediccionActual = useMemo(() => {
    return predicciones.find((p) => p.estudiante_id === estudianteActual.id_usuario) || null;
  }, [predicciones, estudianteActual]);

  const alertaActual = useMemo(() => {
    return alertas.find((a) => a.estudiante_id === estudianteActual.id_usuario && a.estado === 'Pendiente') || null;
  }, [alertas, estudianteActual]);

  const totalAlertasPendientes = useMemo(() => {
    return alertas.filter((a) => a.estado === 'Pendiente').length;
  }, [alertas]);

  // Manejar Login exitoso y recuperar perfil actualizado desde el backend
  const handleLoginSuccess = async (userAuth: AuthUserResponse) => {
    if (userAuth.rol === 'tutor' || userAuth.id.includes('tutor')) {
      userAuth.nombre = 'Prof. Lic. Valeria Morales';
    }

    activeUserIdRef.current = userAuth.id;
    const targetStudentId = userAuth.estudiante_id || activeStudentIdRef.current;
    activeStudentIdRef.current = targetStudentId;

    if (userAuth.esContingenciaLocal) {
      setErrorSincronizacionPerfil(null);
      setUsuario(userAuth);
      setVistaActiva(userAuth.area_asignada);
      if (userAuth.estudiante_id) {
        setEstudianteActualId(userAuth.estudiante_id);
      }
      setToastNotif(
        `Sesión local de contingencia iniciada para ${userAuth.nombre}. No está sincronizada con el servidor.`
      );
      return;
    }

    if (userAuth.estudiante && userAuth.estudiante_id) {
      aplicarPerfilDesdeServidor(userAuth.estudiante_id, userAuth.estudiante, false);
    }

    if (userAuth.rol === 'estudiante' && userAuth.estudiante_id) {
      setComprobandoSesion(true);
      await cargarPerfilDesdeBackend(userAuth.estudiante_id, userAuth.id, {
        useQueryId: false,
        incrementSyncKey: false,
      });
      if (!montadoRef.current) return;
      setComprobandoSesion(false);
    } else if (userAuth.rol === 'admin' && userAuth.area_asignada === 'estudiante') {
      setComprobandoSesion(true);
      await cargarPerfilDesdeBackend(targetStudentId, userAuth.id, {
        useQueryId: true,
        incrementSyncKey: false,
      });
      if (!montadoRef.current) return;
      setComprobandoSesion(false);
    } else {
      setErrorSincronizacionPerfil(null);
    }

    setUsuario(userAuth);
    setVistaActiva(userAuth.area_asignada);
    if (userAuth.estudiante_id) {
      setEstudianteActualId(userAuth.estudiante_id);
    }

    if (userAuth.rol === 'admin' || userAuth.id === 'user-adm-direccion') {
      setToastNotif(
        'Sesión activa en Coordinación General IFTS N.º 12 · Supervisión y Acompañamiento de Trayectorias Estudiantiles.'
      );
    } else {
      setToastNotif(
        `Bienvenido/a, ${userAuth.nombre}. Sesión activa iniciada en el Área de ${
          userAuth.area_asignada === 'estudiante'
            ? 'Estudiantes'
            : userAuth.area_asignada === 'tutor'
            ? 'Tutoría Institucional'
            : userAuth.area_asignada === 'campana'
            ? 'Identidad & Campaña'
            : 'Laboratorio de IA'
        }.`
      );
    }
  };

  // Manejar Logout
  const handleLogout = async () => {
    syncRequestSeqRef.current += 1;
    activeUserIdRef.current = null;
    setErrorSincronizacionPerfil(null);
    await api.auth.logout();
    setUsuario(null);
    setToastNotif('Sesión cerrada correctamente.');
  };

  // Cambiar vista respetando RBAC
  const handleCambiarVista = (nuevaVista: AreaSistema) => {
    if (!usuario) return;
    const permitidas = usuario.areas_permitidas || [usuario.area_asignada];
    if (permitidas.includes(nuevaVista)) {
      setVistaActiva(nuevaVista);
    } else {
      setToastNotif(`Acceso denegado: Su rol (${usuario.rol}) no tiene permisos para el área solicitada.`);
    }
  };

  // Actualizar perfil socio-laboral del estudiante esperando confirmación real del backend (sin disparar alertas a Tutoría)
  const handleActualizarPerfil = async (nuevosDatos: {
    horas_trabajo_semanal: number;
    minutos_viaje: number;
    personas_a_cargo: number;
    nivel_estres_percibido: number;
    ritmo_estudio: RitmoEstudio;
  }): Promise<{ ok: boolean; error?: string; fecha_actualizacion?: string }> => {
    if (usuario?.esContingenciaLocal) {
      const msg =
        'Estás en modo de contingencia local sin sesión válida en el servidor. Iniciá sesión con conexión para guardar tu perfil.';
      setToastNotif(`No se guardaron los cambios: ${msg}`);
      return { ok: false, error: msg };
    }

    try {
      const respuesta = await api.estudiante.updatePerfil({
        id_estudiante: estudianteActual.id_usuario,
        horas_trabajo_semanal: nuevosDatos.horas_trabajo_semanal,
        minutos_viaje: nuevosDatos.minutos_viaje,
        personas_a_cargo: nuevosDatos.personas_a_cargo,
        nivel_estres_percibido: nuevosDatos.nivel_estres_percibido,
        ritmo_estudio: nuevosDatos.ritmo_estudio,
      });

      if (!respuesta?.success || !respuesta?.perfilEstudio) {
        throw new Error(respuesta?.error || 'El servidor no confirmó el guardado del perfil.');
      }

      if (estudianteActual.perfilEstudio) {
        estudianteActual.perfilEstudio.actualizar_perfil(nuevosDatos);
        if (respuesta.perfilEstudio.fecha_actualizacion) {
          estudianteActual.perfilEstudio.fecha_actualizacion = respuesta.perfilEstudio.fecha_actualizacion;
        }
      } else {
        const perfilCreado = estudianteActual.completar_onboarding(nuevosDatos);
        if (respuesta.perfilEstudio.id_perfil) {
          perfilCreado.id_perfil = respuesta.perfilEstudio.id_perfil;
        }
        if (respuesta.perfilEstudio.fecha_actualizacion) {
          perfilCreado.fecha_actualizacion = respuesta.perfilEstudio.fecha_actualizacion;
        }
      }

      perfilGuardadoLocalTsRef.current[estudianteActual.id_usuario] = Date.now();
      setErrorSincronizacionPerfil(null);
      setEstudiantes((prev) => [...prev]);
      setToastNotif('Preferencias y perfil de estudio guardados correctamente.');
      return {
        ok: true,
        fecha_actualizacion:
          respuesta.perfilEstudio.fecha_actualizacion || estudianteActual.perfilEstudio?.fecha_actualizacion,
      };
    } catch (err: any) {
      const detalle = err?.message || '';
      const mensajeError =
        detalle.includes('Failed to fetch') || detalle.includes('NetworkError')
          ? 'No se pudo conectar con el servidor para guardar tu perfil. Tus datos anteriores no fueron modificados.'
          : detalle || 'No se pudo guardar tu perfil. Verificá tu sesión e intentá nuevamente.';
      setToastNotif(`No se guardaron los cambios: ${mensajeError}`);
      return { ok: false, error: mensajeError };
    }
  };

  // Enviar mensaje al Agente DOC vía API backend
  const handleEnviarMensajeDOC = async (mensaje: string, modo: ModoDOC) => {
    setCargandoDOC(true);
    let respuestaTexto = '';
    let fueFallback = false;

    try {
      const data = await api.doc.chat(
        mensaje,
        modo,
        estudianteActual.perfilEstudio
          ? {
              horas_trabajo_semanal: estudianteActual.perfilEstudio.horas_trabajo_semanal,
              minutos_viaje: estudianteActual.perfilEstudio.minutos_viaje,
              personas_a_cargo: estudianteActual.perfilEstudio.personas_a_cargo,
              nivel_estres_percibido: estudianteActual.perfilEstudio.nivel_estres_percibido,
              ritmo_estudio: estudianteActual.perfilEstudio.ritmo_estudio,
            }
          : null,
        estudianteActual.id_usuario
      );
      respuestaTexto = data.respuesta;
      fueFallback = data.es_fallback;
    } catch (err) {
      console.warn('Fallback local para DOC:', err);
      respuestaTexto = agenteDOC.activar_fallback(mensaje, modo);
      fueFallback = true;
    } finally {
      setCargandoDOC(false);
    }

    const nuevaInteraccion = new InteraccionDOC(
      `intdoc-${Date.now()}`,
      estudianteActual.id_usuario,
      mensaje,
      respuestaTexto,
      modo,
      fueFallback
    );
    nuevaInteraccion.registrar_interaccion();

    setInteraccionesDOC((prev) => [...prev, nuevaInteraccion]);
  };

  // Desglosar texto con DOC vía API backend
  const handleDesglosarTextoDOC = async (texto: string, materia: string): Promise<string> => {
    try {
      const data = await api.doc.breakdown(texto, materia);
      if (data && data.desglose && data.desglose.trim()) {
        return data.desglose;
      }
      throw new Error('Respuesta de desglose vacía');
    } catch (err) {
      console.warn('Error en fetch breakdown, usando fallback estructurado:', err);
      return agenteDOC.activar_fallback(texto, 'desglose_lectura');
    }
  };

  // Registrar intervención pedagógica por el Tutor y sincronizar con backend
  const handleRegistrarIntervencion = async (
    alerta: Alerta,
    tipo: string,
    acuerdos: string,
    observaciones: string,
    fechaSeguimiento: string
  ) => {
    const intervencion = tutor.registrar_intervencion(
      alerta,
      tipo,
      acuerdos,
      observaciones,
      fechaSeguimiento
    );

    setIntervenciones((prev) => [intervencion, ...prev]);
    setAlertas([...alertas]); // Refrescar estado a "Atendida"
    setToastNotif(
      `Intervención pedagógica registrada exitosamente para ${alerta.estudiante_codigo_anonimizado}. Alerta marcada como Atendida.`
    );

    try {
      await api.tutor.registrarIntervencion({
        alerta_id: alerta.id_alerta,
        tipo_intervencion: tipo,
        acuerdos_alcanzados: acuerdos,
        observaciones: observaciones,
        fecha_seguimiento: fechaSeguimiento,
      });
    } catch (err) {
      console.warn('Sincronización de intervención en backend:', err);
    }
  };

  // Notificar tutoría institucional
  const handleNotificarTutoria = async (alerta: Alerta) => {
    const mensajeNotificacion = alerta.notificar_tutoria();
    setToastNotif(mensajeNotificacion);

    try {
      await api.tutor.notificar(alerta.id_alerta);
    } catch (err) {
      console.warn('Notificación backend:', err);
    }
  };

  // Auto-cerrar toast tras 5 segundos
  useEffect(() => {
    if (toastNotif) {
      const timer = setTimeout(() => setToastNotif(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastNotif]);

  // Si está comprobando la sesión inicial
  if (comprobandoSesion) {
    return (
      <div className="min-h-screen bg-[#FAF8F1] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center font-serif text-2xl font-bold mx-auto border border-[#263A50]">
            <span className="relative">
              D
              <span className="absolute -top-0.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#819783]" />
            </span>
          </div>
          <p className="text-xs text-[#586879] font-medium">Verificando sesión institucional...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar pantalla de inicio de sesión institucional
  if (!usuario) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Asegurar que la vista activa pertenezca a las áreas permitidas del usuario
  const permitidas = usuario.areas_permitidas || [usuario.area_asignada];
  const vistaValida = permitidas.includes(vistaActiva) ? vistaActiva : usuario.area_asignada;

  return (
    <div className="min-h-screen bg-[#FAF8F1] text-[#263A50] flex flex-col font-sans selection:bg-[#819783] selection:text-white">
      {/* Toast Notification */}
      {toastNotif && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-4 shadow-xl flex items-start space-x-3 animate-in slide-in-from-bottom-3 duration-300">
          <div className="w-8 h-8 rounded-xl bg-[#EBF1EC] text-[#819783] flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="flex-1 text-xs text-[#263A50] leading-relaxed font-medium">
            {toastNotif}
          </div>
          <button
            onClick={() => setToastNotif(null)}
            className="text-[#586879] hover:text-[#263A50] p-1 rounded-lg hover:bg-[#FAF8F1] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header con RBAC activo */}
      <Header
        vistaActiva={vistaValida}
        onCambiarVista={handleCambiarVista}
        usuario={usuario}
        onCerrarSesion={handleLogout}
        estudiantes={estudiantes}
        estudianteActual={estudianteActual}
        onSeleccionarEstudiante={(est) => {
          activeStudentIdRef.current = est.id_usuario;
          setEstudianteActualId(est.id_usuario);
          if (!usuario.esContingenciaLocal && usuario.rol === 'admin') {
            cargarPerfilDesdeBackend(est.id_usuario, usuario.id, {
              useQueryId: true,
              incrementSyncKey: true,
            });
          }
        }}
        tutor={tutor}
        totalAlertasPendientes={totalAlertasPendientes}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {usuario.esContingenciaLocal && vistaValida === 'estudiante' && (
          <div
            role="status"
            className="mb-4 rounded-2xl border border-[#DDD4C0] bg-[#EEE7D7]/70 px-4 py-3 text-xs text-[#263A50] flex items-start gap-2.5"
          >
            <WifiOff className="w-4 h-4 text-[#B8863A] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Modo de contingencia local sin sesión de servidor:</strong>{' '}
              iniciaste sesión sin conexión con el backend. Los datos mostrados no están sincronizados y los cambios que intentes guardar no se enviarán al servidor hasta iniciar sesión con conexión.
            </div>
          </div>
        )}

        {errorSincronizacionPerfil && vistaValida === 'estudiante' && !usuario.esContingenciaLocal && (
          <div
            role="alert"
            className="mb-4 rounded-2xl border border-[#D8B4A6] bg-[#FBF2EE] px-4 py-3 text-xs text-[#7B3421] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#B85D43] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">No pudimos confirmar tu perfil actualizado desde el servidor:</strong>{' '}
                {errorSincronizacionPerfil}
              </div>
            </div>
            <button
              type="button"
              disabled={sincronizandoPerfil}
              onClick={() =>
                cargarPerfilDesdeBackend(estudianteActual.id_usuario, usuario.id, {
                  useQueryId: usuario.rol === 'admin',
                  incrementSyncKey: true,
                })
              }
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C99B89] bg-white text-[#7B3421] font-medium hover:bg-[#FAF8F1] disabled:opacity-60 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sincronizandoPerfil ? 'animate-spin' : ''}`} />
              <span>{sincronizandoPerfil ? 'Reintentando...' : 'Reintentar'}</span>
            </button>
          </div>
        )}

        {vistaValida === 'estudiante' && (
          <StudentView
            key={`${estudianteActual.id_usuario}-${perfilSyncKey}`}
            usuario={usuario}
            estudiante={estudianteActual}
            prediccion={prediccionActual}
            alerta={alertaActual}
            interaccionesDOC={interaccionesDOC.filter((i) => i.estudiante_id === estudianteActual.id_usuario)}
            onActualizarPerfil={handleActualizarPerfil}
            onEnviarMensajeDOC={handleEnviarMensajeDOC}
            onDesglosarTextoDOC={handleDesglosarTextoDOC}
            cargandoDOC={cargandoDOC}
          />
        )}

        {vistaValida === 'tutor' && (
          <TutorView
            tutor={tutor}
            alertas={alertas}
            estudiantes={estudiantes}
            predicciones={predicciones}
            intervenciones={intervenciones}
            onRegistrarIntervencion={handleRegistrarIntervencion}
            onNotificarTutoria={handleNotificarTutoria}
          />
        )}

        {vistaValida === 'campana' && <CampaignStoryboardView />}

        {vistaValida === 'lab' && <LabUmlView redNeuronal={redNeuronal} />}
      </main>

      {/* Institutional Footer */}
      <footer
        className={`border-t border-[#E5DFD3] pt-5 sm:py-5 bg-[#FAF8F1] text-xs text-[#586879] ${
          vistaValida === 'estudiante' ? 'pb-20 sm:pb-5' : 'pb-6'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-2 text-center lg:text-left ${
            vistaValida === 'estudiante' ? 'sm:pr-52 lg:pr-56' : ''
          }`}
        >
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1">
            <span className="inline-flex items-center space-x-1.5 font-serif font-bold text-[#263A50] whitespace-nowrap">
              <span>DOCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#819783]" aria-hidden="true" />
            </span>
            <span className="font-medium text-[#263A50] whitespace-nowrap">
              Tu Compañero de Estudio
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-1 sm:gap-2.5 text-xs">
            <span className="whitespace-nowrap">Prototipo académico · IFTS N.º 12</span>
            <span className="hidden sm:inline text-[#C5BBA7]" aria-hidden="true">·</span>
            <span className="whitespace-nowrap font-medium text-[#263A50]/80">Grupo 6 · 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
