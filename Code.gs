/**
 * Mantenimiento SLH · Backend en Google Apps Script
 * Saint Luke's Hospitals · Mantenimiento / Seguridad e Higiene
 *
 * Archivos del proyecto: Code.gs (este), Formatos.gs (definición de las bitácoras FO-SLH-MTO,
 * generado del index.html) y appsscript.json.
 *
 * Hojas: Usuarios, Puntos, Registros, Tickets, Config y una hoja legible por formato
 * (FO-SLH-MTO-001, -002, -005, -006, -007, -009, PRESION) con las mismas columnas del papel.
 * Fotos y firmas: carpeta de Drive (Config › CARPETA_FOTOS).
 *
 * La base de datos ya está preparada en la hoja SHEET_ID; el proyecto puede ser independiente o ligado a la hoja.
 * Instalación: ejecuta setup() una vez (solo autoriza y crea la carpeta de fotos) → Implementar › Nueva implementación › Aplicación web
 * (Ejecutar como: Yo · Acceso: Cualquier usuario) → pega la URL /exec en CONFIG.API_URL del index.html.
 */

const HOJAS = {
  Usuarios: ['numero', 'pin', 'nombre', 'rol', 'area', 'sede', 'correo', 'activo', 'firma'],
  Puntos: ['id', 'nombre', 'formato', 'sede', 'ubicacion', 'unidad', 'limites', 'frecuenciaHoras', 'activo'],
  Registros: ['id', 'fecha', 'formato', 'puntoId', 'puntoNombre', 'ubicacion', 'sede', 'datos', 'alertas', 'fotoAntes', 'fotoDespues', 'usuario', 'usuarioNombre', 'firmaRealizo', 'folio', 'revisadoPor', 'revisorNombre', 'firmaReviso', 'fechaRevision', 'comentarioRevision'],
  Tickets: ['folio', 'fecha', 'area', 'sede', 'ubicacion', 'categoria', 'prioridad', 'descripcion', 'foto', 'firmaSolicitante', 'solicitante', 'solicitanteNombre', 'estado', 'asignadoA', 'asignadoNombre', 'fechaAceptado', 'fechaInicio', 'fechaRealizado', 'fotoAntes', 'fotoDespues', 'trabajoRealizado', 'materiales', 'puntoId', 'validadoPor', 'fechaValidado', 'comentario', 'historial'],
  Config: ['clave', 'valor']
};
const SESION_SEG = 21600; // 6 h, máximo de CacheService
const SHEET_ID = '1u-YqZwgfMmMt4_aDr7ot7BkZkwXUrnIewx5U5oMQLhw'; // Mantenimiento SLH · Base de datos
function libro() { return SpreadsheetApp.openById(SHEET_ID); }

/* ===================== INSTALACIÓN ===================== */
function setup() {
  const ss = libro();
  Object.keys(HOJAS).forEach(function (n) { encabezar(ss, n, HOJAS[n]); });
  ['Usuarios', 'Registros', 'Tickets'].forEach(function (n) { ss.getSheetByName(n).getRange('A:AA').setNumberFormat('@'); });
  ss.getSheetByName('Puntos').getRange('A:G').setNumberFormat('@');
  Object.keys(FORMATOS).forEach(function (f) { encabezar(ss, f, columnasLegibles(f)); });

  const cfg = ss.getSheetByName('Config');
  if (cfg.getLastRow() === 1) {
    cfg.getRange(2, 1, 5, 2).setValues([
      ['CARPETA_FOTOS', ''],
      ['CORREOS_SH', ''],            // correos extra de Seguridad e Higiene, separados por coma
      ['CORREOS_MANTENIMIENTO', ''], // correos extra del jefe de mantenimiento
      ['URL_APP', ''],               // URL de GitHub Pages, para los enlaces de los correos
      ['NOMBRE_ORG', "Saint Luke's Hospitals"]
    ]);
  }
  const us = ss.getSheetByName('Usuarios');
  if (us.getLastRow() === 1) {
    us.getRange(2, 1, 4, 9).setValues([
      ['1001', '1234', 'Técnico de prueba', 'TECNICO', 'Mantenimiento', 'San José del Cabo', '', 'SI', ''],
      ['2001', '1234', 'Jefa de Urgencias (prueba)', 'AREA', 'Urgencias', 'San José del Cabo', '', 'SI', ''],
      ['3001', '1234', 'Jefe de Mantenimiento (prueba)', 'MANTENIMIENTO', 'Mantenimiento', 'San José del Cabo', '', 'SI', ''],
      ['4001', '1234', 'Seguridad e Higiene (prueba)', 'SH', 'Seguridad e Higiene', 'San José del Cabo', '', 'SI', '']
    ]);
  }
  const pt = ss.getSheetByName('Puntos');
  if (pt.getLastRow() === 1) {
    const SJC = 'San José del Cabo';
    pt.getRange(2, 1, 6, 9).setValues([
      ['SLH-MAN-001', 'Manifold de oxígeno', 'FO-SLH-MTO-005', SJC, 'Central de gases medicinales', '', '{}', '', 'SI'],
      ['SLH-GAS-001', 'Tanques de nitrógeno y CO2', 'FO-SLH-MTO-006', SJC, 'Central de gases medicinales', '', '{}', '', 'SI'],
      ['SLH-AGUA-001', 'Agua potable · cisterna y puntos de muestreo', 'FO-SLH-MTO-007', SJC, 'Cisterna principal', '', '{}', '', 'SI'],
      ['SLH-PE-001', 'Planta de emergencia', 'FO-SLH-MTO-001', SJC, 'Cuarto de máquinas', '', '{}', '', 'SI'],
      ['SLH-AC-01', 'Minisplit', 'FO-SLH-MTO-002', SJC, 'Urgencias · sala de espera', '', '{}', '', 'SI'],
      ['SLH-OX-001', 'Cilindro de oxígeno tipo H', 'PRESION', SJC, 'Urgencias · cubículo 3', 'psi', '{"valor":[500,2200]}', '', 'SI']
    ]);
  }
  carpetaFotos();
  Logger.log('Listo. Ahora implementa como aplicación web.');
}
function encabezar(ss, nombre, cols) {
  let sh = ss.getSheetByName(nombre);
  if (!sh) sh = ss.insertSheet(nombre);
  if (sh.getLastRow() === 0) {
    sh.appendRow(cols);
    sh.getRange(1, 1, 1, cols.length).setFontWeight('bold').setBackground('#13294B').setFontColor('#FFFFFF').setWrap(true);
    sh.setFrozenRows(1);
  }
  return sh;
}

/* ===================== ENRUTADOR ===================== */
function doGet() { return json({ ok: true, data: 'Mantenimiento SLH API activa' }); }

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'Solicitud inválida' }); }
  const escritura = ['crearRegistro', 'revisarRegistros', 'guardarFirma', 'crearTicket', 'ticketAccion', 'guardarPunto'].indexOf(req.action) >= 0;
  const lock = LockService.getScriptLock();
  try {
    if (req.action === 'login') return json({ ok: true, data: login(req.data || {}) });
    const me = sesion(req.token);
    if (!me) return json({ ok: false, code: 'AUTH', error: 'Sesión expirada' });
    if (escritura) lock.waitLock(25000);
    const d = req.data || {};
    let r;
    switch (req.action) {
      case 'resume': r = { user: publico(usuario(me.numero) || me) }; break;
      case 'bootstrap': r = bootstrap(); break;
      case 'guardarFirma': r = guardarFirma(d, me, req.token); break;
      case 'registros': r = registros(d, me); break;
      case 'crearRegistro': r = crearRegistro(d, me); break;
      case 'revisarRegistros': r = revisarRegistros(d, me); break;
      case 'tickets': r = tickets(me); break;
      case 'crearTicket': r = crearTicket(d, me); break;
      case 'ticketAccion': r = ticketAccion(d, me); break;
      case 'guardarPunto': r = guardarPunto(d, me); break;
      default: throw new Error('Acción desconocida');
    }
    return json({ ok: true, data: r });
  } catch (err) {
    return json({ ok: false, error: err.message || String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ===================== SESIÓN ===================== */
function login(d) {
  const u = tabla('Usuarios').find(function (x) { return String(x.numero).trim() === String(d.numero).trim() && String(x.pin).trim() === String(d.pin).trim() && String(x.activo).toUpperCase() !== 'NO'; });
  if (!u) throw new Error('Número de empleado o PIN incorrecto');
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put('ses_' + token, JSON.stringify(publico(u)), SESION_SEG);
  return { token: token, user: publico(u) };
}
function sesion(token) {
  if (!token) return null;
  const c = CacheService.getScriptCache(); const v = c.get('ses_' + token);
  if (!v) return null;
  c.put('ses_' + token, v, SESION_SEG);
  return JSON.parse(v);
}
function usuario(numero) { return tabla('Usuarios').find(function (x) { return String(x.numero) === String(numero); }); }
function publico(u) { return { numero: String(u.numero), nombre: u.nombre, rol: u.rol, area: u.area, sede: u.sede, firma: u.firma || '' }; }

/* ===================== DATOS ===================== */
function hoja(n) { return libro().getSheetByName(n); }
function tabla(n) {
  const v = hoja(n).getDataRange().getValues(); const h = v.shift();
  return v.map(function (r, i) {
    if (r.join('') === '') return null;
    const o = { _fila: i + 2 };
    h.forEach(function (k, j) { o[k] = r[j] instanceof Date ? r[j].toISOString() : r[j]; });
    return o;
  }).filter(Boolean);
}
function agregar(n, o) { hoja(n).appendRow(HOJAS[n].map(function (k) { return o[k] === undefined ? '' : o[k]; })); }
function actualizar(n, fila, o) { hoja(n).getRange(fila, 1, 1, HOJAS[n].length).setValues([HOJAS[n].map(function (k) { return o[k] === undefined ? '' : o[k]; })]); }
function limpia(o) { const c = Object.assign({}, o); delete c._fila; return c; }
function config(k) { const r = tabla('Config').find(function (x) { return x.clave === k; }); return r ? String(r.valor) : ''; }
function siguiente(prop) { const p = PropertiesService.getScriptProperties(); const v = Number(p.getProperty(prop) || 0) + 1; p.setProperty(prop, String(v)); return v; }
function jsonSeguro(s, def) { try { return s ? JSON.parse(s) : def; } catch (e) { return def; } }
function puntoObj(p) { return { id: String(p.id), nombre: p.nombre, formato: p.formato, sede: p.sede, ubicacion: p.ubicacion, unidad: p.unidad || '', limites: jsonSeguro(p.limites, {}), frecuenciaHoras: p.frecuenciaHoras === '' ? '' : Number(p.frecuenciaHoras), activo: String(p.activo).toUpperCase() !== 'NO' }; }
function puntos() { return tabla('Puntos').map(puntoObj); }
function registroObj(r) {
  const o = limpia(r);
  o.datos = jsonSeguro(r.datos, {});
  o.alertas = r.alertas ? String(r.alertas).split(' | ') : [];
  o.usuario = String(r.usuario); o.revisadoPor = String(r.revisadoPor || '');
  return o;
}

/* Guarda una imagen dataURL en Drive y devuelve su ID (si ya es un ID, lo deja igual) */
function guardarImagen(dataUrl, nombre) {
  if (!dataUrl || String(dataUrl).indexOf('data:') !== 0) return dataUrl || '';
  const m = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!m) return '';
  const blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], nombre + (m[1] === 'image/png' ? '.png' : '.jpg'));
  const f = carpetaFotos().createFile(blob);
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return f.getId();
}

/* Carpeta de fotos y firmas: si Config › CARPETA_FOTOS está vacía, la crea y guarda su ID */
function carpetaFotos() {
  const id = config('CARPETA_FOTOS');
  if (id) return DriveApp.getFolderById(id);
  const carpeta = DriveApp.createFolder('Mantenimiento SLH · Fotos y firmas');
  const fila = tabla('Config').find(function (x) { return x.clave === 'CARPETA_FOTOS'; });
  if (fila) hoja('Config').getRange(fila._fila, 2).setValue(carpeta.getId()); else hoja('Config').appendRow(['CARPETA_FOTOS', carpeta.getId()]);
  return carpeta;
}

function bootstrap() {
  const tecnicos = tabla('Usuarios').filter(function (u) { return u.rol === 'TECNICO' && String(u.activo).toUpperCase() !== 'NO'; }).map(publico);
  return { puntos: puntos(), tecnicos: tecnicos };
}
function guardarFirma(d, me, token) {
  if (!d.firma) throw new Error('Dibuja tu firma');
  const u = usuario(me.numero); if (!u) throw new Error('Usuario no encontrado');
  u.firma = guardarImagen(d.firma, 'firma_' + me.numero + '_' + Date.now());
  actualizar('Usuarios', u._fila, u);
  CacheService.getScriptCache().put('ses_' + token, JSON.stringify(publico(u)), SESION_SEG);
  return { firma: u.firma };
}

/* ---------- Registros de bitácora ---------- */
function registros(d, me) {
  let r = tabla('Registros').map(registroObj);
  if (d.formato) r = r.filter(function (x) { return x.formato === d.formato; });
  if (d.puntoId) r = r.filter(function (x) { return x.puntoId === d.puntoId; });
  if (d.desde) r = r.filter(function (x) { return String(x.fecha) >= d.desde; });
  if (d.hasta) r = r.filter(function (x) { return String(x.fecha) < d.hasta; });
  if (d.mios) r = r.filter(function (x) { return x.usuario === String(me.numero); });
  r.sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
  return r.slice(0, d.limit || 1000);
}
function crearRegistro(d, me, desdeTicket) {
  if (me.rol === 'AREA') throw new Error('Sin permiso');
  const F = FORMATOS[d.formato]; if (!F) throw new Error('Formato no reconocido');
  const p = d.puntoId ? puntos().find(function (x) { return x.id === d.puntoId; }) : null;
  if (!F.libre && !p) throw new Error('Punto de revisión no encontrado');
  const u = usuario(me.numero) || me;
  if (!u.firma && !desdeTicket) throw new Error('Registra tu firma primero');
  const datos = d.datos || {};
  const err = validar(d.formato, p, datos); if (err.length) throw new Error('Falta: ' + err.join(', '));
  if (F.fotos === 'antesDespues' && !d.folio && (!d.fotoAntes || !d.fotoDespues)) throw new Error('Agrega la foto del antes y del después');
  const id = 'R' + siguiente('SEQ_R');
  F.campos.forEach(function (c) { if (c.t === 'firma' && datos[c.k]) datos[c.k] = guardarImagen(datos[c.k], id + '_' + c.k); });
  const r = {
    id: id, fecha: new Date().toISOString(), formato: d.formato, puntoId: p ? p.id : '', puntoNombre: p ? p.nombre : '', ubicacion: p ? p.ubicacion : '', sede: p ? p.sede : me.sede,
    datos: datos, alertas: evaluar(d.formato, p, datos), fotoAntes: guardarImagen(d.fotoAntes, id + '_antes'), fotoDespues: guardarImagen(d.fotoDespues, id + '_despues'),
    usuario: String(me.numero), usuarioNombre: me.nombre, firmaRealizo: u.firma || '', folio: d.folio || '', revisadoPor: '', revisorNombre: '', firmaReviso: '', fechaRevision: '', comentarioRevision: ''
  };
  agregar('Registros', Object.assign({}, r, { datos: JSON.stringify(datos), alertas: r.alertas.join(' | ') }));
  hoja(d.formato).appendRow(filaLegible(r, p));
  if (r.alertas.length) {
    const F2 = FORMATOS[r.formato];
    enviar(destinatarios(['SH', 'MANTENIMIENTO'], ['CORREOS_SH', 'CORREOS_MANTENIMIENTO']),
      '⚠ ' + F2.corto + (p ? ' · ' + p.id : '') + ': ' + r.alertas.length + ' alerta(s)',
      '<p><b>' + esc(F2.titulo) + '</b><br>' + (p ? esc(p.nombre) + ' (' + p.id + ') · ' + esc(p.ubicacion) + ' · ' + esc(p.sede) : esc(datos.area || '')) + '</p>' +
      '<ul>' + r.alertas.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
      '<p>Registró: ' + esc(me.nombre) + ' · ' + fechaLocal(r.fecha) + '</p>' + enlace());
  }
  return r;
}
function revisarRegistros(d, me) {
  if (!esSupervisor(me.rol)) throw new Error('Solo Mantenimiento o Seguridad e Higiene pueden revisar');
  const u = usuario(me.numero); if (!u || !u.firma) throw new Error('Registra tu firma primero');
  const ids = d.ids || []; const ahora = new Date().toISOString(); let n = 0;
  tabla('Registros').forEach(function (r) {
    if (ids.indexOf(r.id) < 0 || r.revisadoPor) return;
    Object.assign(r, { revisadoPor: String(me.numero), revisorNombre: me.nombre, firmaReviso: u.firma, fechaRevision: ahora, comentarioRevision: d.comentario || '' });
    actualizar('Registros', r._fila, limpia(r));
    marcarRevisionLegible(r);
    n++;
  });
  return { revisados: n };
}

/* Hojas legibles por formato: mismas columnas que el papel */
function columnasLegibles(f) {
  const F = FORMATOS[f];
  const base = ['ID registro', 'Fecha', 'Hora'].concat(F.libre ? [] : [F.colPunto || 'Punto', 'Ubicación', 'Sede']);
  const campos = [];
  F.campos.forEach(function (c) { if (c.t === 'firma') campos.push(c.col + ' (nombre)'); else campos.push(c.col || c.l); });
  return base.concat(campos, ['Alertas', 'Realizó', 'Revisó', 'Fecha de revisión', 'Comentario de revisión', 'Folio ticket']);
}
function filaLegible(r, p) {
  const F = FORMATOS[r.formato]; const tz = Session.getScriptTimeZone(); const d = new Date(r.fecha);
  const base = [r.id, Utilities.formatDate(d, tz, 'dd/MM/yyyy'), Utilities.formatDate(d, tz, 'HH:mm')].concat(F.libre ? [] : [r.puntoId, r.ubicacion, r.sede]);
  const vals = F.campos.map(function (c) {
    if (c.t === 'firma') return r.datos[c.k + 'Nombre'] || '';
    if (!campoActivo(c, r.datos)) return '';
    const v = r.datos[c.k];
    if (Array.isArray(v)) return v.join(', ');
    if (v === '' || v === null || v === undefined) return '';
    const u = unidadDe(c, p);
    return (c.t === 'num' || c.t === 'int') && u ? v + ' ' + u : v;
  });
  return base.concat(vals, [r.alertas.join(' | '), r.usuarioNombre, '', '', '', r.folio || '']);
}
function marcarRevisionLegible(r) {
  const sh = hoja(r.formato); if (!sh) return;
  const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
  const cols = columnasLegibles(r.formato); const c = cols.indexOf('Revisó') + 1;
  for (let i = 1; i < ids.length; i++) if (ids[i][0] === r.id) {
    sh.getRange(i + 1, c, 1, 3).setValues([[r.revisorNombre, fechaLocal(r.fechaRevision), r.comentarioRevision || '']]);
    break;
  }
}

/* ---------- Tickets ---------- */
function ticketsTodos() { return tabla('Tickets').map(function (t) { return Object.assign(t, { solicitante: String(t.solicitante), asignadoA: String(t.asignadoA || '') }); }); }
function tickets(me) {
  let r = ticketsTodos();
  if (me.rol === 'AREA') r = r.filter(function (t) { return t.solicitante === String(me.numero); });
  if (me.rol === 'TECNICO') r = r.filter(function (t) { return (t.estado === 'Enviado' && !t.asignadoA) || t.asignadoA === String(me.numero); });
  r.sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
  return r.map(limpia);
}
function crearTicket(d, me) {
  if (!d.descripcion || !d.categoria) throw new Error('Completa el tipo de trabajo y la descripción');
  if (!d.firma) throw new Error('Falta la firma del solicitante');
  const folio = 'TK-' + ('0000' + siguiente('SEQ_T')).slice(-4);
  const ahora = new Date().toISOString();
  const t = { folio: folio, fecha: ahora, area: d.area || me.area, sede: me.sede, ubicacion: d.ubicacion || '', categoria: d.categoria, prioridad: d.prioridad || 'Media', descripcion: d.descripcion,
    foto: guardarImagen(d.foto, folio + '_reporte'), firmaSolicitante: guardarImagen(d.firma, folio + '_firma'), solicitante: String(me.numero), solicitanteNombre: me.nombre, estado: 'Enviado',
    asignadoA: '', asignadoNombre: '', fechaAceptado: '', fechaInicio: '', fechaRealizado: '', fotoAntes: '', fotoDespues: '', trabajoRealizado: '', materiales: '', puntoId: '', validadoPor: '', fechaValidado: '', comentario: '',
    historial: JSON.stringify([{ f: ahora, e: 'Enviado', u: me.nombre }]) };
  agregar('Tickets', t);
  enviar(destinatarios(['TECNICO', 'MANTENIMIENTO'], ['CORREOS_MANTENIMIENTO']),
    'Nueva solicitud ' + folio + ' · ' + t.prioridad + ' · ' + t.area,
    '<p><b>' + esc(t.categoria) + '</b> · Prioridad ' + t.prioridad + '</p><p>' + esc(t.area) + ' · ' + esc(t.ubicacion) + ' · ' + esc(t.sede) + '</p><p>' + esc(t.descripcion) + '</p><p>Solicitó: ' + esc(me.nombre) + '</p>' + enlace());
  return t;
}
function ticketAccion(d, me) {
  const t = ticketsTodos().find(function (x) { return x.folio === d.folio; });
  if (!t) throw new Error('Ticket no encontrado');
  if (d.fotoAntes) d.fotoAntes = guardarImagen(d.fotoAntes, t.folio + '_antes');
  if (d.fotoDespues) d.fotoDespues = guardarImagen(d.fotoDespues, t.folio + '_despues');
  const nuevo = Object.assign(limpia(t), aplicarAccion(t, d, me));
  actualizar('Tickets', t._fila, nuevo);
  if (d.accion === 'completar') {
    const p = nuevo.puntoId ? puntos().find(function (x) { return x.id === nuevo.puntoId; }) : null;
    const tec = usuario(nuevo.asignadoA); const quien = tec ? publico(tec) : me;
    try { crearRegistro(registroDesdeTicket(nuevo, p), quien, true); } catch (e) { console.error('No se generó la bitácora del ticket: ' + e.message); }
  }
  notificarTicket(nuevo, d.accion, me);
  return nuevo;
}

/* ---------- Puntos ---------- */
function guardarPunto(d, me) {
  if (!esSupervisor(me.rol)) throw new Error('Sin permiso');
  if (!d.id || !d.nombre || !FORMATOS[d.formato]) throw new Error('ID, nombre y formato son obligatorios');
  const p = { id: String(d.id).trim().toUpperCase(), nombre: d.nombre, formato: d.formato, sede: d.sede, ubicacion: d.ubicacion, unidad: d.unidad || '', limites: JSON.stringify(d.limites || {}), frecuenciaHoras: d.frecuenciaHoras === '' || d.frecuenciaHoras === undefined ? '' : Number(d.frecuenciaHoras), activo: d.activo === false ? 'NO' : 'SI' };
  const ex = tabla('Puntos').find(function (x) { return String(x.id).toUpperCase() === p.id; });
  if (ex) actualizar('Puntos', ex._fila, p); else agregar('Puntos', p);
  return puntoObj(p);
}

/* ===================== CORREOS ===================== */
function destinatarios(roles, clavesConfig) {
  const set = {};
  tabla('Usuarios').filter(function (u) { return roles.indexOf(u.rol) >= 0 && u.correo && String(u.activo).toUpperCase() !== 'NO'; }).forEach(function (u) { set[String(u.correo).trim()] = 1; });
  (clavesConfig || []).forEach(function (k) { config(k).split(',').map(function (s) { return s.trim(); }).filter(String).forEach(function (c) { set[c] = 1; }); });
  return Object.keys(set);
}
function correoDe(numero) { const u = usuario(numero); return u && u.correo ? [String(u.correo)] : []; }
function notificarTicket(t, accion, me) {
  const asunto = t.folio + ' · ' + t.estado;
  const cuerpo = '<p><b>' + t.folio + '</b> · ' + esc(t.categoria) + ' · ' + esc(t.area) + '</p><p>Estado: <b>' + t.estado + '</b> (' + esc(me.nombre) + ')</p>' + (t.trabajoRealizado ? '<p>Trabajo: ' + esc(t.trabajoRealizado) + '</p>' : '') + (t.comentario ? '<p>Comentario: ' + esc(t.comentario) + '</p>' : '') + enlace();
  if (accion === 'aceptar' || accion === 'asignar') { enviar(correoDe(t.solicitante), asunto, cuerpo); if (accion === 'asignar') enviar(correoDe(t.asignadoA), 'Se te asignó ' + t.folio, cuerpo); }
  if (accion === 'completar') enviar(correoDe(t.solicitante).concat(destinatarios(['MANTENIMIENTO'], ['CORREOS_MANTENIMIENTO'])), asunto + ' · por validar', cuerpo);
  if (accion === 'reabrir') enviar(correoDe(t.asignadoA).concat(destinatarios(['MANTENIMIENTO'], ['CORREOS_MANTENIMIENTO'])), asunto, cuerpo);
}
function enviar(lista, asunto, html) {
  lista = (lista || []).filter(String);
  if (!lista.length) return;
  try {
    MailApp.sendEmail({ to: lista.join(','), subject: '[Mantenimiento SLH] ' + asunto, htmlBody: '<div style="font-family:Arial,sans-serif;font-size:14px;color:#101B2D"><div style="background:#13294B;color:#fff;padding:10px 14px;font-weight:bold">Mantenimiento · ' + esc(config('NOMBRE_ORG')) + '</div><div style="padding:14px">' + html + '</div></div>' });
  } catch (e) { console.error('Correo no enviado: ' + e.message); }
}
function enlace() { const u = config('URL_APP'); return u ? '<p><a href="' + u + '">Abrir la plataforma</a></p>' : ''; }
function fechaLocal(iso) { return Utilities.formatDate(new Date(iso), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'); }
function esc(s) { return String(s || '').replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

/* ===================== REVISIONES VENCIDAS (activador por tiempo) =====================
 * Activadores › Agregar activador › revisarVencidos · Por tiempo · Cada hora.
 * Avisa a Seguridad e Higiene y a Mantenimiento qué puntos no se han revisado a tiempo. */
function revisarVencidos() {
  const desde = new Date(Date.now() - 60 * 864e5).toISOString();
  const regs = registros({ desde: desde, limit: 100000 }, { numero: '' });
  const vencidos = puntos().filter(function (p) {
    if (!p.activo) return false;
    const f = frecuenciaDe(p); if (!f) return false;
    const u = regs.find(function (r) { return r.puntoId === p.id; });
    return !u || (Date.now() - new Date(u.fecha).getTime()) / 36e5 > f;
  });
  if (!vencidos.length) return;
  const cache = CacheService.getScriptCache(); const firma = vencidos.map(function (p) { return p.id; }).join(',');
  if (cache.get('vencidos') === firma) return;
  cache.put('vencidos', firma, 21600);
  enviar(destinatarios(['SH', 'MANTENIMIENTO'], ['CORREOS_SH', 'CORREOS_MANTENIMIENTO']), vencidos.length + ' bitácora(s) con revisión vencida',
    '<ul>' + vencidos.map(function (p) { return '<li><b>' + p.id + '</b> · ' + esc(FORMATOS[p.formato].corto) + ' · ' + esc(p.ubicacion) + ' · ' + esc(p.sede) + '</li>'; }).join('') + '</ul>' + enlace());
}
