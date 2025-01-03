# Proyecto: Conexión y Exploración de Nodos OPC UA

Este repositorio contiene un proyecto basado en Python que permite conectarse a un servidor OPC UA, explorar sus nodos y leer valores asociados. Es ideal para aplicaciones en automatización industrial, IoT y sistemas SCADA.

## Características
- Conexión a servidores OPC UA.
- Exploración de nodos y estructura jerárquica.
- Lectura de valores de nodos específicos.
- Compatible con múltiples entornos industriales.

## Requisitos
### Software
- Python 3.7 o superior.
- Servidor OPC UA (puedes usar [FreeOpcUa](https://github.com/FreeOpcUa/freeopcua) para pruebas).

### Bibliotecas de Python
Instala las dependencias ejecutando:
```bash
pip install -r requirements.txt
```
Contenido del archivo `requirements.txt`:
```
opcua
pandas
```

## Uso
### Conexión al servidor OPC UA
1. Configura la URL del servidor OPC UA en el archivo principal del proyecto:
   ```python
   server_url = "opc.tcp://192.168.8.89:4840"
   ```

2. Ejecuta el script para conectarte al servidor, explorar nodos y leer valores:
   ```bash
   python main.py
   ```

### Exploración de Nodos
El proyecto incluye funciones para:
- Listar hijos de un nodo.
- Obtener la clase de un nodo.

Ejemplo de salida:
```
Conectado al servidor OPC UA en opc.tcp://192.168.8.89:4840
Hijos del nodo ns=1;s=/HMI_DataProvider:
 - ns=1;s=/HMI_DataProvider/Tag1 (Tag1)
 - ns=1;s=/HMI_DataProvider/Adquision_datos_electricidad (Adquision_datos_electricidad)
```

### Lectura de Valores
El script lee valores de nodos del tipo *Variable*.
Ejemplo:
```
Nodo: ns=1;s=/HMI_DataProvider/Adquision_datos_electricidad/Consumo_electrico (Consumo_electrico) -> Valor: 123.45
```

## Estructura del Proyecto
```
├── main.py                # Script principal
├── requirements.txt       # Dependencias
├── README.md              # Documentación
├── opcua_nodes.csv        # Salida opcional con los nodos explorados
```

## Contribuciones
Las contribuciones son bienvenidas. Si encuentras un problema o tienes ideas para mejorar el proyecto, crea un **issue** o envía un **pull request**.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
