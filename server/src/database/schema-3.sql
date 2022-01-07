create table "con_coordenadas_veiculos" (
    "mct" INTEGER primary key,
    "placa" VARCHAR(10),
    "lat" NUMBER,
    "lon" NUMBER,
    "cidade_atual" VARCHAR(100),
    "codigo_veiculo" INTEGER,
    "ultima_viagem_origem" VARCHAR(100),
    "ultima_viagem_destino" VARCHAR(100)
);

alter table "con_coordenadas_veiculos" add (
    "documento" varchar(30),
    "tipo_documento" varchar(5)
);