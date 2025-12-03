// js/login.js

// Certifique-se de que o config.js está carregado antes deste
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            
            // DTO de Login (o que a API espera)
            const loginData = {
                email: email,
                senha: senha
            };

            try {
                const response = await fetch(`${API_URL}/Usuario/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                if (response.ok) {
                    // Login bem-sucedido
                    const usuario = await response.json();
                    
                    // Armazena dados do usuário (ID, Nome) no navegador
                    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

                    // Redireciona para a página da biblioteca
                    window.location.href = 'biblioteca.html'; 
                } else if (response.status === 401) {
                    alert('Email ou senha inválidos. Tente novamente.');
                } else {
                    alert('Ocorreu um erro no servidor. Tente novamente mais tarde.');
                }
            } catch (error) {
                console.error('Erro de rede ou conexão:', error);
                alert('Erro ao tentar conectar com a API.');
            }
        });
    }
});