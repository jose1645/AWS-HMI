import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "./App.css";
import Header from "./components/Header";
import Keymap from "./components/Keymap";
import Heatmap from "./components/Heatmap";
import HistogramaConsumo from "./components/Histograma";
import GaugeChart from "./components/GaugeChart";
import DateRangeForm from './components/DateRangeForm'; // Asegúrate de que la ruta del archivo sea correcta

const App = () => {


  const [data, setData] = useState(null); // Estado para almacenar los datos del backend
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(false); // Estado para manejar errores

  const timezone = "America/Mexico_City"; // Zona horaria para Michoacán

  const [consumos, setConsumos] = useState([]); // Estado para los consumos
  const [periodo, setPeriodo] = useState("dia"); // Estado para el periodo seleccionado

  // Fetch de los datos del backend para el gauge chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://zftcgbnpl0.execute-api.us-east-1.amazonaws.com/HMI/dashboard/consumo_electrico",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        console.log("Datos obtenidos del gauge chart:", result); // Verifica lo que recibes de la API
        const payload = JSON.parse(result.body);

        // Verifica que los datos de la API y el estado sean diferentes
        if (JSON.stringify(payload) !== JSON.stringify(data)) {
          setData(payload);
        }

        setLoading(false);
        setError(false);
      } catch (err) {
        console.error("Error al obtener los datos del backend:", err);
        setLoading(false);
        setError(true);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3600000); // Actualizar cada hora
    return () => clearInterval(interval);
  }, [data]);

  // Cargando
  if (loading) {
    return <div>Cargando datos...</div>;
  }

  // Error de carga
  if (error || !data) {
    return <div>Error al cargar los datos.</div>;
  }


  // Verifica el formato de la hora
  const localTime = moment.utc(data.fecha_hora).tz(timezone).format("YYYY-MM-DD HH:mm:ss");


  
  return (
    <div className="App">
      <Header />
      <main>
        {/* Timestamp */}
        <div className="timestamp">
          <p>Última actualización: {localTime}</p>
        </div>

        {/* Gauge Charts */}
        <div className="gauge-container">
          <div className="c-chart-gauge">
            <GaugeChart range={[0, 150]} value={data.va || 0} label="Voltaje Fase A" />
            <label className="label">{(data.va || 0).toFixed(2)} VAC</label>
            <br />
            <label className="label">"VA"</label>
          </div>

          <div className="c-chart-gauge">
            <GaugeChart range={[0, 150]} value={data.vb || 0} label="Voltaje Fase B" />
            <label className="label">{(data.vb || 0).toFixed(2)} VAC</label>
            <br />
            <label className="label">"VB"</label>
          </div>

          <div className="c-chart-gauge">
            <GaugeChart range={[0, 150]} value={data.vc || 0} label="Voltaje Fase C" />
            <label className="label">{(data.vc || 0).toFixed(2)} VAC</label>
            <br />
            <label className="label">"VC"</label>
          </div>

          <div className="c-chart-gauge">
            <GaugeChart range={[0, 220]} value={data.vab || 0} label="Voltaje Fase A-B" />
            <label className="label">{(data.vab || 0).toFixed(2)} VAC</label>
            <br />
            <label className="label">"VAB"</label>
          </div>

          <div className="c-chart-gauge">
            <GaugeChart range={[0, 220]} value={data.vbc || 0} label="Voltaje Fase B-C" />
            <label className="label">{(data.vbc || 0).toFixed(2)} VAC</label>
            <br />
            <label className="label">"VBC"</label>
          </div>

          <div className="c-chart-gauge">
            <GaugeChart range={[0, 220]} value={data.vac || 0} label="Voltaje Fase A-C" />
            <label className="label">{(data.vac || 0).toFixed(2)} VAC</label>
            <br />
            <label className="label">"VAC"</label>
          </div>
        </div>

        {/* Keymap */}
        <div>
          <Keymap />
        </div>

        {/* Heatmap */}
        <div>
          <Heatmap
            data={[
              { time: "2025-01-06T22:20:32", phase: "AN-BN", difference: 10 },
              { time: "2025-01-06T22:20:32", phase: "AN-CN", difference: 15 },
              { time: "2025-01-06T22:20:32", phase: "BN-CN", difference: 5 },
              { time: "2025-01-06T22:20:32", phase: "AB-BC", difference: 20 },
              { time: "2025-01-06T22:20:32", phase: "AC-BC", difference: 25 },
              { time: "2025-01-06T22:30:32", phase: "AN-BN", difference: 8 },
              { time: "2025-01-06T22:30:32", phase: "AN-CN", difference: 12 },
              { time: "2025-01-06T22:30:32", phase: "BN-CN", difference: 7 },
              { time: "2025-01-06T22:30:32", phase: "AB-BC", difference: 18 },
              { time: "2025-01-06T22:30:32", phase: "AC-BC", difference: 22 },
            ]}
          />
        </div>

        {/* Histograma */}
        <div>
    
        <h1>Consultas de Consumo Eléctrico</h1>
        <DateRangeForm />

        </div>
      </main>
    </div>
  );
};

export default App;
