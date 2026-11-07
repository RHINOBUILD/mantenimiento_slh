# Mantenimiento SLH · Guía de instalación

Plataforma de Mantenimiento y Seguridad e Higiene de Saint Luke's Hospitals. Digitaliza las bitácoras oficiales y los tickets de mantenimiento.

## Bitácoras incluidas
| Código | Bitácora | Frecuencia por defecto |
|---|---|---|
| FO-SLH-MTO-005 | Manifold de oxígeno | Diaria (por turno si es necesario) |
| FO-SLH-MTO-006 | Nitrógeno / CO2 | Diaria |
| FO-SLH-MTO-007 | Agua potable en cisterna y cloro residual | Diaria |
| FO-SLH-MTO-001 | Revisión y prueba de planta de emergencia | Semanal |
| FO-SLH-MTO-002 | Servicios preventivos y correctivos a aires acondicionados | Según se requiera |
| FO-SLH-MTO-009 | Check list de mantenimiento de instalaciones | Según se requiera |
| (interno) | Cilindros y manómetros sueltos | Diaria |

La frecuencia y los rangos de alerta se ajustan por punto en **Puntos y QR**.

## Archivos
| Archivo | Va en |
|---|---|
| `index.html` | Repositorio de GitHub Pages (ej. `RHINOBUILD/mantenimiento_slh`) |
| `Code.gs`, `Formatos.gs`, `appsscript.json` | Proyecto de Apps Script ligado a una Google Sheet |

`Formatos.gs` es copia exacta del bloque `COMPARTIDO` de `index.html`. Si cambias un formato, cambia los dos.

## Probar sin backend
Abre `index.html` (o publícalo en GitHub Pages) con `API_URL` vacío. Entra en **modo demo** con los usuarios de prueba (PIN 1234). Los datos se guardan solo en ese navegador.

> La cámara solo funciona en HTTPS (GitHub Pages lo cumple) y con permiso del navegador.

## Conectar el backend
La base de datos ya está lista: **Mantenimiento SLH · Base de datos** (`1u-YqZwgfMmMt4_aDr7ot7BkZkwXUrnIewx5U5oMQLhw`), con las hojas Usuarios, Puntos, Registros, Tickets, Config y una hoja por bitácora. `Code.gs` ya apunta a ella.

1. Abre la hoja › Extensiones › Apps Script.
2. Crea los archivos `Code.gs` y `Formatos.gs` y pega su contenido. En Configuración del proyecto activa "Mostrar archivo de manifiesto" y pega `appsscript.json`.
3. Ejecuta `setup()` una vez y autoriza (crea la carpeta de fotos en Drive; no toca los datos).
4. Implementar › Nueva implementación › Aplicación web · Ejecutar como: **Yo** · Acceso: **Cualquier usuario**. Copia la URL `/exec`.
5. Pega esa URL en `CONFIG.API_URL` de `index.html` (o pásamela) y súbelo a GitHub.
6. En **Usuarios** da de alta al personal real con su correo y borra los de prueba. En **Config** llena `CORREOS_SH` y `CORREOS_MANTENIMIENTO`.
7. Activadores › `revisarVencidos` · Por tiempo · Cada hora.

## Cómo funciona
- **Firma:** cada usuario dibuja su firma una vez ("Mi firma"); se coloca en cada registro que hace o revisa, con fecha y hora del servidor.
- **Revisión:** Seguridad e Higiene o el jefe de mantenimiento firman como "Revisó", uno por uno o en lote desde el Panel o Bitácoras.
- **Alertas:** valores fuera de rango, nivel bajo, daños o verificaciones incumplidas generan alerta y correo.
- **Tickets:** al marcar un ticket como realizado se registra solo en la bitácora 002 (si fue un minisplit) o en la 009 (cualquier otro trabajo), con fotos y la firma del área solicitante.
- **Impresión:** Bitácoras › elige formato y mes › Imprimir formato. Sale con el código y las columnas del formato oficial.
- **Etiquetas QR:** Puntos y QR › Etiquetas para imprimir.

Cada cambio en el código de Apps Script requiere Implementar › Administrar implementaciones › Editar › Nueva versión.
