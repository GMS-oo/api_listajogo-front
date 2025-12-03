// js/lista.js

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. VERIFICAÇÃO DE LOGIN
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Você precisa fazer login para acessar a biblioteca!');
        window.location.href = 'login.html';
        return;
    }
    
    const usuario = JSON.parse(usuarioLogado);
    
    const profileLink = document.querySelector('.profile-link');
    if(profileLink) {
        profileLink.textContent = `Olá, ${usuario.nome}`;
    }

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
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';
                
                // Monta URL da Imagem
                const baseApiUrl = API_URL.replace('/api', '');
                const capaUrlCompleta = baseApiUrl + jogo.capaUrl;

                // Formata o PREÇO (Ex: R$ 200,00 ou Grátis)
                const precoFormatado = jogo.valor === 0 
                    ? 'Grátis' 
                    : jogo.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                // --INFORMAÇÕES --
                gameCard.innerHTML = `
                    <div class="store-badge">${jogo.plataforma}</div>
                    
                    <div class="game-image-container">
                        <img src="${capaUrlCompleta}" alt="${jogo.nome}" class="game-cover">
                    </div>
                    
                    <div class="game-info">
                        <h3 class="game-title">${jogo.nome}</h3>
                        
                        <div class="game-meta">
                            <span class="genre">${jogo.genero}</span>
                            <span class="rating">⭐ ${jogo.nota}</span>
                        </div>

                        <p class="game-desc">${jogo.descricao}</p>

                        <div class="game-footer">
                            <span class="price">${precoFormatado}</span>
                            
                        </div>
                    </div>
                `;
                gridContainer.appendChild(gameCard);
            });

        } else {
             gridContainer.innerHTML = '<p>Erro ao carregar a lista.</p>';
        }

    } catch (error) {
        console.error('Erro:', error);
    }
});