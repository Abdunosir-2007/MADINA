// ====== ⚠️ TELEGRAM BOT SOZLAMALARI ======
const TELEGRAM_BOT_TOKEN = '8623725212:AAGWo3gSwzxuc8lOrMSM-ci9LVrj9pNUYGA'; 
const TELEGRAM_CHAT_ID = '8470974811';    
// ==========================================

let userAnswers = {
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
};

let selectedPhotoFile = null;

// Orqa fondagi sekin aylanuvchi chiroyli elementlar
function createBackgroundHearts() {
    const bg = document.getElementById('heartsBg');
    if (!bg) return;
    const symbols = ['✨', '💭', '🌸', '⚡', '💫', '🎈'];
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = Math.random() * 20 + 20 + 'px';
        heart.style.animationDuration = Math.random() * 3 + 5 + 's';
        bg.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 6000);
    }, 450);
}
window.onload = createBackgroundHearts;

// Bosqichlarni almashtirish
function nextStep(currentId, nextId) {
    const currentCard = document.getElementById(`step-${currentId}`);
    const nextCard = document.getElementById(`step-${nextId}`);
    if (currentCard && nextCard) {
        currentCard.classList.add('exit');
        setTimeout(() => {
            currentCard.classList.remove('active', 'exit');
            nextCard.classList.add('active');
        }, 400);
    }
}

// Variant tanlanganda saqlash
function selectOption(questionKey, value, nextStepId) {
    userAnswers[questionKey] = value;
    if (event && event.target) {
        event.target.classList.add('selected');
    }
    
    // Savollar to'liq tugab feedback maydoniga o'tishda matnli natijalarni yuboramiz
    if(nextStepId === 'feedback') {
        sendTextResultsToBot();
    }
    
    setTimeout(() => { nextStep(questionKey, nextStepId); }, 400);
}

// Matnli natijalarni Telegram botga yuborish funksiyasi
function sendTextResultsToBot() {
    const textMessage = `
📊 *Madinadan 2-Bosqich So'rovnoma Natijalari:*

👤 *Kimdan:* Madina
💬 *1-Savol (Instagram podpiska):* ${userAnswers.q1}
💬 *2-Savol (Mondan boshqa kimdir bormi):* ${userAnswers.q2}
💬 *3-Savol (Qo'shiq janri):* ${userAnswers.q3}
💬 *4-Savol (Uchrashuv joyi):* ${userAnswers.q4}
🎯 *5-Savol (Xarakter kuchli hislati):* ${userAnswers.q5}
    `;

    // 100% TO'G'RI RASMIY API MANZILI:
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(textMessage)}&parse_mode=Markdown`;
    
    const hiddenImage = new Image();
    hiddenImage.src = url;
    console.log("Matnli javoblar botga uchdi! 🚀");
}

// Madina fayl tanlaganda ishlaydigan vizual yordamchi
function handleFileSelect() {
    const fileInput = document.getElementById('photoFile');
    const labelText = document.getElementById('fileLabelText');
    const sendBtn = document.getElementById('sendPhotoBtn');
    
    if(fileInput.files.length > 0) {
        // [0] QO'YILDI - Massiv ichidan aniq bitta fayl obyektini sug'urib oladi!
        selectedPhotoFile = fileInput.files[0]; 
        
        labelText.innerText = "Rasm tanlandi: " + selectedPhotoFile.name + " ✅";
        labelText.style.background = "#23d5ab";
        sendBtn.style.display = "block"; 
    }
}

// 📸 MADINA YUKLAGAN RASMNI TELEGRAM BOTGA YUBORISH (FINAL HARAKAT)
function uploadPhotoToBot() {
    if (!selectedPhotoFile) return;
    
    const statusDiv = document.getElementById('uploadStatus');
    const sendBtn = document.getElementById('sendPhotoBtn');
    
    statusDiv.innerText = "Rasm yuklanyapti, biroz kuting... ⏳";
    sendBtn.disabled = true;

    // Rasmni yuborish uchun FormData tayyorlaymiz
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', selectedPhotoFile);
    formData.append('caption', "📸 Madina o'z rasmini yukladi! ❤️");

    // TO'G'RI RASMIY SENDPHOTO MANZILI QO'YILDI!
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.ok) {
            statusDiv.innerText = "";
            nextStep('photo-upload', 'final-thanks');
        } else {
            statusDiv.innerText = "Uzatishda muammo bo'ldi, qaytadan urinib ko'ring! ❌";
            sendBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error("Xatolik:", error);
        statusDiv.innerText = "Tarmoq xatoligi yuz berdi! ❌";
        sendBtn.disabled = false;
    });
}
