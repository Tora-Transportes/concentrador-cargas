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




