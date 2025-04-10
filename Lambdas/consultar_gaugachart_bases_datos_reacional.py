from decimal import Decimal  # Importa Decimal
from datetime import datetime, timedelta
import psycopg
import os
import json

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def lambda_handler(event, context):
    try:
        # Obtener los parámetros de fecha y rango
        # Mostrar todo el evento para asegurarse de que los parámetros estén en queryStringParameters
        print(f"Evento recibido: {json.dumps(event)}")  # Mostrar todo el evento
        query_params = event.get("queryStringParameters", {})
        print(f"Parámetros recibidos: {query_params}")  # Agregar para ver los parámetros

        start_date_str = query_params.get("start_date")
        end_date_str = query_params.get("end_date")

        # Validar las fechas recibidas
        if not start_date_str or not end_date_str:
            raise ValueError("Las fechas de inicio y fin son requeridas.")

        # Intentar convertir las fechas en formato ISO
        try:
            start_date = datetime.fromisoformat(start_date_str)
            end_date = datetime.fromisoformat(end_date_str)
        except ValueError:
            raise ValueError("El formato de las fechas es incorrecto. Use 'YYYY-MM-DDTHH:MM:SS'.")

        # Calcular la duración del rango en días
        delta_days = (end_date - start_date).days

        # Determinar el nivel de granularidad
        if delta_days == 0:  # Si la consulta es para un solo día
            group_by = "DATE_TRUNC('hour', fecha_hora)"
            interval = "hour"
        elif delta_days <= 7:  # Si la consulta es para más de 1 día pero menos de 1 semana
            group_by = "DATE(fecha_hora)"
            interval = "day"
        elif delta_days > 7 and delta_days <= 365:  # Si la consulta es para más de 1 semana pero menos de 1 año
            group_by = "DATE(fecha_hora)"
            interval = "day"
        else:  # Si la consulta es para más de 1 año
            group_by = "EXTRACT(YEAR FROM fecha_hora)"
            interval = "year"

        # Ajustar el final de la fecha si no está al final del minuto
        if end_date.second != 0 or end_date.microsecond != 0:
            end_date = end_date.replace(second=59, microsecond=999999)

        # Conectar a la base de datos
        db_host = os.getenv("DB_HOST")
        db_name = os.getenv("DB_NAME")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")
        db_port = os.getenv("DB_PORT", 5432)

        with psycopg.connect(
            host=db_host,
            dbname=db_name,
            user=db_user,
            password=db_password,
            port=db_port
        ) as conn:
            print("✅ Conexión exitosa a RDS.")
            with conn.cursor() as cur:
                # Consulta SQL dinámica para agregación según el intervalo
                sql = f"""
                    SELECT {group_by} AS period, AVG(consumo) AS promedio_consumo
                    FROM consumo_electrico
                    WHERE fecha_hora BETWEEN %s AND %s
                    GROUP BY period
                    ORDER BY period;
                """

                cur.execute(sql, (start_date, end_date))
                results = cur.fetchall()

                # Formatear los resultados para que estén más claros
                data = [{"periodo": row[0], "promedio_consumo": row[1]} for row in results]
                
                return {
                    "statusCode": 200,
                    "body": json.dumps(data, cls=DecimalEncoder)
                }

    except Exception as e:
        print(f"❌ Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e),
            "received_params": {
                    "start_date": start_date_str,
                    "end_date": end_date_str
                }
            
            
            }),

        }
