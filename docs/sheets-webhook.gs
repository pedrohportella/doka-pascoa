/**
 * Doka — Sorteio Páscoa 🐣
 * Google Apps Script Web App
 *
 * Como usar:
 * 1. Acesse https://script.google.com e crie um novo projeto
 * 2. Cole TODO este código no editor
 * 3. Troque SHEET_ID pelo ID da sua planilha (URL: /spreadsheets/d/{SHEET_ID}/edit)
 * 4. Clique em "Implantar" → "Nova implantação"
 *    - Tipo: App da Web
 *    - Executar como: Eu (your@gmail.com)
 *    - Quem tem acesso: Qualquer pessoa
 * 5. Copie a URL gerada e cole em VITE_SHEETS_WEBHOOK_URL no .env.local
 */

var SHEET_ID = 'COLE_O_ID_DA_SUA_PLANILHA_AQUI'
var SHEET_NAME = 'Participações'

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)

    var ss = SpreadsheetApp.openById(SHEET_ID)
    var sheet = ss.getSheetByName(SHEET_NAME)

    // Cria a aba se não existir
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
      sheet.appendRow(['Timestamp', 'Nome', 'WhatsApp', 'E-mail', 'URL do Print'])
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold')
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.nome || '',
      data.whatsapp || '',
      data.email || '',
      data.print_url || '',
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Teste manual: rode esta função no editor para verificar
function testar() {
  doPost({
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        nome: 'Teste Silva',
        whatsapp: '(11) 99999-9999',
        email: 'teste@email.com',
        print_url: 'https://exemplo.com/print.jpg',
      })
    }
  })
}
