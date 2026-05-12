// ═══════════════════════════════════════════════════
//  DevTraffic — Google Apps Script
//  Dados começam na coluna B, linha 2
// ═══════════════════════════════════════════════════

const SHEET_NAME   = 'Leads'; // Nome da aba
const START_COL    = 2;        // Coluna B
const HEADER_ROW   = 2;        // Linha do cabeçalho
const DATA_START   = 3;        // Primeira linha de dados

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Cria cabeçalho na linha 2, coluna B, se ainda não existir
    const headerCell = sheet.getRange(HEADER_ROW, START_COL).getValue();
    if (!headerCell) {
      const headers = ['Data', 'Nome', 'Empresa', 'Email', 'WhatsApp', 'Serviço', 'Mensagem'];
      const headerRange = sheet.getRange(HEADER_ROW, START_COL, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#E5152E');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontSize(11);
    }

    // Descobre a próxima linha vazia a partir da linha 3 na coluna B
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow < DATA_START ? DATA_START : lastRow + 1;

    // Insere os dados
    const rowData = [
      data.data      || new Date().toLocaleString('pt-BR'),
      data.nome      || '',
      data.empresa   || '',
      data.email     || '',
      data.telefone  || '',
      data.servico   || '',
      data.mensagem  || ''
    ];
    sheet.getRange(nextRow, START_COL, 1, rowData.length).setValues([rowData]);

    // Zebra nas linhas de dados
    if ((nextRow - DATA_START) % 2 === 0) {
      sheet.getRange(nextRow, START_COL, 1, rowData.length).setBackground('#fdf2f2');
    }

    sheet.autoResizeColumns(START_COL, rowData.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Teste manual — rode para verificar
function testeManual() {
  const fakeData = {
    postData: {
      contents: JSON.stringify({
        data:     '18/04/2026 10:00',
        nome:     'João Teste',
        empresa:  'Empresa Teste',
        email:    'joao@teste.com',
        telefone: '(11) 99999-9999',
        servico:  'Gestão de Tráfego Pago',
        mensagem: 'Quero saber mais sobre os serviços.'
      })
    }
  };
  Logger.log(doPost(fakeData).getContent());
}
