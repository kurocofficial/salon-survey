// ===============================================
// ヘアサロンアンケート用 Google Apps Script (関連No.対応版)
// ===============================================

// 設定: 以下のスプレッドシートIDを実際のものに置き換えてください
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// すべてのHTTPメソッドに対応
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function doOptions(e) {
  return handleRequest(e);
}

// リクエスト処理の統一関数
function handleRequest(e) {
  // CORS対応のレスポンスを作成
  const output = ContentService.createTextOutput();
  
  // HTTPメソッドがOPTIONSの場合（プリフライトリクエスト）
  if (!e.postData) {
    output.setContent('ヘアサロンアンケート用GASが正常に動作しています！\n現在時刻: ' + new Date().toLocaleString('ja-JP'));
    output.setMimeType(ContentService.MimeType.TEXT);
    return output;
  }
  
  try {
    // POSTデータを解析
    const data = JSON.parse(e.postData.contents);
    console.log('受信データ:', data);
    
    // スプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 店舗データシートに書き込み
    const storeRowNumber = writeStoreData(spreadsheet, data);
    
    // スタイリストデータシートに書き込み（データがある場合のみ）
    if (data.stylists && data.stylists.length > 0) {
      writeStylistData(spreadsheet, data, storeRowNumber);
    }
    
    // 成功レスポンスを返す
    output.setContent(JSON.stringify({
      result: 'success',
      message: 'データが正常に保存されました',
      timestamp: new Date().toISOString(),
      storeRowNumber: storeRowNumber
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
      
  } catch (error) {
    console.error('エラー:', error);
    
    // エラーレスポンスを返す
    output.setContent(JSON.stringify({
      result: 'error',
      message: error.toString(),
      timestamp: new Date().toISOString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
  }
}

// 店舗データをスプレッドシートに書き込む関数
function writeStoreData(spreadsheet, data) {
  let storeSheet = spreadsheet.getSheetByName('店舗データ');
  
  // シートが存在しない場合は作成
  if (!storeSheet) {
    storeSheet = spreadsheet.insertSheet('店舗データ');
    
    // ヘッダー行を設定（関連No.を左側に配置）
    const headers = [
      '関連No.',
      'No.',
      '送信日時',
      '会社名',
      '店舗名',
      'Hotpepper Beauty URL',
      '2023年売上(万円)',
      '2023年客数(人)',
      '2023年指名率(%)',
      '2024年売上(万円)',
      '2024年客数(人)',
      '2024年指名率(%)',
      '2025年売上(万円)',
      '2025年客数(人)',
      '2025年指名率(%)'
    ];
    
    // ヘッダーを設定
    storeSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // ヘッダー行をフォーマット
    const headerRange = storeSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#0C5A4B')
              .setFontColor('white')
              .setFontWeight('bold')
              .setHorizontalAlignment('center');
    
    // 列幅を自動調整
    storeSheet.autoResizeColumns(1, headers.length);
  }
  
  // 現在の行数を取得してナンバリング
  const lastRow = storeSheet.getLastRow();
  const rowNumber = lastRow; // ヘッダー行があるので、lastRowがそのままナンバーになる
  
  // 日時を日本形式でフォーマット
  const timestamp = new Date(data.timestamp);
  const formattedDate = Utilities.formatDate(timestamp, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  
  // データ行を準備（関連No.は自分のNo.と同じ）
  const storeData = [
    rowNumber,        // 関連No.（店舗データの場合は自分のNo.）
    rowNumber,        // No.
    formattedDate,
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
  
  // データを追加
  storeSheet.getRange(lastRow + 1, 1, 1, storeData.length).setValues([storeData]);
  
  // 関連No.列とNo.列を中央揃えに設定
  storeSheet.getRange(lastRow + 1, 1).setHorizontalAlignment('center'); // 関連No.
  storeSheet.getRange(lastRow + 1, 2).setHorizontalAlignment('center'); // No.
  
  console.log('店舗データを追加しました (No.' + rowNumber + '):', storeData);
  
  return rowNumber;
}

// スタイリストデータをスプレッドシートに書き込む関数
function writeStylistData(spreadsheet, data, storeRowNumber) {
  let stylistSheet = spreadsheet.getSheetByName('スタイリストデータ');
  
  // シートが存在しない場合は作成
  if (!stylistSheet) {
    stylistSheet = spreadsheet.insertSheet('スタイリストデータ');
    
    // ヘッダー行を設定（関連No.を左側に配置）
    const headers = [
      '関連No.',
      'No.',
      '送信日時',
      '会社名',
      '店舗名',
      'スタイリストID',
      'スタイリスト名',
      '2023年売上(万円)',
      '2024年売上(万円)',
      '2025年売上(万円)'
    ];
    
    // ヘッダーを設定
    stylistSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // ヘッダー行をフォーマット
    const headerRange = stylistSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#0C5A4B')
               .setFontColor('white')
               .setFontWeight('bold')
               .setHorizontalAlignment('center');
    
    // 列幅を自動調整
    stylistSheet.autoResizeColumns(1, headers.length);
  }
  
  // 日時を日本形式でフォーマット
  const timestamp = new Date(data.timestamp);
  const formattedDate = Utilities.formatDate(timestamp, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  
  // 各スタイリストのデータを追加
  data.stylists.forEach(stylist => {
    const lastRow = stylistSheet.getLastRow();
    const rowNumber = lastRow; // ヘッダー行があるので、lastRowがそのままナンバーになる
    
    const stylistData = [
      storeRowNumber,   // 関連No.（店舗データのNo.）
      rowNumber,        // No.
      formattedDate,
      data.companyName || '',
      data.storeName || '',
      stylist.id,
      stylist.name,
      stylist.data2023.sales || '',
      stylist.data2024.sales || '',
      stylist.data2025.sales || ''
    ];
    
    stylistSheet.getRange(lastRow + 1, 1, 1, stylistData.length).setValues([stylistData]);
    
    // 関連No.列とNo.列を中央揃えに設定
    stylistSheet.getRange(lastRow + 1, 1).setHorizontalAlignment('center'); // 関連No.
    stylistSheet.getRange(lastRow + 1, 2).setHorizontalAlignment('center'); // No.
    
    console.log('スタイリストデータを追加しました (No.' + rowNumber + ', 関連No.' + storeRowNumber + '):', stylistData);
  });
}

// テスト用関数（GAS編集画面で実行可能）
function testFunction() {
  const testData = {
    timestamp: new Date().toISOString(),
    companyName: 'テスト株式会社',
    storeName: 'テスト店舗',
    store: {
      hotpepperUrl: 'https://beauty.hotpepper.jp/test',
      data2023: { sales: '1000', customers: '500', nomination: '80' },
      data2024: { sales: '1200', customers: '600', nomination: '85' },
      data2025: { sales: '1400', customers: '700', nomination: '90' }
    },
    stylists: [
      {
        id: '1',
        name: 'テストスタイリスト1',
        data2023: { sales: '300' },
        data2024: { sales: '350' },
        data2025: { sales: '400' }
      },
      {
        id: '2',
        name: 'テストスタイリスト2',
        data2023: { sales: '250' },
        data2024: { sales: '280' },
        data2025: { sales: '320' }
      }
    ]
  };
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const storeRowNumber = writeStoreData(spreadsheet, testData);
    writeStylistData(spreadsheet, testData, storeRowNumber);
    console.log('テストデータの書き込みが完了しました (店舗No.' + storeRowNumber + ')');
  } catch (error) {
    console.error('テスト実行エラー:', error);
  }
}