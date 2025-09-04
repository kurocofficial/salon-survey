let stylistCount = 5;
const maxStylists = 10;

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

function addStylist() {
    if (stylistCount >= maxStylists) return;

    stylistCount++;
    const tbody = document.getElementById('stylist-tbody');

    const rowHTML = `
        <tr data-stylist="${stylistCount}">
            <td><input type="text" name="stylist${stylistCount}Name" placeholder="スタイリスト名" class="name-input"></td>
            <td><input type="number" name="stylist${stylistCount}_2023Sales" placeholder="0" class="sales-input"></td>
            <td><input type="number" name="stylist${stylistCount}_2024Sales" placeholder="0" class="sales-input"></td>
            <td><input type="number" name="stylist${stylistCount}_2025Sales" placeholder="0" class="sales-input"></td>
            <td><button type="button" class="remove-row" onclick="removeRow(${stylistCount})">削除</button></td>
        </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', rowHTML);
    
    // 新しい入力フィールドにイベントリスナーを追加
    const newRow = tbody.lastElementChild;
    const newInputs = newRow.querySelectorAll('input');
    newInputs.forEach(input => {
        input.addEventListener('input', updateSubmitButtonState);
        input.addEventListener('blur', updateSubmitButtonState);
    });
    
    updateRemoveButtons();
    updateSubmitButtonState(); // 送信ボタン状態を更新

    if (stylistCount >= maxStylists) {
        document.getElementById('add-stylist').disabled = true;
        document.getElementById('add-stylist').textContent = '最大10名まで';
    }
}

function removeRow(stylistId) {
    const row = document.querySelector(`[data-stylist="${stylistId}"]`);
    if (row) {
        row.remove();
        stylistCount--;
        updateRemoveButtons();
        updateSubmitButtonState(); // 送信ボタン状態を更新

        const addButton = document.getElementById('add-stylist');
        addButton.disabled = false;
        addButton.textContent = '+ スタイリストを追加';
    }
}

function updateRemoveButtons() {
    const rows = document.querySelectorAll('#stylist-tbody tr');
    rows.forEach((row, index) => {
        const removeButton = row.querySelector('.remove-row');
        if (removeButton) {
            removeButton.disabled = rows.length <= 1;
        }
    });
}

async function submitForm(formData) {
    const submitButton = document.getElementById('submit-btn');
    const originalText = submitButton.textContent;

    try {
        // ローディング状態を開始
        setLoadingState(submitButton, true);

        const response = await fetch('https://script.google.com/macros/s/AKfycbyTWp7a-xs7r81jstzBf72DeVHHzMzSLDIfS74eTvHQSZuVNY06W5BuUESktTs09urvfQ/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // 少し待機してからローディング状態を終了（UX向上）
        await new Promise(resolve => setTimeout(resolve, 500));

        // ローディング状態を終了
        setLoadingState(submitButton, false);

        // no-corsモードでは response.ok が使えないため、成功として扱う
        alert('データを送信しました。ありがとうございます。');
        window.location.href = 'https://form.k3r.jp/cm_consulting/habu-ADACHI';

    } catch (error) {
        console.error('Error:', error);

        // ローディング状態を終了
        setLoadingState(submitButton, false);

        alert('送信中にエラーが発生しました。もう一度お試しください。');
    }
}

// ローディング状態を管理する関数
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span>送信中...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.innerHTML = '送信';
        button.classList.remove('loading');
    }
}

function collectFormData() {
    const formData = {
        timestamp: new Date().toISOString(),
        companyName: document.getElementById('company-name').value,
        storeName: document.getElementById('store-name').value,
        email: document.getElementById('email').value,
        store: {
            hotpepperUrl: document.querySelector('[name="hotpepperUrl"]').value,
            data2023: {
                sales: document.querySelector('[name="store2023Sales"]').value,
                customers: document.querySelector('[name="store2023Customers"]').value,
                cardCustomers: document.querySelector('[name="store2023CardCustomers"]').value,
                nomination: document.querySelector('[name="store2023Nomination"]').value,
                revisit: document.querySelector('[name="store2023Revisit"]').value,
                retail: document.querySelector('[name="store2023Retail"]').value
            },
            data2024: {
                sales: document.querySelector('[name="store2024Sales"]').value,
                customers: document.querySelector('[name="store2024Customers"]').value,
                cardCustomers: document.querySelector('[name="store2024CardCustomers"]').value,
                nomination: document.querySelector('[name="store2024Nomination"]').value,
                revisit: document.querySelector('[name="store2024Revisit"]').value,
                retail: document.querySelector('[name="store2024Retail"]').value
            },
            data2025: {
                sales: document.querySelector('[name="store2025Sales"]').value,
                customers: document.querySelector('[name="store2025Customers"]').value,
                cardCustomers: document.querySelector('[name="store2025CardCustomers"]').value,
                nomination: document.querySelector('[name="store2025Nomination"]').value,
                revisit: document.querySelector('[name="store2025Revisit"]').value,
                retail: document.querySelector('[name="store2025Retail"]').value
            }
        },
        stylists: []
    };

    const stylistRows = document.querySelectorAll('#stylist-tbody tr[data-stylist]');
    stylistRows.forEach(row => {
        const stylistId = row.dataset.stylist;
        const name = document.querySelector(`[name="stylist${stylistId}Name"]`).value;

        if (name.trim()) {
            formData.stylists.push({
                id: stylistId,
                name: name,
                data2023: {
                    sales: document.querySelector(`[name="stylist${stylistId}_2023Sales"]`).value
                },
                data2024: {
                    sales: document.querySelector(`[name="stylist${stylistId}_2024Sales"]`).value
                },
                data2025: {
                    sales: document.querySelector(`[name="stylist${stylistId}_2025Sales"]`).value
                }
            });
        }
    });

    return formData;
}

// 送信制御関連関数
function checkBasicInfoComplete() {
    const companyName = document.getElementById('company-name').value.trim();
    const storeName = document.getElementById('store-name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    return companyName && storeName && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkStoreTabComplete() {
    const storeFields = [
        'store2023Sales', 'store2023Customers', 'store2023CardCustomers', 
        'store2023Nomination', 'store2023Revisit', 'store2023Retail',
        'store2024Sales', 'store2024Customers', 'store2024CardCustomers', 
        'store2024Nomination', 'store2024Revisit', 'store2024Retail',
        'store2025Sales', 'store2025Customers', 'store2025CardCustomers', 
        'store2025Nomination', 'store2025Revisit', 'store2025Retail',
        'hotpepperUrl'
    ];
    
    return storeFields.every(field => {
        const element = document.querySelector(`[name="${field}"]`);
        return element && element.value.trim() !== '';
    });
}

function checkStylistTabComplete() {
    const stylistRows = document.querySelectorAll('#stylist-tbody tr[data-stylist]');
    
    for (let row of stylistRows) {
        const stylistId = row.dataset.stylist;
        const name = document.querySelector(`[name="stylist${stylistId}Name"]`).value.trim();
        const sales2023 = document.querySelector(`[name="stylist${stylistId}_2023Sales"]`).value.trim();
        const sales2024 = document.querySelector(`[name="stylist${stylistId}_2024Sales"]`).value.trim();
        const sales2025 = document.querySelector(`[name="stylist${stylistId}_2025Sales"]`).value.trim();
        
        // 1名でも完全入力されていればOK
        if (name && sales2023 && sales2024 && sales2025) {
            return true;
        }
    }
    
    return false;
}

function updateSubmitButtonState() {
    const submitButton = document.getElementById('submit-btn');
    const basicComplete = checkBasicInfoComplete();
    const storeComplete = checkStoreTabComplete();
    const stylistComplete = checkStylistTabComplete();
    
    const canSubmit = basicComplete && (storeComplete || stylistComplete);
    
    submitButton.disabled = !canSubmit;
    
    // ボタンのスタイルも更新
    if (canSubmit) {
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitButton.textContent = '送信';
    } else {
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';
        
        if (!basicComplete) {
            submitButton.textContent = '基本情報を入力してください';
        } else if (!storeComplete && !stylistComplete) {
            submitButton.textContent = '店舗またはスタイリストデータを完成してください';
        }
    }
    
    // 進捗状況を更新
    updateProgressDisplay(basicComplete, storeComplete, stylistComplete);
}

function updateProgressDisplay(basicComplete, storeComplete, stylistComplete) {
    // 進捗表示を更新（後で追加）
    const progressElement = document.getElementById('progress-display');
    if (progressElement) {
        let completedTabs = 0;
        let totalTabs = 3; // 基本情報 + 店舗 or スタイリスト
        
        if (basicComplete) completedTabs++;
        if (storeComplete) completedTabs++;
        if (stylistComplete) completedTabs++;
        
        const progress = Math.round((completedTabs / totalTabs) * 100);
        progressElement.textContent = `完成率: ${progress}%`;
        progressElement.style.color = progress >= 66 ? '#0C5A4B' : '#ff4757';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-stylist').addEventListener('click', addStylist);
    
    // 初期状態設定
    updateSubmitButtonState();
    
    // 入力フィールドの監視設定
    const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], input[type="url"]');
    allInputs.forEach(input => {
        input.addEventListener('input', updateSubmitButtonState);
        input.addEventListener('blur', updateSubmitButtonState);
    });

    // 新しいフォームバリデーション関数（パターンA対応）
    function validateFormAdvanced() {
        const basicComplete = checkBasicInfoComplete();
        const storeComplete = checkStoreTabComplete();
        const stylistComplete = checkStylistTabComplete();
        
        if (!basicComplete) {
            alert('基本情報（会社名、店舗名、メールアドレス）をすべて入力してください。');
            return false;
        }
        
        if (!storeComplete && !stylistComplete) {
            alert('「店舗タブ」または「スタイリストタブ」のどちらかを完成してください。\n\n■ 店舗タブ: すべての項目を入力\n■ スタイリストタブ: 最低1名のデータを完全入力');
            
            if (!storeComplete) {
                switchTab('store');
            } else {
                switchTab('stylist');
            }
            return false;
        }
        
        return true;
    }

    document.getElementById('salonForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // 新しいバリデーションチェック（パターンA）
        if (!validateFormAdvanced()) {
            return;
        }

        const formData = collectFormData();
        submitForm(formData);
    });
});
