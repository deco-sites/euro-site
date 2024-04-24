import { useState } from 'preact/hooks';

const Popup = () => {
  const [cep, setCep] = useState('');

  const handleCepChange = (e: Event) => {
    setCep((e.target as HTMLInputElement).value);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    fetch("/api/sessions/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "public": {
          "postalCode": {
            "value": cep
          },
          "country": {
            "value": "BRA"
          }
        }
      })
    }).then(res => res.json()).then(res => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  return (
    <div class="cep-popup">
      <h2>Informe o CEP</h2>
      <div> 
        <input
          type="text"
          placeholder="Digite o CEP"
          value={cep}
          onInput={handleCepChange}
        />
        <button onClick={handleSubmit}>Enviar</button> 
      </div>
    </div>
  );
};

export default Popup;
