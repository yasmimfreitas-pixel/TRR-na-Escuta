import { PassagemPlantao } from '../types';

export const SHEET_COLUMNS = [
  'Data',
  'Turno',
  'Médico',
  'SPA',
  'UTE',
  'Posto 5',
  'Posto 6',
  'Posto 7',
  'Outros',
  'Reavaliações',
  'Admissões (Local - Leito)',
  'Sala TRR - Encaminhados',
  'Sala TRR - No Fim',
  'Permanência ≥12h',
  'Detalhe ≥12h',
  'Destino: UTI',
  'Destino: Enfermaria',
  'Destino: Transferências',
  'Destino: Óbitos',
  'Aguardando Destino',
  'Pacientes Aguardando (Detalhes)',
  'Pendências Próx. Plantão',
  'Detalhes Pendências',
  'Segurança / Ação Imediata',
  'Detalhe Segurança',
  'Horário do Registro',
  'Data/Hora Envio',
];

export function passagemToRow(p: PassagemPlantao): (string | number)[] {
  return [
    p.data || '',
    p.turno || '',
    p.medico || '',
    p.spa ?? 0,
    p.ute ?? 0,
    p.p5 ?? 0,
    p.p6 ?? 0,
    p.p7 ?? 0,
    p.outros || '',
    p.reaval || '',
    p.admissoes || '',
    p.salaEnc ?? 0,
    p.salaFim ?? 0,
    p.perm12 ?? 0,
    p.perm12det || '',
    p.uti ?? 0,
    p.enf ?? 0,
    p.transf ?? 0,
    p.obitos ?? 0,
    p.aguardando || 'Não',
    p.pacientes || '',
    p.pendHas || 'Não',
    p.pendDet || '',
    p.seg || 'Não há situação crítica',
    p.segDet || '',
    p.hora || '',
    p.submittedAt ? new Date(p.submittedAt).toLocaleString('pt-BR') : '',
  ];
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

/**
 * Searches for existing Passagem de Plantão spreadsheet in user's Drive.
 */
export async function findExistingSpreadsheets(
  accessToken: string
): Promise<GoogleDriveFile[]> {
  try {
    const q = encodeURIComponent(
      "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false and name contains 'Passagem de Plantão'"
    );
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,webViewLink,createdTime,modifiedTime)&pageSize=10`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Erro ao buscar planilhas: ${res.statusText}`);
    }
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.warn('Erro ao buscar planilhas existentes:', err);
    return [];
  }
}

/**
 * Creates a brand new Google Spreadsheet formatted for TRR Plantão Handover.
 */
export async function createGoogleSpreadsheet(
  accessToken: string,
  title = 'Passagem de Plantão TRR - SOPAI'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const requestBody = {
    properties: {
      title,
      locale: 'pt_BR',
      timeZone: 'America/Fortaleza',
    },
    sheets: [
      {
        properties: {
          title: 'Passagens de Plantão',
          gridProperties: {
            frozenRowCount: 1,
            columnCount: SHEET_COLUMNS.length + 2,
          },
        },
      },
    ],
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.error?.message || `Erro ao criar planilha: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl =
    data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write header row and format it
  await writeHeaderRow(accessToken, spreadsheetId);

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Writes and formats header row with professional medical styling
 */
async function writeHeaderRow(accessToken: string, spreadsheetId: string) {
  // Append header values
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [SHEET_COLUMNS],
      }),
    }
  );

  // Format header row (Navy blue background, bold white text)
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: SHEET_COLUMNS.length,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.11, green: 0.37, blue: 0.84 }, // #1D5FD6
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true,
                    fontSize: 10,
                  },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                  wrapStrategy: 'WRAP',
                },
              },
              fields:
                'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
            },
          },
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
              fields: 'gridProperties.frozenRowCount',
            },
          },
        ],
      }),
    }
  ).catch((e) => console.warn('Formatação de cabeçalho opcional falhou:', e));
}

/**
 * Appends a single handover record to the Google Sheet.
 */
export async function appendPassagemToSheet(
  accessToken: string,
  spreadsheetId: string,
  passagem: PassagemPlantao
): Promise<void> {
  const row = passagemToRow(passagem);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.error?.message || `Erro ao adicionar registro à planilha: ${res.statusText}`
    );
  }
}

/**
 * Syncs all records to Google Sheets. Appends missing records so duplicates are avoided.
 */
export async function syncAllPassagensToSheet(
  accessToken: string,
  spreadsheetId: string,
  passagens: PassagemPlantao[]
): Promise<{ addedCount: number; total: number }> {
  if (passagens.length === 0) return { addedCount: 0, total: 0 };

  // Read existing rows to check header and current count
  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:A`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  let existingRowCount = 0;
  if (readRes.ok) {
    const readData = await readRes.json();
    existingRowCount = readData.values ? readData.values.length : 0;
  }

  // If sheet is completely empty, write headers first
  if (existingRowCount === 0) {
    await writeHeaderRow(accessToken, spreadsheetId);
    existingRowCount = 1;
  }

  // Sort passagens chronologically for neat sheet structure
  const sorted = [...passagens].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );

  const rows = sorted.map(passagemToRow);

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Erro ao sincronizar passagens: ${appendRes.statusText}`);
  }

  return { addedCount: rows.length, total: existingRowCount - 1 + rows.length };
}

/**
 * Shares spreadsheet via Google Drive permissions (link sharing or specific email).
 */
export async function shareSpreadsheet(
  accessToken: string,
  fileId: string,
  options: {
    role: 'reader' | 'commenter' | 'writer';
    type?: 'anyone' | 'user';
    emailAddress?: string;
  }
): Promise<{ shareLink: string; permissionId: string }> {
  const isEmail = options.type === 'user' && !!options.emailAddress;

  const payload: Record<string, string> = {
    role: options.role,
    type: isEmail ? 'user' : 'anyone',
  };

  if (isEmail && options.emailAddress) {
    payload.emailAddress = options.emailAddress;
  }

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?sendNotificationEmail=${
      isEmail ? 'true' : 'false'
    }`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(
      errorJson.error?.message ||
        `Erro ao configurar compartilhamento no Google Drive: ${res.statusText}`
    );
  }

  const data = await res.json();
  const shareLink = `https://docs.google.com/spreadsheets/d/${fileId}/edit?usp=sharing`;

  return {
    shareLink,
    permissionId: data.id || '',
  };
}
