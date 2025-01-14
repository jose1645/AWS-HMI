export const fetchTags = async () => {
    try {
      const response = await fetch('https://tu-api-endpoint.com/datos');
      if (!response.ok) {
        throw new Error('Error al obtener datos de la API');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en el servicio:', error);
      return [];
    }
  };
  