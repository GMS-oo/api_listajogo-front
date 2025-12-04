const urlParams = new URLSearchParams(window.location.search);
const jogoId = urlParams.get('id');


document.addEventListener('DOMContentLoaded', () => {
    if (!jogoId) {
        alert('Jogo não especificado!');
        window.location.href = 'biblioteca.html';
        return;
    }

  
    carregarDetalhesDoJogo();
    carregarComentarios();
});


async function carregarDetalhesDoJogo() {
    try {
        const response = await fetch(`${API_URL}/Jogos/${jogoId}`);
        
        if (!response.ok) {
            document.getElementById('detalhes-loader').innerText = 'Jogo não encontrado.';
            return;
        }

        const jogo = await response.json();

        // Arruma a URL da imagem
        const baseApiUrl = API_URL.replace('/api', '');
        const capaCompleta = baseApiUrl + jogo.capaUrl;

      
        const precoFormatado = jogo.valor === 0 
            ? 'Grátis' 
            : jogo.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const html = `
            <div>
                <img src="${capaCompleta}" class="capa-grande" alt="${jogo.nome}" onerror="this.src='imagens/sem-capa.jpg'">
            </div>

            <div class="infos">
                <h1>${jogo.nome}</h1>
                
                <div class="meta">
                    <span>🎮 ${jogo.plataforma}</span>
                    <span>📂 ${jogo.genero}</span>
                    <span>⭐ ${jogo.nota}</span>
                </div>

                <div class="desc">
                    ${jogo.descricao || 'Sem descrição disponível.'}
                </div>

                <div class="preco-box">
                    <span class="preco-valor">${precoFormatado}</span>
                    
                </div>
            </div>
        `;

      
        const container = document.getElementById('detalhes-conteudo');
        container.innerHTML = html;
        container.style.display = 'flex'; 
        document.getElementById('detalhes-loader').style.display = 'none';

    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        document.getElementById('detalhes-loader').innerText = 'Erro ao carregar detalhes.';
    }
}


async function carregarComentarios() {
    try {
        const response = await fetch(`${API_URL}/Comentarios/jogo/${jogoId}`);
        const listaDiv = document.getElementById('lista-comentarios');
        
        if (response.ok) {
            const comentarios = await response.json();

            listaDiv.innerHTML = ''; 

            if (comentarios.length === 0) {
                listaDiv.innerHTML = '<p style="color: #888;">Nenhum comentário ainda. Seja o primeiro!</p>';
                return;
            }

            comentarios.forEach(c => {
                // Formata a data (ex: 03/12/2025 às 14:30)
                const dataObj = new Date(c.dataComentario);
                const dataFormatada = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

           
                const nomeUsuario = c.usuario ? c.usuario.nome : 'Usuário Desconhecido';

                listaDiv.innerHTML += `
                    <div class="comentario-item">
                        <div class="comentario-header">
                            <span class="autor">${nomeUsuario}</span>
                            <span>${dataFormatada}</span>
                        </div>
                        <div style="color: #ddd;">${c.texto}</div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
    }
}

// --- FUNÇÃO 3: Enviar Comentário ---
async function enviarComentario() {
    const txtInput = document.getElementById('txtComentario');
    const texto = txtInput.value.trim();
    
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Você precisa estar logado para comentar!');
        window.location.href = 'login.html';
        return;
    }
    
    if (!texto) {
        alert('Por favor, escreva alguma coisa.');
        return;
    }

    const usuario = JSON.parse(usuarioLogado);

    // Objeto para enviar para a API
    const novoComentario = {
        Texto: texto,
        UsuarioId: usuario.id,
        JogoId: parseInt(jogoId) 
    };

    try {
        const response = await fetch(`${API_URL}/Comentarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoComentario)
        });

        if (response.ok) {
        
            txtInput.value = '';
            carregarComentarios(); 
        } else {
            alert('Erro ao enviar comentário. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão com o servidor.');
    }
}