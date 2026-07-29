// Lógica do Contador Regressivo
const eventDate = new Date("August 30, 2026 13:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? '0' + days : days;
    document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Lógica dos Menus Expansíveis
function toggleExpand(id) {
    const content = document.getElementById(id);
    const arrow = document.getElementById(id + '-arrow');

    if (content.classList.contains('open')) {
        content.classList.remove('open');
        arrow.innerText = '▼';
    } else {
        // Fecha outros
        document.querySelectorAll('.expand-content').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.expand-header span:last-child').forEach(el => el.innerText = '▼');

        content.classList.add('open');
        arrow.innerText = '▲';
    }
}

// Efeito de Confetes Interativo
function throwConfetti() {
    const colors = ['#1B4980', '#4A90E2', '#93C5FD', '#FBBF24', '#F59E0B', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        confetti.style.width = (Math.random() * 8 + 6) + 'px';
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3500);
    }
}

// ================= FUNÇÕES DO MODAL (REVERTIDAS E NECESSÁRIAS) =================
function openModal() {
    document.getElementById('rsvpModal').classList.add('active');
}

function closeModal() {
    document.getElementById('rsvpModal').classList.remove('active');
}

// Fecha o modal se o convidado clicar no fundo escuro
window.onclick = function(event) {
    const modal = document.getElementById('rsvpModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Tratamento de Envio da Confirmação (Planilha Google + WhatsApp)
async function handleRSVPSubmit(event) {
    event.preventDefault();
    const btnSubmit = document.getElementById('btnSubmitRSVP');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "<span>Enviando...</span>";

    // 1. Coleta os valores digitados no formulário pelos IDs exatos do seu HTML
    const name = document.getElementById('guestName').value;
    const adults = document.getElementById('adultsCount').value;
    const kids = document.getElementById('kidsCount').value;
    const obs = document.getElementById('obs').value;

    const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycby3moFhk3SYjbhnNzfZJpToV6ZKoR7NoND-l1VsjOzYZ_ZUzKYJv1jE1fDB3Kxe4VRF/exec";
    const SEU_WHATSAPP = "5534988095043";

    // 2. Prepara os dados no formato exato que o Google Apps Script lê
    const payload = new URLSearchParams();
    payload.append('nome', name);
    payload.append('adultos', adults);
    payload.append('criancas', kids);
    payload.append('observacao', obs);

    try {
        // Envia para o Google Sheets em segundo plano
        fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload.toString()
        });
    } catch (error) {
        console.log("Erro no envio para planilha:", error);
    }

    // 3. Monta a mensagem para o WhatsApp
    let message = `*Confirmação de Presença - Aniversário do Benjamin* 🎉\n\n`;
    message += `👤 *Nome:* ${name}\n`;
    message += `👨‍👩‍👧 *Adultos:* ${adults}\n`;
    message += `👶 *Crianças:* ${kids}\n`;
    if (obs && obs.trim() !== '') {
        message += `📝 *Obs:* ${obs}\n`;
    }
    message += `\nEstamos muito felizes em comemorar com vocês! ✨`;

    // 4. Animação de confetes, limpa o formulário e fecha o modal
    throwConfetti();
    closeModal();
    event.target.reset();

    // Reset do botão
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = "<span>Confirmar e Enviar 🎉</span>";

    // 5. Abre o WhatsApp com a mensagem pronta
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${SEU_WHATSAPP}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}