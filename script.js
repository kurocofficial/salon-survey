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
    try {
        const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('データを送信しました。ありがとうございます。');
            window.location.href = 'https://form.k3r.jp/cm_consulting/habu-ADACHI';
        } else {
            throw new Error('送信に失敗しました');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('送信中にエラーが発生しました。もう一度お試しください。');
    }
}

function collectFormData() {
    const formData = {
        timestamp: new Date().toISOString(),
        companyName: document.getElementById('company-name').value,
        storeName: document.getElementById('store-name').value,
        store: {
            hotpepperUrl: document.getElementById('hotpepper-url').value,
            data2023: {
                sales: document.querySelector('[name="store2023Sales"]').value,
                customers: document.querySelector('[name="store2023Customers"]').value,
                nomination: document.querySelector('[name="store2023Nomination"]').value
            },
            data2024: {
                sales: document.querySelector('[name="store2024Sales"]').value,
                customers: document.querySelector('[name="store2024Customers"]').value,
                nomination: document.querySelector('[name="store2024Nomination"]').value
            },
            data2025: {
                sales: document.querySelector('[name="store2025Sales"]').value,
                customers: document.querySelector('[name="store2025Customers"]').value,
                nomination: document.querySelector('[name="store2025Nomination"]').value
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