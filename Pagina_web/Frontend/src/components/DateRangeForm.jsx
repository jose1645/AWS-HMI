import React, { useState } from 'react';
import "../styles/DateRangeForm.css"; // Estilos específicos para este botón

function DateRangeForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError('Por favor, selecciona ambas fechas.');
      return;
    }

    // Limpiar el error si ya se han seleccionado las fechas
    setError(null);

    try {
      // Formatear las fechas de manera correcta para la URL (si es necesario)
      const url = `https://zftcgbnpl0.execute-api.us-east-1.amazonaws.com/HMI/dashboard/consumo_electrico?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del backend');
      }

      const data = await response.json();
      console.log('Datos obtenidos:', data);
      // Aquí puedes manejar los datos, por ejemplo, actualizando el estado o mostrando los resultados.
    } catch (error) {
      console.error(error);
      setError('Hubo un problema al obtener los datos.');
    }
  };

  return (
    <div>
      <h2>Selecciona el rango de fechas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="start_date">Fecha y hora de inicio:</label>
          <input
            type="datetime-local"
            id="start_date"
            name="start_date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end_date">Fecha y hora de fin:</label>
          <input
            type="datetime-local"
            id="end_date"
            name="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit">Consultar</button>
      </form>
    </div>
  );
}

export default DateRangeForm;
