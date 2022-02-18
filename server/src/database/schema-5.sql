alter table "con_coordenadas_veiculos" add (
    "tipo_cavalo" VARCHAR(512) DEFAULT NULL,
    "tipo_carreta" VARCHAR(512) DEFAULT NULL,
    "telefone_motorista" VARCHAR(1024) DEFAULT NULL,
    "nome_motorista" VARCHAR(2048) DEFAULT NULL
);

create table "con_dados_coordenadas" (
    "fk_placa" VARCHAR(10) PRIMARY KEY,
    "observacao" VARCHAR(200) DEFAULT NULL,
    "usuario_observacao" VARCHAR(2048) DEFAULT NULL,
    "ultimo_documento" VARCHAR(100) DEFAULT NULL
);

