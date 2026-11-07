/**
 * Formatos.gs · GENERADO desde el bloque COMPARTIDO de index.html.
 * Definición de las bitácoras FO-SLH-MTO, reglas de alerta y flujo de tickets.
 * No lo edites a mano: cambia index.html y vuelve a copiar el bloque.
 */
/* ==== COMPARTIDO INICIO ====
   Este bloque se copia tal cual a Formatos.gs (backend). Si cambias un formato, cambia ambos. */
const FORMATOS = {
  'FO-SLH-MTO-005': {
    corto: 'Manifold de oxígeno', titulo: 'Bitácora diaria · Manifold (oxígeno)', freq: 24, fotos: 'una',
    nota: 'Se realiza todos los días; por turno si es necesario.',
    campos: [
      { k: 'bancadaIzq', l: 'Bancada izquierda', col: 'Bancada izquierda', t: 'num', u: 'psi', req: 1 },
      { k: 'bancadaDer', l: 'Bancada derecha', col: 'Bancada derecha', t: 'num', u: 'psi', req: 1 },
      { k: 'dewar', l: 'Nivel Dewar', col: 'Nivel Dewar', t: 'num', u: 'psi' },
      { k: 'tanquesVacios', l: 'Tanques vacíos', col: 'Tanques vacíos', t: 'int' },
      { k: 'tanquesLlenos', l: 'Tanques llenos', col: 'Tanques llenos', t: 'int' },
      { k: 'areaLimpia', l: 'Área limpia', col: 'Área limpia', t: 'bool', req: 1, bueno: 'Sí' },
      { k: 'lbsIzq', l: 'Libras usadas el día anterior · bancada izquierda', col: 'Libras día ant. izq.', t: 'num', u: 'lbs' },
      { k: 'lbsDer', l: 'Libras usadas el día anterior · bancada derecha', col: 'Libras día ant. der.', t: 'num', u: 'lbs' },
      { k: 'cambio', l: '¿Se cambiaron tanques?', col: 'Cambio de tanques', t: 'bool', req: 1 },
      { k: 'cambioBancada', l: 'Bancada del cambio', col: 'Bancada del cambio', t: 'sel', o: ['Izquierda', 'Derecha', 'Ambas'], si: 'cambio=Sí', req: 1 },
      { k: 'cambioNum', l: 'No. de tanques cambiados', col: 'No. tanques', t: 'int', si: 'cambio=Sí', req: 1 },
      { k: 'obs', l: 'Observaciones', col: 'Observaciones', t: 'area' }
    ]
  },
  'FO-SLH-MTO-006': {
    corto: 'Nitrógeno / CO2', titulo: 'Bitácora diaria de Nitrógeno / CO2', freq: 24, fotos: 'una',
    nota: 'Se realiza todos los días; por turno si es necesario.',
    campos: [
      { k: 'presionN2', l: 'Presión de nitrógeno', col: 'Presión nitrógeno', t: 'num', u: 'psi', req: 1 },
      { k: 'presionCO2', l: 'Presión de CO2', col: 'Presión CO2', t: 'num', u: 'psi', req: 1 },
      { k: 'obs', l: 'Observaciones', col: 'Observaciones', t: 'area' }
    ]
  },
  'FO-SLH-MTO-001': {
    corto: 'Planta de emergencia', titulo: 'Bitácora de revisión y prueba de planta de emergencia', freq: 168, fotos: 'una',
    campos: [
      { k: 'nivelAgua', l: 'Nivel de agua', col: 'Nivel de agua', t: 'sel', o: ['Correcto', 'Bajo'], bueno: 'Correcto', req: 1 },
      { k: 'nivelAceite', l: 'Nivel de aceite', col: 'Nivel de aceite', t: 'sel', o: ['Correcto', 'Bajo'], bueno: 'Correcto', req: 1 },
      { k: 'diesel', l: 'Nivel de combustible diésel', col: 'Nivel diésel', t: 'num', u: '%', req: 1 },
      { k: 'tipoPrueba', l: 'Tipo de prueba', col: 'Tipo de prueba', t: 'sel', o: ['Con carga', 'En vacío'], req: 1 },
      { k: 'tiempoArranque', l: 'Tiempo de arranque', col: 'Tiempo de arranque', t: 'num', u: 's', req: 1 },
      { k: 'modoArranque', l: 'Arranque', col: 'Aut / Man', t: 'sel', o: ['Automático', 'Manual'], req: 1 },
      { k: 'danos', l: '¿Presenta daños en la superficie?', col: 'Daños superficie', t: 'bool', malo: 'Sí', req: 1 },
      { k: 'obs', l: 'Observaciones', col: 'Observaciones', t: 'area' }
    ]
  },
  'FO-SLH-MTO-002': {
    corto: 'Aires acondicionados', titulo: 'Bitácora de servicios preventivos y correctivos a los aires acondicionados', freq: 0, fotos: 'antesDespues',
    colPunto: 'No. A/C',
    campos: [
      { k: 'tipoServicio', l: 'Tipo de servicio', col: 'Preventivo o correctivo', t: 'sel', o: ['Preventivo', 'Correctivo'], req: 1 },
      { k: 'reparacion', l: 'Reparación realizada y/o observaciones', col: 'Reparación realizada / observaciones', t: 'area', req: 1 },
      { k: 'ejecutor', l: '¿Quién realizó el servicio?', col: 'Interno o proveedor', t: 'sel', o: ['Personal interno', 'Proveedor externo'], req: 1 },
      { k: 'proveedor', l: 'Proveedor y nombre del técnico externo', col: 'Proveedor', t: 'txt', si: 'ejecutor=Proveedor externo', req: 1 }
    ]
  },
  'FO-SLH-MTO-007': {
    corto: 'Agua potable y cloro', titulo: 'Registro del nivel de agua potable en cisterna y monitorización del cloro residual', freq: 24, fotos: 'una',
    nota: 'Rango aceptable: cloro residual de 0.2 a 1.5 mg/L y pH de 6.0 a 9.0. Si hay niveles bajos, aplica el cloro necesario hasta alcanzar el rango.',
    instrucciones: ['Enjuaga el contenedor del kit.', 'Toma la muestra de agua para medir cloro residual y pH.', 'Aplica 5 gotas del reactivo de cloro y 5 gotas del reactivo de pH en cada muestra.', 'Tapa cada muestra y agita para diluir el reactivo.', 'Con buena luz y sobre fondo blanco compara el color de cada muestra y anota el valor.', 'Valida que los resultados estén dentro del rango.'],
    campos: [
      { g: 'Cisterna', k: 'cisPh', l: 'pH', col: 'Cisterna pH', t: 'num', u: '', lim: [6, 9], req: 1 },
      { g: 'Cisterna', k: 'cisCl', l: 'Cloro', col: 'Cisterna Cl', t: 'num', u: 'mg/L', lim: [0.2, 1.5], req: 1 },
      { g: 'Cisterna', k: 'cisNivel', l: 'Nivel', col: 'Cisterna nivel %', t: 'num', u: '%', req: 1 },
      { g: 'CEYE', k: 'ceyePh', l: 'pH', col: 'CEYE pH', t: 'num', u: '', lim: [6, 9], req: 1 },
      { g: 'CEYE', k: 'ceyeCl', l: 'Cloro', col: 'CEYE Cl', t: 'num', u: 'mg/L', lim: [0.2, 1.5], req: 1 },
      { g: 'UCI', k: 'uciPh', l: 'pH', col: 'UCI pH', t: 'num', u: '', lim: [6, 9], req: 1 },
      { g: 'UCI', k: 'uciCl', l: 'Cloro', col: 'UCI Cl', t: 'num', u: 'mg/L', lim: [0.2, 1.5], req: 1 },
      { g: 'Otro punto del hospital', k: 'lugar', l: 'Lugar', col: 'Lugar', t: 'txt' },
      { g: 'Otro punto del hospital', k: 'lugPh', l: 'pH', col: 'Lugar pH', t: 'num', u: '', lim: [6, 9] },
      { g: 'Otro punto del hospital', k: 'lugCl', l: 'Cloro', col: 'Lugar Cl', t: 'num', u: 'mg/L', lim: [0.2, 1.5] },
      { g: 'Quirófano', k: 'quiPh', l: 'pH', col: 'Quirófano pH', t: 'num', u: '', lim: [6, 9], req: 1 },
      { g: 'Quirófano', k: 'quiCl', l: 'Cloro', col: 'Quirófano Cl', t: 'num', u: 'mg/L', lim: [0.2, 1.5], req: 1 },
      { g: 'Acción y observaciones', k: 'cloroAplicado', l: '¿Se aplicó cloro para corregir?', col: 'Cloro aplicado', t: 'bool' },
      { g: 'Acción y observaciones', k: 'obs', l: 'Observaciones', col: 'Observaciones', t: 'area' }
    ]
  },
  'FO-SLH-MTO-009': {
    corto: 'Mantenimiento de instalaciones', titulo: 'Check list para mantenimiento de instalaciones', freq: 0, fotos: 'antesDespues', libre: true,
    nota: 'Debe llenarse completo y llevar la firma del área solicitante para ser válido.',
    campos: [
      { k: 'area', l: 'Área', col: 'Área', t: 'txt', req: 1 },
      { k: 'danos', l: 'Daños observados en las instalaciones', col: 'Daños observados', t: 'checks', alerta: 'marcados',
        o: ['Grietas en paredes', 'Grietas en piso', 'Mobiliario', 'Falta de pintura', 'Pandeo o fractura en columnas', 'Daños en bardas exteriores', 'Daño en plafones', 'Daño en lámparas', 'Daños en fachada', 'Daño en elevador', 'Daño en instalaciones eléctricas, plomería, etc.'] },
      { k: 'especifique', l: 'Especifique', col: 'Especifique', t: 'txt' },
      { k: 'actividades', l: 'Actividades realizadas por mantenimiento', col: 'Actividades realizadas', t: 'area', req: 1 },
      { k: 'firmaArea', l: 'Firma del responsable del área', col: 'Firma del área', t: 'firma', req: 1 }
    ]
  },
  'PRESION': {
    corto: 'Cilindros y manómetros', titulo: 'Revisión de cilindros y manómetros', freq: 24, fotos: 'una', sinCodigo: true,
    campos: [
      { k: 'valor', l: 'Presión leída', col: 'Presión', t: 'num', u: '@', req: 1 },
      { k: 'verif', l: 'Verificación', col: 'Verificación', t: 'checks', alerta: 'faltantes', o: ['Sin fugas audibles', 'Válvula, regulador y conexiones en buen estado', 'Sujeción adecuada', 'Identificación legible'] },
      { k: 'obs', l: 'Observaciones', col: 'Observaciones', t: 'area' }
    ]
  }
};
const ORDEN_FORMATOS = ['FO-SLH-MTO-005', 'FO-SLH-MTO-006', 'FO-SLH-MTO-007', 'FO-SLH-MTO-001', 'FO-SLH-MTO-002', 'FO-SLH-MTO-009', 'PRESION'];
const ROLES_SUP = ['MANTENIMIENTO', 'SH', 'ADMIN'];
function esSupervisor(rol) { return ROLES_SUP.indexOf(rol) >= 0; }
function num(v) { if (v === null || v === undefined || v === '') return null; const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; }
function unidadDe(c, punto) { return c.u === '@' ? ((punto && punto.unidad) || 'psi') : (c.u || ''); }
function campoActivo(c, d) { if (!c.si) return true; const p = c.si.split('='); return String(d[p[0]] || '') === p[1]; }
function limiteDe(c, punto) {
  const L = punto && punto.limites && punto.limites[c.k];
  const r = L && (num(L[0]) !== null || num(L[1]) !== null) ? L : c.lim;
  return r ? [num(r[0]), num(r[1])] : null;
}
function frecuenciaDe(punto) {
  const F = FORMATOS[punto.formato] || {};
  const f = num(punto.frecuenciaHoras);
  return f === null ? (F.freq || 0) : f;
}
/* Devuelve la lista de alertas de un registro según los rangos del punto o del formato */
function evaluar(formato, punto, d) {
  const F = FORMATOS[formato]; const al = [];
  if (!F) return al;
  F.campos.forEach(function (c) {
    if (!campoActivo(c, d)) return;
    const v = d[c.k];
    if (c.t === 'num' || c.t === 'int') {
      const n = num(v); const L = limiteDe(c, punto); if (n === null || !L) return;
      const nombre = c.g ? c.g + ' ' + c.l : c.l; const u = unidadDe(c, punto);
      if (L[0] !== null && n < L[0]) al.push(nombre + ': ' + n + (u ? ' ' + u : '') + ' (mínimo ' + L[0] + ')');
      else if (L[1] !== null && n > L[1]) al.push(nombre + ': ' + n + (u ? ' ' + u : '') + ' (máximo ' + L[1] + ')');
    } else if (c.bueno !== undefined && v && v !== c.bueno) al.push(c.l + ': ' + v);
    else if (c.malo !== undefined && v === c.malo) al.push(c.l + ': ' + v);
    else if (c.t === 'checks') {
      const sel = Array.isArray(v) ? v : [];
      if (c.alerta === 'marcados' && sel.length) al.push(c.l + ': ' + sel.join(', '));
      if (c.alerta === 'faltantes') { const f = c.o.filter(function (x) { return sel.indexOf(x) < 0; }); if (f.length) al.push('No cumple: ' + f.join(', ')); }
    }
  });
  return al;
}
/* Valida campos obligatorios; devuelve lista de errores */
function validar(formato, punto, d) {
  const F = FORMATOS[formato]; const err = [];
  F.campos.forEach(function (c) {
    if (!campoActivo(c, d) || !c.req) return;
    const v = d[c.k];
    if (c.t === 'num' || c.t === 'int') { if (num(v) === null) err.push(c.g ? c.g + ' · ' + c.l : c.l); }
    else if (c.t === 'checks') { /* opcional por naturaleza */ }
    else if (c.t === 'firma') { if (!v || !d[c.k + 'Nombre']) err.push(c.l + ' (nombre y firma)'); }
    else if (!v || !String(v).trim()) err.push(c.g ? c.g + ' · ' + c.l : c.l);
  });
  return err;
}
/* Reglas del flujo de tickets */
function aplicarAccion(t, d, me) {
  const ahora = new Date().toISOString(); const p = {}; let estado = null;
  const sup = esSupervisor(me.rol); const yo = String(me.numero);
  switch (d.accion) {
    case 'aceptar':
      if (['Enviado', 'Reabierto'].indexOf(t.estado) < 0) throw new Error('El ticket ya fue tomado');
      if (me.rol !== 'TECNICO' && !sup) throw new Error('Sin permiso');
      estado = 'Aceptado'; p.asignadoA = yo; p.asignadoNombre = me.nombre; p.fechaAceptado = ahora; break;
    case 'asignar':
      if (!sup) throw new Error('Solo el jefe de mantenimiento puede asignar');
      if (!d.tecnico) throw new Error('Elige un técnico');
      estado = 'Aceptado'; p.asignadoA = String(d.tecnico); p.asignadoNombre = d.tecnicoNombre || d.tecnico; p.fechaAceptado = ahora; break;
    case 'iniciar':
      if (String(t.asignadoA) !== yo && !sup) throw new Error('El ticket está asignado a otra persona');
      if (['Aceptado', 'Reabierto'].indexOf(t.estado) < 0) throw new Error('Primero acepta el ticket');
      estado = 'En proceso'; p.fechaInicio = ahora; if (d.fotoAntes) p.fotoAntes = d.fotoAntes; break;
    case 'completar':
      if (String(t.asignadoA) !== yo && !sup) throw new Error('El ticket está asignado a otra persona');
      if (['Aceptado', 'En proceso', 'Reabierto'].indexOf(t.estado) < 0) throw new Error('El ticket no está en proceso');
      if (!d.trabajoRealizado) throw new Error('Describe el trabajo realizado');
      if (!d.fotoDespues) throw new Error('Agrega la foto del después');
      estado = 'Realizado'; p.fechaRealizado = ahora; p.trabajoRealizado = d.trabajoRealizado; p.materiales = d.materiales || ''; p.fotoDespues = d.fotoDespues; p.puntoId = d.puntoId || '';
      if (d.fotoAntes) p.fotoAntes = d.fotoAntes; if (!t.fechaInicio) p.fechaInicio = ahora; break;
    case 'validar':
      if (String(t.solicitante) !== yo && !sup) throw new Error('Solo el solicitante puede validar');
      if (t.estado !== 'Realizado') throw new Error('El ticket aún no está realizado');
      estado = 'Validado'; p.validadoPor = me.nombre; p.fechaValidado = ahora; p.comentario = d.comentario || ''; break;
    case 'reabrir':
      if (String(t.solicitante) !== yo && !sup) throw new Error('Solo el solicitante puede reabrir');
      if (t.estado !== 'Realizado') throw new Error('Solo se reabre un ticket realizado');
      if (!d.comentario) throw new Error('Explica qué quedó pendiente');
      estado = 'Reabierto'; p.comentario = d.comentario; break;
    case 'cancelar':
      if (String(t.solicitante) !== yo && !sup) throw new Error('Sin permiso');
      if (['Validado', 'Cancelado'].indexOf(t.estado) >= 0) throw new Error('El ticket ya está cerrado');
      estado = 'Cancelado'; p.comentario = d.comentario || ''; break;
    default: throw new Error('Acción no válida');
  }
  p.estado = estado;
  let hist = []; try { hist = JSON.parse(t.historial || '[]'); } catch (e) {}
  hist.push({ f: ahora, e: estado, u: me.nombre, c: d.comentario || '' }); p.historial = JSON.stringify(hist);
  return p;
}
/* Al cerrar un ticket se deja constancia en la bitácora correspondiente:
   A/C (punto con formato 002) → FO-SLH-MTO-002; cualquier otro → FO-SLH-MTO-009 */
function registroDesdeTicket(t, punto) {
  if (punto && punto.formato === 'FO-SLH-MTO-002') {
    return { formato: 'FO-SLH-MTO-002', puntoId: punto.id, datos: { tipoServicio: 'Correctivo', reparacion: t.trabajoRealizado + (t.materiales ? ' · Materiales: ' + t.materiales : ''), ejecutor: 'Personal interno' }, fotoAntes: t.fotoAntes || '', fotoDespues: t.fotoDespues || '', folio: t.folio };
  }
  return { formato: 'FO-SLH-MTO-009', puntoId: '', datos: { area: t.area + (t.ubicacion ? ' · ' + t.ubicacion : ''), danos: [], especifique: t.categoria + ': ' + t.descripcion, actividades: t.trabajoRealizado + (t.materiales ? ' · Materiales: ' + t.materiales : ''), firmaArea: t.firmaSolicitante || '', firmaAreaNombre: t.solicitanteNombre }, fotoAntes: t.fotoAntes || '', fotoDespues: t.fotoDespues || '', folio: t.folio };
}
/* ==== COMPARTIDO FIN ==== */
