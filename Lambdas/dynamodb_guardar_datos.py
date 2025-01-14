import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

# Inicializar el cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('PowerMeterData')

def lambda_handler(event, context):
    try:
        # Log del evento recibido
        print(f"Evento recibido: {json.dumps(event)}")
        
        # Procesar el cuerpo de la solicitud
        body = event.get("body")
        if isinstance(body, str):
            body = json.loads(body)
        tags = body.get("tags", [])
        
        # Validar datos
        if not tags or not isinstance(tags, list):
            raise ValueError("El campo 'tags' debe ser una lista no vacía.")
        
        # Almacenar en DynamoDB
        for tag in tags:
            if "name" in tag and "value" in tag:
                # Convertir valores flotantes a Decimal
                item = {
                    "id": str(uuid.uuid4()),
                    "name": tag["name"],
                    "value": Decimal(str(tag["value"])) if isinstance(tag["value"], float) else tag["value"],
                    "timestamp": datetime.utcnow().isoformat()
                }
                table.put_item(Item=item)
            else:
                print(f"Datos inválidos ignorados: {tag}")
        
        # Respuesta exitosa
        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Datos almacenados correctamente", "tags": tags})
        }
    except Exception as e:
        # Manejo de errores
        print(f"Error interno: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Error interno del servidor"})
        }
