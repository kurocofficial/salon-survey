// ===============================================
// ヘアサロンアンケート用 Google Apps Script (最終修正版)
// ===============================================

// 設定: 以下のスプレッドシートIDを実際のものに置き換えてください
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// メイン処理: POSTリクエストを受信してスプレッドシートに書き込み
function doPost(e) {
  // CORSヘッダーを設定
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // 手動実行時のエラー回避
    if (!e || !e.postData) {
      output.setContent(JSON.stringify({
        result: 'error',
        message: 'この関数は手動実行できません。testFunction()を実行してください。'
      }));
      return output;
    }
    
    // リクエストデータを解析
    const data = JSON.parse(e.postData.contents);
    console.log('受信データ:', data);
    
    // スプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 店舗データシートに書き込み
    writeStoreData(spreadsheet, data);
    
    // スタイリストデータシートに書き込み（データがある場合のみ）
    if (data.stylists && data.stylists.length > 0) {
      writeStylistData(spreadsheet, data);
    }
    
    // 成功レスポンスを返す
    output.setContent(JSON.stringify({
      result: 'success',
      message: 'データが正常に保存されました',
      timestamp: new Date().toISOString()
    }));
    
    return output;
      
  } catch (error) {
    console.error('エラー:', error);
    
    // エラーレスポンスを返す
    output.setContent(JSON.stringify({
      result: 'error',
      message: error.toString(),
      timestamp: new Date().toISOString()
    }));
    
    return output;
  }
}

// 店舗データをスプレッドシートに書き込む関数
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
  
  // データ行を準備
  const storeData = [
    new Date(data.timestamp),
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
  const lastRow = storeSheet.getLastRow();
  storeSheet.getRange(lastRow + 1, 1, 1, storeData.length).setValues([storeData]);
  
  console.log('店舗データを追加しました:', storeData);
}

// スタイリストデータをスプレッドシートに書き込む関数
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
  
  // 各スタイリストのデータを追加
  data.stylists.forEach(stylist => {
    const stylistData = [
      new Date(data.timestamp),
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
    
    console.log('スタイリストデータを追加しました:', stylistData);
  });
}

// GETリクエストの処理（動作確認用）
function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.TEXT);
  output.setContent('ヘアサロンアンケート用GASが正常に動作しています！\n現在時刻: ' + new Date().toLocaleString('ja-JP'));
  return output;
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
      }
    ]
  };
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    writeStoreData(spreadsheet, testData);
    writeStylistData(spreadsheet, testData);
    console.log('テストデータの書き込みが完了しました');
  } catch (error) {
    console.error('テスト実行エラー:', error);
  }
}