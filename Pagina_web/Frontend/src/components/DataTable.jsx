import React, { useEffect, useState } from 'react';
import '../styles/table.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos simulados de la API
  const simulatedData = {
    tags: [
      { id: '58f6cdcf-697b-4684-b4e5-e5b45c5da74f', name: 'CB', timestamp: '2025-01-06T22:20:32.310406', value: 1.82 },
      { id: 'b0aafbaf-7f05-40aa-8c0c-89443583592d', name: 'CA', timestamp: '2025-01-06T22:05:59.841361', value: 1.36 },
      { id: '1be8e94d-d9cb-49c8-bf58-4c7920227fe4', name: 'VAB', timestamp: '2025-01-06T22:05:59.761374', value: 235.899 },
      { id: '6475a00a-4b0f-48e7-a297-19e108620cde', name: 'Voltaje', timestamp: '2025-01-06T21:47:20.570605', value: 220 },
      { id: '3c2d1e33-f7f8-42d0-b859-9089cb74f9fc', name: 'VAB', timestamp: '2025-01-06T22:20:32.190225', value: 234.961 },
      { id: 'dc892bb8-8704-4e71-8ba0-173d4e679189', name: 'VBC', timestamp: '2025-01-06T22:05:59.781381', value: 238.669 },
      { id: '46804d68-9ef1-45ba-bf8a-5465809b3cba', name: 'Voltaje', timestamp: '2025-01-06T21:47:32.404012', value: 220 },
      { id: '99bcb15b-eba8-45fe-86ef-f328f02caca3', name: 'CA', timestamp: '2025-01-06T22:20:32.290234', value: 1.82 },
      { id: '8569dcc6-0c3f-436f-9467-435ad0f4a317', name: 'CC', timestamp: '2025-01-06T22:20:32.350243', value: 0 },
      { id: 'bd3dd393-df46-4cac-96b7-063748e123de', name: 'VB', timestamp: '2025-01-06T22:20:32.130240', value: 134.724 },
      { id: 'a2cb50eb-73f6-480d-aedf-e5f1ed732b8e', name: 'Consumo_electrico', timestamp: '2025-01-06T22:20:32.078139', value: 1022.936 },
      { id: '52be87d4-b583-4f73-b341-9fedf7b60eb7', name: 'Voltaje', timestamp: '2025-01-06T21:53:00.649629', value: 220 },
      { id: '54836ee3-e7c7-4673-91bc-298c2c57523c', name: 'VBC', timestamp: '2025-01-06T22:20:32.230270', value: 237.646 },
      { id: '4066e688-4d39-4c14-87a3-81952540a351', name: 'Consumo_electrico', timestamp: '2025-01-06T22:05:59.090457', value: 1022.936 },
      { id: 'dd82484f-38bf-4267-b971-6a054d504975', name: 'CB', timestamp: '2025-01-06T22:05:59.881361', value: 1.36 },
      { id: '75e6bcad-9d85-44e3-a373-6ac6f2df1251', name: 'Voltaje', timestamp: '2025-01-06T22:10:13.984509', value: 220 },
      { id: '6db7daed-aa25-421b-b557-835f7586a984', name: 'VAC', timestamp: '2025-01-06T22:05:59.821351', value: 238.906 },
      { id: '65907d7d-85ad-477f-91f8-d5c52aec2e06', name: 'VB', timestamp: '2025-01-06T22:05:59.701449', value: 135.292 },
      { id: 'fcf5e27d-85b0-46a5-bd0c-2e375d3a971d', name: 'CC', timestamp: '2025-01-06T22:05:59.921342', value: 0 },
      { id: '149ffe07-bbd0-42ea-80ad-010cb38961c9', name: 'VC', timestamp: '2025-01-06T22:05:59.721368', value: 139.496 },
      { id: 'd62ff5e1-92ac-4472-8e02-3f436a62798b', name: 'VAC', timestamp: '2025-01-06T22:20:32.250287', value: 238.194 },
      { id: '78828d02-0509-453b-afc8-7595d4c480ce', name: 'Voltaje', timestamp: '2025-01-06T22:19:10.481040', value: 220 },
      { id: 'fd942674-f27a-4a78-b653-d0121b9e47cc', name: 'VA', timestamp: '2025-01-06T22:20:32.090342', value: 136.785 },
      { id: '4d3abaf4-06fb-41e6-83aa-51fd850eaa5f', name: 'VA', timestamp: '2025-01-06T22:05:59.661935', value: 137.208 },
      { id: '5f13542c-8c23-4a7c-8a04-d99cefbbe225', name: 'VC', timestamp: '2025-01-06T22:20:32.150266', value: 138.883 },
    ],
  };

  // Simulación de la función para obtener datos
  const fetchData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(simulatedData.tags);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="data-table">
      <h2>Datos del Sistema</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Timestamp</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.timestamp}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
