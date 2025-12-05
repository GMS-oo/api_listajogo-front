
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            
           
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
                   
                    const usuario = await response.json();
                    
                 
                    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

                  
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