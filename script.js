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
    updateRemoveButtons();

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
        window.location.href = 'https://form.k3r.jp/cm_consulting/salon-survey';

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

// タブ切り替え機能
function switchTab(tabName) {
    // 全てのタブボタンからactiveクラスを削除
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // 全てのタブコンテンツからactiveクラスを削除
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // クリックされたタブボタンにactiveクラスを追加
    event.target.classList.add('active');

    // 対応するタブコンテンツにactiveクラスを追加
    document.getElementById(tabName + '-tab').classList.add('active');
}

// 店舗タブの入力完了チェック
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

// スタイリストタブの入力完了チェック
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

// 送信ボタンの状態更新
function updateSubmitButtonState() {
    const submitButton = document.getElementById('submit-btn');
    const companyName = document.getElementById('company-name').value.trim();
    const storeName = document.getElementById('store-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const storeComplete = checkStoreTabComplete();
    const stylistComplete = checkStylistTabComplete();

    // 基本情報 + (店舗タブ完了 OR スタイリストタブ完了)
    const basicInfoComplete = companyName && storeName && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const canSubmit = basicInfoComplete && (storeComplete || stylistComplete);

    submitButton.disabled = !canSubmit;

    if (canSubmit) {
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitButton.textContent = '送信';
    } else {
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';

        if (!basicInfoComplete) {
            if (!companyName || !storeName || !email) {
                submitButton.textContent = '基本情報を入力してください';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                submitButton.textContent = '正しいメールアドレスを入力してください';
            }
        } else {
            submitButton.textContent = '店舗データまたはスタイリストデータを完成してください';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-stylist').addEventListener('click', addStylist);

    // 全ての入力フィールドに変更監視を追加
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.addEventListener('input', updateSubmitButtonState);
        input.addEventListener('blur', updateSubmitButtonState);
    });

    // 動的に追加されるスタイリスト行のイベントリスナーも更新
    const originalAddStylist = addStylist;
    window.addStylist = function() {
        originalAddStylist();
        // 新しく追加された行の入力フィールドにもイベントリスナーを追加
        const newInputs = document.querySelectorAll('#stylist-tbody tr:last-child input');
        newInputs.forEach(input => {
            input.addEventListener('input', updateSubmitButtonState);
            input.addEventListener('blur', updateSubmitButtonState);
        });
    };

    // 初期状態の送信ボタン設定
    updateSubmitButtonState();

    document.getElementById('salonForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = collectFormData();
        const companyName = document.getElementById('company-name').value.trim();
        const storeName = document.getElementById('store-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const storeComplete = checkStoreTabComplete();
        const stylistComplete = checkStylistTabComplete();

        if (!companyName || !storeName || !email) {
            alert('基本情報（会社名、店舗名、メールアドレス）をすべて入力してください。');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('正しいメールアドレスを入力してください。');
            return;
        }

        if (!storeComplete && !stylistComplete) {
            alert('店舗タブまたはスタイリストタブのどちらかを完成してください。');
            return;
        }

        submitForm(formData);
    });
});
