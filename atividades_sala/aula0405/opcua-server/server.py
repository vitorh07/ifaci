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

# 6. Variáveis (ns=2;i=2 até ns=2;i=5)
temperature = sensor.add_variable(idx, "Temperature", 0.0)  # ns=2;i=2
pressure    = sensor.add_variable(idx, "Pressure",    0.0)  # ns=2;i=3
running     = sensor.add_variable(idx, "Running",     False) # ns=2;i=4
humidity    = sensor.add_variable(idx, "Humidity",    0.0)  # ns=2;i=5

# 7. Permitir escrita externa
temperature.set_writable()
pressure.set_writable()
running.set_writable()
humidity.set_writable()

# 8. Subir servidor
server.start()
print("OPC-UA Server rodando em opc.tcp://0.0.0.0:4840 (sem segurança)")

try:
    while True:
        temp_value = round(20.0 + random.uniform(-2.0, 10.0), 2)  # 18°C ~ 30°C
        pres_value = round(1.0  + random.uniform(-0.2,  0.5), 2)  # 0.8 ~ 1.5 bar
        humi_value = round(40.0 + random.uniform(-5.0, 20.0), 2)  # 35% ~ 60%
        run_value  = random.choice([True, False])

        temperature.set_value(temp_value)
        pressure.set_value(pres_value)
        running.set_value(run_value)
        humidity.set_value(humi_value)

        print({
            "Temperatura": temp_value,
            "Pressao":     pres_value,
            "Umidade":     humi_value,
            "Status":      run_value,
        })

        time.sleep(1)

finally:
    server.stop()
