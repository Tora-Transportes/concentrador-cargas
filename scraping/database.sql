CREATE SEQUENCE "seq_con_cargas_portal";
CREATE TABLE "con_cargas_portal" (
    "id" VARCHAR(64) NOT NULL PRIMARY KEY,
    "documento_transporte" INTEGER NOT NULL,
    "unidade_medida_etapa" VARCHAR(20),
    "peso_etapa" DECIMAL(10,3),
    "unidade_medida_documento" VARCHAR(20),
    "peso_documento" DECIMAL(10,3),
    "produto" VARCHAR(200),
    "pool" VARCHAR(200),
    "origem" VARCHAR(200),
    "municipio_origem" VARCHAR(200),
    "uf_origem" VARCHAR(200),
    "destino" VARCHAR(200),
    "municipio_destino" VARCHAR(200),
    "uf_destino" VARCHAR(200),
    "inicio_chegada_planejada" VARCHAR(10),
    "final_chegada_planejada" VARCHAR(10),
    "cnpj_fornecedor" VARCHAR(14)
);