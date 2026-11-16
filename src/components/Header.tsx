/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  BrainCircuit,
  Palette,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { Estudiante, Tutor, AreaSistema } from '../domain/models.js';
import { AuthUserResponse } from '../services/api.js';

interface HeaderProps {
  vistaActiva: AreaSistema;
  onCambiarVista?: (vista: AreaSistema) => void;
  usuario: AuthUserResponse;
  onCerrarSesion: () => void;
  estudiantes: Estudiante[];
  estudianteActual: Estudiante;
  onSeleccionarEstudiante: (est: Estudiante) => void;
  tutor: Tutor;
  totalAlertasPendientes: number;
}

export const Header: React.FC<HeaderProps> = ({
  vistaActiva,
  usuario,
  onCerrarSesion,
  estudiantes,
  estudianteActual,
  onSeleccionarEstudiante,
  totalAlertasPendientes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F1]/95 backdrop-blur-md border-b border-[#E5DFD3]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-2 gap-y-2 py-2.5 lg:py-0 lg:h-16">
          {/* Brand & Slogan con El Punto Verde como Firma */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#263A50] text-[#FAF8F1] flex items-center justify-center font-serif text-base sm:text-lg font-bold shadow-xs shrink-0 border border-[#263A50]/80">
              <span className="relative">
                D
                <span className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-[#819783]" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-serif text-[#263A50] text-lg sm:text-xl font-bold tracking-tight shrink-0">
                  DOCE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#819783] inline-block shrink-0" title="El punto verde como firma" />
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EEE7D7] text-[#263A50] border border-[#DDD4C0] whitespace-nowrap shrink-0">
                  IFTS N.º 12
                </span>
                <span className="hidden xl:inline-block text-[11px] text-[#586879] font-medium whitespace-nowrap">
                  Grupo 6
                </span>
              </div>
              <p className="text-xs text-[#586879] hidden sm:block truncate max-w-[320px] xl:max-w-none">
                DOCE. Tu Compañero de Estudio. · Tecnicatura en Ciencia de Datos e IA
              </p>
            </div>
          </div>

          {/* Área Asignada Únicamente por Inicio de Sesión de Usuario (Sin cambio manual de roles) */}
          <nav
            aria-label="Área institucional activa"
            className="order-3 lg:order-2 w-full lg:w-auto flex items-center justify-between lg:justify-center px-3 py-1.5 bg-[#EEE7D7]/70 rounded-xl border border-[#E2DBCF]"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#263A50] min-w-0">
              {vistaActiva === 'estudiante' && (
                <>
                  <GraduationCap className="w-4 h-4 stroke-[1.75] text-[#819783] shrink-0" />
                  <span className="whitespace-nowrap">Área Estudiante</span>
                </>
              )}

              {vistaActiva === 'tutor' && (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[1.75] text-[#819783] shrink-0" />
                  <span className="whitespace-nowrap">Portal Tutoría</span>
                  {totalAlertasPendientes > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#819783] text-white whitespace-nowrap shrink-0">
                      {totalAlertasPendientes} {totalAlertasPendientes === 1 ? 'alerta' : 'alertas'}
                    </span>
                  )}
                </>
              )}

              {vistaActiva === 'campana' && (
                <>
                  <Palette className="w-4 h-4 stroke-[1.75] text-[#819783] shrink-0" />
                  <span className="whitespace-nowrap">Identidad & Campaña</span>
                </>
              )}

              {vistaActiva === 'lab' && (
                <>
                  <BrainCircuit className="w-4 h-4 stroke-[1.75] text-[#819783] shrink-0" />
                  <span className="whitespace-nowrap">Laboratorio IA & UML</span>
                </>
              )}
            </div>
          </nav>

          {/* User Profile & Logout Action */}
          <div className="order-2 lg:order-3 flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Si es vista estudiante y hay selección disponible */}
            {vistaActiva === 'estudiante' && usuario.rol === 'admin' ? (
              <div className="relative group shrink-0">
                <label htmlFor="student-selector" className="sr-only">
                  Seleccionar estudiante
                </label>
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#E5DFD3] rounded-xl px-2 sm:px-2.5 py-1.5 transition-colors shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-[#EEE7D7] text-[#263A50] flex items-center justify-center font-bold text-xs font-serif shrink-0">
                    {estudianteActual.nombre.charAt(0)}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-semibold text-[#263A50] flex items-center space-x-1">
                      <span>{estudianteActual.nombre}</span>
                      <span className="text-[10px] text-[#586879] font-mono">
                        ({estudianteActual.legajo})
                      </span>
                    </div>
                  </div>
                  <select
                    id="student-selector"
                    aria-label="Seleccionar estudiante activo"
                    value={estudianteActual.id_usuario}
                    onChange={(e) => {
                      const est = estudiantes.find((s) => s.id_usuario === e.target.value);
                      if (est) onSeleccionarEstudiante(est);
                    }}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  >
                    {estudiantes.map((e) => (
                      <option key={e.id_usuario} value={e.id_usuario} className="bg-white text-[#263A50]">
                        {e.nombre} - Legajo {e.legajo}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#586879] shrink-0" />
                </div>
              </div>
            ) : null}

            {/* Perfil del Usuario Activo */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 bg-[#FFFFFF] border border-[#E5DFD3] rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs shrink-0">
              <div
                className="w-7 h-7 rounded-lg bg-[#263A50] text-[#FAF8F1] flex items-center justify-center font-serif font-bold text-xs shrink-0"
                title={`${usuario.nombre} (${usuario.legajo})`}
              >
                {usuario.nombre.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-[#263A50] flex items-center space-x-1.5">
                  <span className="truncate max-w-[160px] xl:max-w-[220px]">{usuario.nombre}</span>
                  <span className="text-[10px] text-[#819783] font-mono shrink-0">
                    {usuario.legajo}
                  </span>
                </div>
                <div className="text-[10px] text-[#586879] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#819783] shrink-0" />
                  <span className="truncate max-w-[130px]">{usuario.descripcion_cargo}</span>
                </div>
              </div>

              {/* Botón Cerrar Sesión */}
              <button
                type="button"
                onClick={onCerrarSesion}
                title="Cerrar sesión institucional"
                aria-label="Cerrar sesión institucional"
                className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-lg text-[#586879] hover:text-[#922B21] hover:bg-[#FDEDEC] transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
