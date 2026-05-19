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

# 6. Variáveis
temperature = sensor.add_variable(idx, "Temperature", 0.0)
pressure = sensor.add_variable(idx, "Pressure", 0.0)
running = sensor.add_variable(idx, "Running", False)

# 7. Permitir escrita externa
temperature.set_writable()
pressure.set_writable()
running.set_writable()

# 8. Subir servidor
server.start()
print("OPC-UA Server rodando em opc.tcp://0.0.0.0:4840 (sem segurança)")

try:
    while True:
        # Simulação de processo industrial com valores aleatórios
        temp_value = round(20.0 + random.uniform(-2.0, 10.0), 2)   # 18°C ~ 30°C
        pres_value = round(1.0 + random.uniform(-0.2, 0.5), 2)     # 0.8 ~ 1.5 bar
        run_value  = random.choice([True, False])                   # liga/desliga aleatório

        temperature.set_value(temp_value)
        pressure.set_value(pres_value)
        running.set_value(run_value)

        output = {
            "Temperatura" : temp_value,
            "Pressão"     : pres_value,
            "Status"      : run_value,
        }

        print(output)

        time.sleep(1)

finally:
    server.stop()
