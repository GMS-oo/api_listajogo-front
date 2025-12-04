document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. VERIFICAÇÃO DE LOGIN
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }
    
    // Atualiza nome do usuário no header
    const usuario = JSON.parse(usuarioLogado);
    const profileLink = document.querySelector('.profile-link');
    if(profileLink) profileLink.textContent = `Olá, ${usuario.nome}`;

    // 2. BUSCA DE JOGOS
    const gridContainer = document.querySelector('.game-grid-container');
    if (!gridContainer) return;

    try {
        const response = await fetch(`${API_URL}/Jogos`);

        if (response.ok) {
            const jogos = await response.json();
            
            if (jogos.length === 0) {
                 gridContainer.innerHTML = '<p>Nenhum jogo encontrado.</p>';
                 return;
            }

            gridContainer.innerHTML = ''; 
            
            jogos.forEach(jogo => {

                const linkDetalhes = `detalhes.html?id=${jogo.id}`;
                
                // Monta URL da Imagem
                const baseApiUrl = API_URL.replace('/api', '');
                const capaUrlCompleta = baseApiUrl + jogo.capaUrl;

                // CRIA O CARD SOMENTE COM A IMAGEM
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card-simple'; 

                gameCard.innerHTML = `
                    <a href="${linkDetalhes}" title="${jogo.nome}">
                        <img src="${capaUrlCompleta}" alt="${jogo.nome}" class="game-cover-simple">
                    </a>
                `;
                gridContainer.appendChild(gameCard);
            });

        } else {
             gridContainer.innerHTML = '<p>Erro ao carregar lista.</p>';
        }

    } catch (error) {
        console.error('Erro:', error);
    }
});