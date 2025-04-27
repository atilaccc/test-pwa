import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Verifica se o app já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsAppInstalled(true);
    }

    // Evento para capturar o prompt de instalação
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    // Evento para detectar se o app foi instalado
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
        } else {
          console.log('Usuário recusou a instalação');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="app-container">
      <h1>Hello World PWA!</h1>
      <p>Bem-vindo ao meu primeiro PWA elaborado com React.</p>
      
      <div className="features">
        <div className="feature">
          <h2>✅ Responsivo</h2>
          <p>Funciona em qualquer dispositivo</p>
        </div>
        <div className="feature">
          <h2>📱 Instalável</h2>
          <p>Adicione à tela inicial do seu celular</p>
        </div>
        <div className="feature">
          <h2>🚀 Rápido</h2>
          <p>Carrega instantaneamente</p>
        </div>
      </div>

      {deferredPrompt && !isAppInstalled && (
        <button className="install-button" onClick={handleInstallClick}>
          Instalar App
        </button>
      )}
    </div>
  );
}

export default App;