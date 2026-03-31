import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Carregando...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/status', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro na requisição: ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        setStatus(text);
      })
      .catch((err) => {
        setError(err.message);
        setStatus('Falha ao buscar status.');
      });
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Status do servidor</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{status}</p>
      )}
    </div>
  );
}

export default App;
