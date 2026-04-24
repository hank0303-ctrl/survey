// ============================================================
// 武樂運動空間｜新學期課後班動向調查表 - Google Apps Script
// ============================================================
// 使用步驟：
// 1. 開啟 Google 試算表，記下網址中的試算表 ID（/d/ 後面那串）
// 2. 在試算表選單 → 延伸功能 → Apps Script
// 3. 貼上此程式碼，並將第 10 行的 SPREADSHEET_ID 換成你的 ID
// 4. 點選「部署」→「新增部署作業」→ 類型選「網頁應用程式」
//    - 執行身分：「我（你的帳號）」
//    - 存取對象：「所有人」（Anyone）
// 5. 授權後，複製產生的「網頁應用程式 URL」
// 6. 將該 URL 貼入 index.html 第 266 行的 GAS_URL 變數
// ============================================================

const SPREADSHEET_ID = '13srBPtk_NxKWGnIFbvEfpSEadRWU4ceWR-5EUGWlQow'; // ← 換成你的試算表 ID
const SHEET_NAME = '動向調查回覆';                  // 可自行修改分頁名稱

const HEADERS = [
  '時間戳記',
  '小朋友姓名',
  '就讀學校／年級',
  '是否繼續課後班',
  '新學期安排（複選）',
  '可配合上課日（複選）',
  '參與武樂方式',
  '其他補習班時段',
  '是否需要接送',
  '接送需求說明',
  '其他想法'
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // 若分頁不存在就建立
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // 第一次使用時自動建立標題列
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setBackground('#D96B2A')
        .setFontColor('white')
        .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // 解析 POST body
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp             || new Date().toLocaleString('zh-TW'),
      data.q1_name               || '',
      data.q2_school             || '',
      data.q3_continue           || '',
      data.q4_plan               || '',
      data.q5_days               || '',
      data.q6_mode               || '',
      data.q7_other_classes      || '',
      data.q8_transport          || '',
      data.q9_transport_detail   || '',
      data.q10_other             || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 本地測試用（不影響部署）
function testWrite() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp: '2026/4/24 上午10:00:00',
        q1_name: '測試小明',
        q2_school: '青埔國小 二年級',
        q3_continue: '是，會繼續留在武樂課後班',
        q4_plan: '',
        q5_days: '週二 武術課、週四 體能課',
        q6_mode: '平日課後班固定到班',
        q7_other_classes: '無',
        q8_transport: '暫時不需要',
        q9_transport_detail: '',
        q10_other: ''
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
