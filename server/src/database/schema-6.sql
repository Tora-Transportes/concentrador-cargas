create table "con_locais_carga" (
    "fk_carga" INTEGER NOT NULL,
    "posicao" INTEGER NOT NULL,
    "descricao" VARCHAR2(2048) NOT NULL,
    PRIMARY KEY ("fk_carga", "posicao")
);

INSERT INTO "con_locais_carga" ("fk_carga", "posicao", "descricao") SELECT "id", 1, "local_coleta" from "con_cargas" where "local_coleta" is not null;
INSERT INTO "con_locais_carga" ("fk_carga", "posicao", "descricao") SELECT "id", 2, "local_entrega" from "con_cargas" where "local_entrega" is not null;


-- NEEDS TEST
alter table "con_cargas" drop column "local_coleta";
alter table "con_cargas" drop column "local_entrega";




create sequence "seq_con_prd_justificativas";
create table "con_producao_justificativas" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "codigo_veiculo" INTEGER NOT NULL,
    "conteudo" VARCHAR2(2048) NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_final" DATE NOT NULL
);


create table "con_credenciais" (
    "user" VARCHAR2(500) NOT NULL,
    "portal" VARCHAR2(500) NOT NULL,
    "errored" INTEGER DEFAULT 0 NOT NULL,
    "successful_attempts" INTEGER DEFAULT 0 NOT NULL,
    "password" VARCHAR2(2048)
);
