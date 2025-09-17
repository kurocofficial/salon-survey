// Google Apps Script用コード
// Google Sheetsに連携するためのサーバーサイドスクリプト

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // スプレッドシートのIDを設定（実際のIDに置き換えてください）
    const spreadsheetId = '11m1X4LSlx6qEnED21IM_x9bTJN94hS4lXicOa51g5H8';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

    // 店舗データシートに書き込み
    writeStoreData(spreadsheet, data);

    // スタイリストデータシートに書き込み
    writeStylistData(spreadsheet, data);

    return ContentService
      .createTextOutput(JSON.stringify({result: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeStoreData(spreadsheet, data) {
  let storeSheet = spreadsheet.getSheetByName('店舗データ');

  // シートが存在しない場合は作成
  if (!storeSheet) {
    storeSheet = spreadsheet.insertSheet('店舗データ');

    // ヘッダー行を設定
    const headers = [
      '送信日時',
      '会社名',
      '店舗名',
      'Hotpepper Beauty URL',
      '2023年売上',
      '2023年客数',
      '2023年指名率',
      '2024年売上',
      '2024年客数',
      '2024年指名率',
      '2025年売上',
      '2025年客数',
      '2025年指名率'
    ];
    storeSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // ヘッダー行をフォーマット
    storeSheet.getRange(1, 1, 1, headers.length)
      .setBackground('#0C5A4B')
      .setFontColor('white')
      .setFontWeight('bold');
  }

  // データ行を追加
  const storeData = [
    data.timestamp,
    data.companyName || '',
    data.storeName || '',
    data.store.hotpepperUrl || '',
    data.store.data2023.sales || '',
    data.store.data2023.customers || '',
    data.store.data2023.nomination || '',
    data.store.data2024.sales || '',
    data.store.data2024.customers || '',
    data.store.data2024.nomination || '',
    data.store.data2025.sales || '',
    data.store.data2025.customers || '',
    data.store.data2025.nomination || ''
  ];

  const lastRow = storeSheet.getLastRow();
  storeSheet.getRange(lastRow + 1, 1, 1, storeData.length).setValues([storeData]);
}

function writeStylistData(spreadsheet, data) {
  let stylistSheet = spreadsheet.getSheetByName('スタイリストデータ');

  // シートが存在しない場合は作成
  if (!stylistSheet) {
    stylistSheet = spreadsheet.insertSheet('スタイリストデータ');

    // ヘッダー行を設定
    const headers = [
      '送信日時',
      '会社名',
      '店舗名',
      'スタイリストID',
      'スタイリスト名',
      '2023年売上',
      '2024年売上',
      '2025年売上'
    ];
    stylistSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // ヘッダー行をフォーマット
    stylistSheet.getRange(1, 1, 1, headers.length)
      .setBackground('#0C5A4B')
      .setFontColor('white')
      .setFontWeight('bold');
  }

  // 各スタイリストのデータを追加
  data.stylists.forEach(stylist => {
    const stylistData = [
      data.timestamp,
      data.companyName || '',
      data.storeName || '',
      stylist.id,
      stylist.name,
      stylist.data2023.sales || '',
      stylist.data2024.sales || '',
      stylist.data2025.sales || ''
    ];

    const lastRow = stylistSheet.getLastRow();
    stylistSheet.getRange(lastRow + 1, 1, 1, stylistData.length).setValues([stylistData]);
  });
}

function doGet(e) {
  return ContentService
    .createTextOutput('Hello from Google Apps Script!')
    .setMimeType(ContentService.MimeType.TEXT);
}
