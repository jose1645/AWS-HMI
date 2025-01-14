import React, { useState } from 'react';
import '../styles/modal.css';
import FAQButton from './FAQButton';

const KeymapModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const keymapDescriptions = {
    Voltaje: "Tensión eléctrica en voltios (V).",
    Corriente: "Flujo de carga eléctrica en amperios (A).",
    Potencia: "Energía eléctrica consumida en kilovatios (kW).",
    Frecuencia: "Ciclos de corriente alterna por segundo en hertzios (Hz).",
    VAB: "Tensión entre las fases A y B en voltios.",
    VBC: "Tensión entre las fases B y C en voltios.",
    VB: "Tensión de la fase B a tierra en voltios.",
    VA: "Tensión de la fase A a tierra en voltios.",
    VC: "Tensión de la fase C a tierra en voltios.",
    VAC: "Tensión entre las fases A y C en voltios.",
    Consumo_electrico: "Energía eléctrica total consumida en kW/h.",
    CC: "Corriente continua en amperios (A).",
    CB: "Corriente en la fase B en amperios (A).",
    CA: "Corriente en la fase A en amperios (A).",
  };

  return (








<div>
      <FAQButton
        onClick={() => setIsOpen(true)}
        tooltip="Mapa de Claves" // Tooltip dinámico
      />









      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Mapa de Claves</h2>
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Parámetro</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(keymapDescriptions).map(([key, description]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>



            <button
              className="close-modal-button"
              onClick={() => setIsOpen(false)}
            >
              Cerrar
            </button>





            
          </div>
        </div>
      )}
    </div>
  );
};

export default KeymapModal;
