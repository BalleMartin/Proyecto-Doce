/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Base de Datos y Estado del Backend para el Ecosistema DOCE - IFTS N.º 12
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  Usuario,
  Estudiante,
  PerfilEstudio,
  Tutor,
  Cursada,
  ResultadoAcademico,
  RedNeuronalPredictiva,
  Alerta,
  IntervencionPedagogica,
  InteraccionDOC,
  PrediccionRiesgo,
  VectorEstudiante,
  AreaSistema,
  RitmoEstudio,
} from '../domain/models.js';

export type EstadoPersistenciaPerfiles = 'sin_archivo' | 'cargada' | 'error_lectura_o_corrupto';

export interface PerfilEstudioPersistido {
  id_perfil: string;
  estudiante_id: string;
  horas_trabajo_semanal: number;
  minutos_viaje: number;
  personas_a_cargo: number;
  nivel_estres_percibido: number;
  ritmo_estudio: RitmoEstudio;
  fecha_actualizacion: string;
}

interface ArchivoPerfilesPersistidos {
  version: number;
  actualizado_en: string;
  perfiles: Record<string, PerfilEstudioPersistido | null>;
}

const RITMOS_VALIDOS: RitmoEstudio[] = ['Intensivo', 'Regular', 'Fragmentado'];

function resolverDirectorioDatosPrivado(): string {
  const configured = process.env.DOCE_DATA_DIR?.trim();
  if (configured) {
    return path.resolve(configured);
  }
  const fueraDeRaiz = path.resolve(process.cwd(), '..', '.doce-data');
  try {
    fs.accessSync(path.dirname(fueraDeRaiz), fs.constants.W_OK);
    return fueraDeRaiz;
  } catch {
    return path.join(os.tmpdir(), 'doce-data');
  }
}

export interface UserAccount {
  id: string;
  email: string;
  legajo: string;
  nombre: string;
  passwordHash: string; // Para validación simulada
  rol: 'estudiante' | 'tutor' | 'comunicacion' | 'investigador_ia' | 'admin';
  area_asignada: AreaSistema;
  areas_permitidas: AreaSistema[];
  estudiante_id?: string;
  tutor_id?: string;
  descripcion_cargo: string;
}

export class BackendDatabase {
  public users: UserAccount[] = [];
  public estudiantes: Estudiante[] = [];
  public tutorPrincipal: Tutor;
  public redNeuronal: RedNeuronalPredictiva;
  public predicciones: PrediccionRiesgo[] = [];
  public alertas: Alerta[] = [];
  public intervenciones: IntervencionPedagogica[] = [];
  public interaccionesDOC: InteraccionDOC[] = [];
  public sesionesActivas: Map<string, { userId: string; createdAt: Date }> = new Map();
  public readonly dataDir: string;
  public readonly profilesFilePath: string;
  public persistenciaEstado: EstadoPersistenciaPerfiles = 'sin_archivo';
  public persistenciaError: string | null = null;
  private colaEscritura: Promise<void> = Promise.resolve();

  constructor(options?: { profilesFilePath?: string }) {
    this.profilesFilePath = options?.profilesFilePath
      ? path.resolve(options.profilesFilePath)
      : path.join(resolverDirectorioDatosPrivado(), 'perfiles-estudio.json');
    this.dataDir = path.dirname(this.profilesFilePath);

    this.redNeuronal = new RedNeuronalPredictiva('v2.4-IFTS12-ANN', 0.912, 0.928, 0.905, 0.920, 1420);

    // Tutor Principal / Cátedra de IA
    this.tutorPrincipal = new Tutor(
      'tut-1201',
      'Prof. Lic. Valeria Morales',
      'vmorales@ifts12.edu.ar',
      'Cátedra de IA & Acompañamiento Pedagógico',
      'DOC-1240'
    );

    // Inicializar Estudiantes sintéticos y recuperar perfiles persistidos
    this.inicializarEstudiantes();
    this.cargarPerfilesPersistidos();

    // Inicializar Cuentas con roles y áreas asignadas
    this.inicializarUsuarios();

    // Inferencia inicial
    this.ejecutarInferenciaInicial();
  }

  private inicializarEstudiantes() {
    // 1. Álex Martínez (Estudiante Principal)
    const estAlex = new Estudiante(
      'est-alex-12',
      'Álex Martínez',
      'alex.martinez@alumnos.ifts12.edu.ar',
      'L-25012',
      'Visual-Sintético',
      '2026-1C',
      'Tecnicatura en Ciencia de Datos e Inteligencia Artificial'
    );
    estAlex.completar_onboarding({
      horas_trabajo_semanal: 38,
      minutos_viaje: 75,
      personas_a_cargo: 1,
      nivel_estres_percibido: 7,
      ritmo_estudio: 'Fragmentado',
    });

    const cAlexEst = new Cursada('CDIA-101', 'Estadística y Probabilidad Aplicada', '2026', 75);
    cAlexEst.agregar_resultado(new ResultadoAcademico('res-alex-1', 8.5, 90, 0, 'Lectura U1 finalizada'));

    const cAlexIA = new Cursada('CDIA-102', 'Inteligencia Artificial I (Machine Learning)', '2026', 35);
    cAlexIA.agregar_resultado(new ResultadoAcademico('res-alex-2', 6.0, 75, 1, 'Avance en curso'));

    const cAlexAlg = new Cursada('CDIA-103', 'Álgebra Lineal y Computacional', '2026', 60);
    cAlexAlg.agregar_resultado(new ResultadoAcademico('res-alex-3', 7.5, 85, 0, 'Al día con matrices'));

    estAlex.cursadas = [cAlexEst, cAlexIA, cAlexAlg];

    // 2. Camila Gómez
    const estCamila = new Estudiante(
      'est-24192',
      'Camila Gómez',
      'camila.gomez@alumnos.ifts12.edu.ar',
      'L-94192',
      'Visual-Sintético',
      '2026-1C',
      'Tecnicatura en Ciencia de Datos e Inteligencia Artificial'
    );
    estCamila.completar_onboarding({
      horas_trabajo_semanal: 44,
      minutos_viaje: 95,
      personas_a_cargo: 1,
      nivel_estres_percibido: 8,
      ritmo_estudio: 'Fragmentado',
    });
    const c1Prog = new Cursada('CDIA-104', 'Programación para Ciencia de Datos (Python)', '2026', 35);
    c1Prog.agregar_resultado(new ResultadoAcademico('res-1', 5.5, 70, 2, 'Recuperatorio TP2'));
    const c1BD = new Cursada('CDIA-105', 'Bases de Datos & SQL para Analytics', '2026', 30);
    c1BD.agregar_resultado(new ResultadoAcademico('res-4', 5.0, 65, 2, 'Dificultad en consultas complejas'));
    estCamila.cursadas = [c1Prog, c1BD];

    // 3. Juan Manuel Pérez
    const estJuan = new Estudiante(
      'est-24155',
      'Juan Manuel Pérez',
      'juan.perez@alumnos.ifts12.edu.ar',
      'L-24155',
      'Práctico-Secuencial',
      '2025-2C',
      'Tecnicatura Superior en Desarrollo de Software'
    );
    estJuan.completar_onboarding({
      horas_trabajo_semanal: 30,
      minutos_viaje: 45,
      personas_a_cargo: 1,
      nivel_estres_percibido: 6,
      ritmo_estudio: 'Regular',
    });
    const c2Alg = new Cursada('TSDS-201', 'Algoritmos y Estructuras de Datos', '2026', 55);
    c2Alg.agregar_resultado(new ResultadoAcademico('res-5', 7.0, 85, 0));
    const c2Red = new Cursada('TSDS-202', 'Redes y Comunicaciones', '2026', 50);
    c2Red.agregar_resultado(new ResultadoAcademico('res-6', 6.5, 78, 1));
    estJuan.cursadas = [c2Alg, c2Red];

    this.estudiantes = [estAlex, estCamila, estJuan];
  }

  private inicializarUsuarios() {
    this.users = [
      {
        id: 'user-est-alex',
        email: 'alex.martinez@alumnos.ifts12.edu.ar',
        legajo: 'L-25012',
        nombre: 'Álex Martínez',
        passwordHash: 'doce2026',
        rol: 'estudiante',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante'],
        estudiante_id: 'est-alex-12',
        descripcion_cargo: 'Estudiante · Tecnicatura en Ciencia de Datos e IA',
      },
      {
        id: 'user-est-camila',
        email: 'camila.gomez@alumnos.ifts12.edu.ar',
        legajo: 'L-94192',
        nombre: 'Camila Gómez',
        passwordHash: 'doce2026',
        rol: 'estudiante',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante'],
        estudiante_id: 'est-24192',
        descripcion_cargo: 'Estudiante (1º Año) · Tecnicatura en Ciencia de Datos e IA',
      },
      {
        id: 'user-est-juan',
        email: 'juan.perez@alumnos.ifts12.edu.ar',
        legajo: 'L-24155',
        nombre: 'Juan Manuel Pérez',
        passwordHash: 'doce2026',
        rol: 'estudiante',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante'],
        estudiante_id: 'est-24155',
        descripcion_cargo: 'Estudiante (2º Año) · Tecnicatura en Desarrollo de Software',
      },
      {
        id: 'user-tutor-valeria',
        email: 'vmorales@ifts12.edu.ar',
        legajo: 'DOC-1240',
        nombre: 'Prof. Lic. Valeria Morales',
        passwordHash: 'doce2026',
        rol: 'tutor',
        area_asignada: 'tutor',
        areas_permitidas: ['tutor'],
        tutor_id: 'tut-1201',
        descripcion_cargo: 'Cátedra de IA & Acompañamiento Pedagógico',
      },
      {
        id: 'user-com-lucia',
        email: 'lramos@ifts12.edu.ar',
        legajo: 'COM-1206',
        nombre: 'Lic. Lucía Ramos',
        passwordHash: 'doce2026',
        rol: 'comunicacion',
        area_asignada: 'campana',
        areas_permitidas: ['campana'],
        descripcion_cargo: 'Equipo de Medios & Identidad Institucional (Grupo 6)',
      },
      {
        id: 'user-ia-roberto',
        email: 'rsanchez@ifts12.edu.ar',
        legajo: 'IA-1204',
        nombre: 'Ing. Roberto Sánchez',
        passwordHash: 'doce2026',
        rol: 'investigador_ia',
        area_asignada: 'lab',
        areas_permitidas: ['lab'],
        descripcion_cargo: 'Cátedra de IA & Sistemas · Laboratorio de Modelos',
      },
      {
        id: 'user-adm-direccion',
        email: 'direccion@ifts12.edu.ar',
        legajo: 'ADM-1200',
        nombre: 'Coordinación General IFTS N.º 12',
        passwordHash: 'doce2026',
        rol: 'admin',
        area_asignada: 'estudiante',
        areas_permitidas: ['estudiante', 'tutor', 'campana', 'lab'],
        descripcion_cargo: 'Dirección y Secretaría Académica',
      },
    ];
  }

  private ejecutarInferenciaInicial() {
    this.predicciones = [];
    this.alertas = [];

    for (const est of this.estudiantes) {
      const vector = est.obtener_vector_ia();
      const { prediccion, alerta } = this.redNeuronal.evaluar_riesgo(vector, est.id_usuario);
      this.predicciones.push(prediccion);
      if (alerta) {
        this.alertas.push(alerta);
      }
    }

    // Alerta histórica ya atendida para demostrar el flujo completo
    const alertaHistorica = new Alerta(
      'alt-historica-01',
      'pred-hist-01',
      'est-24155',
      'Sobrecarga por horario rotativo en planta industrial y primera entrega atrasada en Redes',
      ['Sobrecarga Laboral', 'Traslado CABA/AMBA'],
      'Atendida',
      new Date(Date.now() - 86400000 * 5).toISOString()
    );
    alertaHistorica.intervencion_asociada_id = 'int-hist-01';
    this.alertas.push(alertaHistorica);

    const intervencionHistorica = new IntervencionPedagogica(
      'int-hist-01',
      alertaHistorica.id_alerta,
      alertaHistorica.estudiante_id,
      this.tutorPrincipal.id_usuario,
      'Plan de contingencia laboral',
      'Se acordó entrega de trabajos prácticos en formato asincrónico con defensa remota los días sábados.',
      'El alumno mantiene buen rendimiento en evaluaciones prácticas; su dificultad radica exclusivamente en la superposición horaria.',
      new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]
    );
    this.intervenciones.push(intervencionHistorica);

    // Mensaje de bienvenida inicial de DOC
    this.interaccionesDOC.push(
      new InteraccionDOC(
        'int-welcome-01',
        'est-alex-12',
        'Hola DOC, estoy con la lectura de Inteligencia Artificial I.',
        '¡Hola Álex! Soy DOC, tu compañero de estudio. Noté que esta lectura viene densa, ¿querés que la desglosemos en 3 puntos clave o usemos una plantilla de síntesis? ¡Vamos paso a paso!',
        'motivacion',
        false
      )
    );
  }

  // Métodos de Autenticación
  public autenticar(identificador: string, pass: string): { user: UserAccount; token: string } | null {
    const ident = identificador.trim().toLowerCase();
    const user = this.users.find(
      (u) =>
        u.email.toLowerCase() === ident ||
        u.legajo.toLowerCase() === ident ||
        (u.rol === 'tutor' && (ident.includes('valeria') || ident.includes('morales') || ident.includes('valenzuela') || ident === 'doc-1240')) ||
        (u.id === 'user-est-camila' && (ident === 'l-94192' || ident === 'l-24192' || ident.includes('camila') || ident.includes('94192'))) ||
        u.nombre.toLowerCase().includes(ident) ||
        u.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(ident.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    );

    if (!user) return null;

    // Validación de password (permite 'ifts12', 'doce2026', '123456' o demo)
    if (pass && pass.trim() !== '' && pass !== 'ifts12' && pass !== 'doce2026' && pass !== '123456') {
      return null;
    }

    const token = `token-${user.id}-${Date.now()}`;
    this.sesionesActivas.set(token, { userId: user.id, createdAt: new Date() });
    return { user, token };
  }

  public obtenerUsuarioPorToken(token: string): UserAccount | null {
    const sesion = this.sesionesActivas.get(token);
    if (!sesion) return null;
    return this.users.find((u) => u.id === sesion.userId) || null;
  }

  public cerrarSesion(token: string): boolean {
    return this.sesionesActivas.delete(token);
  }

  private clonarPerfil(perfil: PerfilEstudio | null): PerfilEstudio | null {
    if (!perfil) return null;
    const copia = new PerfilEstudio(
      perfil.id_perfil,
      perfil.estudiante_id,
      perfil.horas_trabajo_semanal,
      perfil.minutos_viaje,
      perfil.personas_a_cargo,
      perfil.nivel_estres_percibido,
      perfil.ritmo_estudio
    );
    copia.fecha_actualizacion = perfil.fecha_actualizacion;
    return copia;
  }

  private validarRegistroPersistido(studentId: string, rawPerfil: unknown): PerfilEstudioPersistido | null {
    if (rawPerfil === null) {
      return null;
    }
    if (!rawPerfil || typeof rawPerfil !== 'object' || Array.isArray(rawPerfil)) {
      throw new Error(`El perfil guardado para ${studentId} no es un objeto válido.`);
    }

    const p = rawPerfil as Record<string, unknown>;
    if (typeof p.id_perfil !== 'string' || p.id_perfil.trim() === '') {
      throw new Error(`id_perfil inválido para ${studentId}.`);
    }
    if (typeof p.estudiante_id !== 'string' || p.estudiante_id !== studentId) {
      throw new Error(`estudiante_id inconsistente para ${studentId}.`);
    }
    if (typeof p.fecha_actualizacion !== 'string' || Number.isNaN(Date.parse(p.fecha_actualizacion))) {
      throw new Error(`fecha_actualizacion inválida para ${studentId}.`);
    }

    const horas = Number(p.horas_trabajo_semanal);
    const viaje = Number(p.minutos_viaje);
    const personas = Number(p.personas_a_cargo);
    const estres = Number(p.nivel_estres_percibido);
    const ritmo = p.ritmo_estudio as RitmoEstudio;

    if (
      !Number.isFinite(horas) ||
      horas < 0 ||
      horas > 168 ||
      !Number.isFinite(viaje) ||
      viaje < 0 ||
      viaje > 600 ||
      !Number.isFinite(personas) ||
      personas < 0 ||
      personas > 20 ||
      !Number.isFinite(estres) ||
      estres < 1 ||
      estres > 10 ||
      !RITMOS_VALIDOS.includes(ritmo)
    ) {
      throw new Error(`Valores socio-laborales fuera de rango para ${studentId}.`);
    }

    return {
      id_perfil: p.id_perfil,
      estudiante_id: studentId,
      horas_trabajo_semanal: horas,
      minutos_viaje: viaje,
      personas_a_cargo: personas,
      nivel_estres_percibido: estres,
      ritmo_estudio: ritmo,
      fecha_actualizacion: p.fecha_actualizacion,
    };
  }

  public cargarPerfilesPersistidos(): void {
    if (!fs.existsSync(this.profilesFilePath)) {
      this.persistenciaEstado = 'sin_archivo';
      this.persistenciaError = null;
      return;
    }

    try {
      const contenido = fs.readFileSync(this.profilesFilePath, 'utf8');
      const parsed = JSON.parse(contenido) as Partial<ArchivoPerfilesPersistidos>;

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed) ||
        !parsed.perfiles ||
        typeof parsed.perfiles !== 'object' ||
        Array.isArray(parsed.perfiles)
      ) {
        throw new Error('Estructura raíz inválida en el archivo de perfiles.');
      }

      const perfilesValidados = new Map<string, PerfilEstudio | null>();

      for (const [studentId, rawPerfil] of Object.entries(parsed.perfiles)) {
        const estudiante = this.estudiantes.find((e) => e.id_usuario === studentId);
        if (!estudiante) {
          throw new Error(`Identificador de estudiante desconocido en persistencia: ${studentId}.`);
        }

        const registroValido = this.validarRegistroPersistido(studentId, rawPerfil);
        if (registroValido === null) {
          perfilesValidados.set(studentId, null);
        } else {
          const instancia = new PerfilEstudio(
            registroValido.id_perfil,
            estudiante.id_usuario,
            registroValido.horas_trabajo_semanal,
            registroValido.minutos_viaje,
            registroValido.personas_a_cargo,
            registroValido.nivel_estres_percibido,
            registroValido.ritmo_estudio
          );
          instancia.fecha_actualizacion = registroValido.fecha_actualizacion;
          perfilesValidados.set(studentId, instancia);
        }
      }

      for (const [studentId, perfilInstancia] of perfilesValidados.entries()) {
        const estudiante = this.estudiantes.find((e) => e.id_usuario === studentId);
        if (estudiante) {
          estudiante.perfilEstudio = perfilInstancia;
        }
      }

      this.persistenciaEstado = 'cargada';
      this.persistenciaError = null;
    } catch (err: any) {
      this.persistenciaEstado = 'error_lectura_o_corrupto';
      this.persistenciaError = `No se pudo recuperar la persistencia local de perfiles (${path.basename(
        this.profilesFilePath
      )}): ${err?.message || 'archivo corrupto o ilegible'}`;
      console.error(`[DOCE][Persistencia] ${this.persistenciaError}`);
    }
  }

  private construirSnapshotPerfiles(): ArchivoPerfilesPersistidos {
    const perfiles: Record<string, PerfilEstudioPersistido | null> = {};
    for (const est of this.estudiantes) {
      if (!est.perfilEstudio) {
        perfiles[est.id_usuario] = null;
      } else {
        perfiles[est.id_usuario] = {
          id_perfil: est.perfilEstudio.id_perfil,
          estudiante_id: est.id_usuario,
          horas_trabajo_semanal: est.perfilEstudio.horas_trabajo_semanal,
          minutos_viaje: est.perfilEstudio.minutos_viaje,
          personas_a_cargo: est.perfilEstudio.personas_a_cargo,
          nivel_estres_percibido: est.perfilEstudio.nivel_estres_percibido,
          ritmo_estudio: est.perfilEstudio.ritmo_estudio,
          fecha_actualizacion: est.perfilEstudio.fecha_actualizacion,
        };
      }
    }
    return {
      version: 1,
      actualizado_en: new Date().toISOString(),
      perfiles,
    };
  }

  private async escribirArchivoAtomico(snapshot: ArchivoPerfilesPersistidos): Promise<void> {
    await fs.promises.mkdir(this.dataDir, { recursive: true, mode: 0o700 });
    try {
      await fs.promises.chmod(this.dataDir, 0o700);
    } catch {}

    const tmpPath = `${this.profilesFilePath}.tmp.${process.pid}.${Date.now()}`;
    const payload = JSON.stringify(snapshot, null, 2);

    let fileHandle: fs.promises.FileHandle | null = null;
    try {
      fileHandle = await fs.promises.open(tmpPath, 'w', 0o600);
      await fileHandle.writeFile(payload, 'utf8');
      await fileHandle.sync();
      await fileHandle.close();
      fileHandle = null;

      await fs.promises.rename(tmpPath, this.profilesFilePath);
      try {
        await fs.promises.chmod(this.profilesFilePath, 0o600);
      } catch {}
    } catch (err) {
      if (fileHandle) {
        try {
          await fileHandle.close();
        } catch {}
      }
      try {
        await fs.promises.unlink(tmpPath);
      } catch {}
      throw err;
    }
  }

  public actualizarPerfilEstudiantePersistente(
    studentId: string,
    datos: {
      horas_trabajo_semanal: number;
      minutos_viaje: number;
      personas_a_cargo: number;
      nivel_estres_percibido: number;
      ritmo_estudio: RitmoEstudio;
    }
  ): Promise<PerfilEstudio> {
    const operacion = this.colaEscritura.then(async () => {
      if (this.persistenciaEstado === 'error_lectura_o_corrupto') {
        const error = new Error(
          this.persistenciaError ||
            'El archivo de persistencia local está corrupto; escritura bloqueada para evitar pérdida de datos.'
        ) as Error & { code?: string };
        error.code = 'PERSISTENCE_CORRUPT';
        throw error;
      }

      const estudiante = this.estudiantes.find((e) => e.id_usuario === studentId);
      if (!estudiante) {
        const error = new Error('Perfil de estudiante no encontrado.') as Error & { code?: string };
        error.code = 'STUDENT_NOT_FOUND';
        throw error;
      }

      const perfilPrevio = this.clonarPerfil(estudiante.perfilEstudio);

      if (estudiante.perfilEstudio) {
        estudiante.perfilEstudio.actualizar_perfil(datos);
      } else {
        estudiante.completar_onboarding(datos);
      }

      try {
        const snapshot = this.construirSnapshotPerfiles();
        await this.escribirArchivoAtomico(snapshot);
        this.persistenciaEstado = 'cargada';
        this.persistenciaError = null;
        return this.clonarPerfil(estudiante.perfilEstudio)!;
      } catch (err) {
        estudiante.perfilEstudio = perfilPrevio;
        throw err;
      }
    });

    this.colaEscritura = operacion.then(
      () => undefined,
      () => undefined
    );

    return operacion;
  }
}

// Instancia singleton en memoria con persistencia local privada para el servidor
export const backendDB = new BackendDatabase();
