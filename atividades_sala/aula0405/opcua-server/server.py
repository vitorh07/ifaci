from opcua import Server
from opcua.ua import SecurityPolicyType
import time
import random

# 1. Criar servidor
server = Server()

# 2. Endpoint
server.set_endpoint("opc.tcp://0.0.0.0:4840")

# 3. Desabilitar segurança — aceita conexão anônima sem certificado
server.set_security_policy([SecurityPolicyType.NoSecurity])

# 4. Namespace
uri = "http://ads.freeopcua.server"
idx = server.register_namespace(uri)

# 5. Objeto principal
objects = server.get_objects_node()
sensor = objects.add_object(idx, "Sensor")

# 6. Variáveis alinhadas com o objeto esperado pela API POST /newData
temperatura     = sensor.add_variable(idx, "temperatura",     0.0)
pressao         = sensor.add_variable(idx, "pressao",         0.0)
umidade         = sensor.add_variable(idx, "umidade",         0.0)
sensor_presenca = sensor.add_variable(idx, "sensor_presenca", False)
trava_seguranca = sensor.add_variable(idx, "trava_seguranca", False)

# 7. Permitir escrita externa
temperatura.set_writable()
pressao.set_writable()
umidade.set_writable()
sensor_presenca.set_writable()
trava_seguranca.set_writable()

# 8. Subir servidor
server.start()
print("OPC-UA Server rodando em opc.tcp://0.0.0.0:4840 (sem segurança)")

try:
    while True:
        temp_value     = round(20.0 + random.uniform(-2.0, 10.0), 2)   # 18°C ~ 30°C
        pres_value     = round(1.0  + random.uniform(-0.2,  0.5), 2)   # 0.8 ~ 1.5 bar
        humi_value     = round(40.0 + random.uniform(-5.0, 20.0), 2)   # 35% ~ 60%
        presenca_value = random.choice([True, False])
        trava_value    = random.choice([True, False])

        temperatura.set_value(temp_value)
        pressao.set_value(pres_value)
        umidade.set_value(humi_value)
        sensor_presenca.set_value(presenca_value)
        trava_seguranca.set_value(trava_value)

        print({
            "temperatura":     temp_value,
            "pressao":         pres_value,
            "umidade":         humi_value,
            "sensor_presenca": presenca_value,
            "trava_seguranca": trava_value,
        })

        time.sleep(1)

finally:
    server.stop()
