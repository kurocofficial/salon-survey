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
    const container = document.getElementById('stylists-container');

    const stylistHTML = `
        <div class="stylist-section" data-stylist="${stylistCount}">
            <button type="button" class="remove-stylist" onclick="removeStylist(${stylistCount})">×</button>
            <h3>スタイリスト ${stylistCount}</h3>
            <div class="stylist-name">
                <label>名前</label>
                <input type="text" name="stylist${stylistCount}Name" placeholder="スタイリスト名">
            </div>
            <div class="year-data">
                <div class="year-column">
                    <h4>2023年</h4>
                    <div class="input-group">
                        <label>売上 (万円)</label>
                        <input type="number" name="stylist${stylistCount}_2023Sales" placeholder="0">
                    </div>
                </div>
                <div class="year-column">
                    <h4>2024年</h4>
                    <div class="input-group">
                        <label>売上 (万円)</label>
                        <input type="number" name="stylist${stylistCount}_2024Sales" placeholder="0">
                    </div>
                </div>
                <div class="year-column">
                    <h4>2025年</h4>
                    <div class="input-group">
                        <label>売上 (万円)</label>
                        <input type="number" name="stylist${stylistCount}_2025Sales" placeholder="0">
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', stylistHTML);

    if (stylistCount >= maxStylists) {
        document.getElementById('add-stylist').disabled = true;
        document.getElementById('add-stylist').textContent = '最大10名まで';
    }
}

function removeStylist(stylistId) {
    if (stylistId <= 5) return;

    const stylistElement = document.querySelector(`[data-stylist="${stylistId}"]`);
    if (stylistElement) {
        stylistElement.remove();
        stylistCount--;

        const addButton = document.getElementById('add-stylist');
        addButton.disabled = false;
        addButton.textContent = '+ スタイリストを追加';
    }
}

async function submitForm(formData) {
    const submitButton = document.getElementById('submit-btn');
    const originalText = submitButton.textContent;
    
    try {
        // ローディング状態を開始
        setLoadingState(submitButton, true);
        
        const response = await fetch('https://script.google.com/macros/s/AKfycbwUlce1g8i7SpW4q4G8qMamB7jrikZ7riLB21Tz5wQlCrYvOs_G3IGupjD_M5FUksFHBw/exec', {
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
        store: {
            hotpepperUrl: '',
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

    const stylistSections = document.querySelectorAll('.stylist-section');
    stylistSections.forEach(section => {
        const stylistId = section.dataset.stylist;
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-stylist').addEventListener('click', addStylist);

    document.getElementById('salonForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = collectFormData();

        if (!formData.companyName || !formData.storeName) {
            alert('会社名と店舗名を入力してください。');
            return;
        }

        submitForm(formData);
    });
});
