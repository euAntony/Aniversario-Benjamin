function revelarConvite() {
    const btn = document.querySelector('.btn-open-invite');

    // 1. Muda o estado do botão para dar feedback visual imediato
    btn.innerHTML = '<span>Preparando o convite...</span> <div class="loader"></div>';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.85';

    setTimeout(() => {
        window.location.href = 'src/Convite/convite.html';
    }, 7000);
}
// Redireciona após 7 segundos