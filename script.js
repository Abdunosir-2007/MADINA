let userAnswers = {
    q1: '',
    q2: '',
    q3: '',
    final: ''
};

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
    setTimeout(() => { nextStep(questionKey, nextStepId); }, 400);
}

// Eng oxirgi yakuniy bosqich
function finishQuiz(finalChoice) {
    userAnswers.final = finalChoice;
    
    if (finalChoice.includes('Xa')) {
        nextStep('q4', 'thanks-yes');
        if (typeof confetti === 'function') {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
        setupTelegramButton('send-tg-yes');
    } else {
        nextStep('q4', 'thanks-no');
        setupTelegramButton('send-tg-no');
    }
}

// Telegramga xabar bilan to'g'ridan-to'g'ri yo'naltirish funksiyasi
function setupTelegramButton(buttonId) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.onclick = function() {
        // Madina sizga yuboradigan tayyor xat matni
        const textMessage = "Salom Abdunosir! 😊 Men sen yuborgan maxsus so'rovnomadan o'tdim. Mana mening javoblarim:\n\n" +
                            "💬 1-Savol (Birinchi yozganingda): " + userAnswers.q1 + "\n" +
                            "💬 2-Savol (Suhbatlarimiz haqida): " + userAnswers.q2 + "\n" +
                            "💬 3-Savol (Sevishingni aytganimda): " + userAnswers.q3 + "\n" +
                            "💍 Final taklifingga javobim: " + userAnswers.final;
        
        const YOUR_TG_USERNAME = "Abdunosir_2007"; 
        
        // Slesh (/) belgisi aniq qo'yilgan matnli havola zanjiri (Bloklanmaydi va adashmaydi)
        const url = "https://t.me//" + YOUR_TG_USERNAME + "?text=" + encodeURIComponent(textMessage);
        
        // Telegram dasturini yangi oynada ochish
        window.open(url, '_blank');
    };
}
