/**
 * TRR na Escuta - Passagem de Plantao
 *
 * Como implantar:
 * 1. Abra a planilha > Extensoes > Apps Script e cole este arquivo em Code.gs.
 * 2. (Opcional) Se o script NAO estiver vinculado a planilha, preencha SPREADSHEET_ID.
 * 3. Implantar > Nova implantacao > Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 4. Autorize, copie a URL /exec e atualize GOOGLE_SHEET_WEB_APP_URL no app.
 *    Ao editar o script, use Gerenciar implantacoes > Editar > Nova versao
 *    para manter a mesma URL.
 */

const SPREADSHEET_ID = '';
const SHEET_NAME = 'Passagens';

function doGet() {
  return jsonResponse({ ok: true, message: 'TRR na Escuta - Web App ativo.' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Requisicao sem corpo.' });
    }

    const data = JSON.parse(e.postData.contents);
    const row = flattenPayload(data);
    const sheet = getSheet();
    const headers = ensureHeaders(sheet, Object.keys(row));

    sheet.appendRow(headers.map(function (h) {
      return Object.prototype.hasOwnProperty.call(row, h) ? row[h] : '';
    }));

    return jsonResponse({ ok: true, row: sheet.getLastRow() });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Planilha nao encontrada. Preencha SPREADSHEET_ID.');
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

// Nested objects in the payload duplicate the flat fields, so only primitives
// and the admissoes list become columns.
function flattenPayload(data) {
  const row = {};
  Object.keys(data).forEach(function (key) {
    const value = data[key];
    if (Array.isArray(value)) {
      row[key] = value
        .map(function (item) {
          return typeof item === 'object' && item !== null
            ? Object.keys(item).map(function (k) { return item[k]; }).filter(String).join(' - ')
            : item;
        })
        .join('\n');
    } else if (value === null || value === undefined) {
      row[key] = '';
    } else if (typeof value !== 'object') {
      row[key] = value;
    }
  });
  return row;
}

function ensureHeaders(sheet, keys) {
  const lastCol = sheet.getLastColumn();
  const headers = lastCol > 0
    ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String).filter(String)
    : [];

  const missing = keys.filter(function (k) { return headers.indexOf(k) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    sheet.getRange(1, 1, 1, headers.length + missing.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return headers.concat(missing);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
