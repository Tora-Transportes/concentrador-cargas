create table "con_cargas" (
    "id" varchar(20) not null primary key,
    "cliente" varchar(300) not null,
    "e_lote" integer not null,
    "origem_carga" varchar(20) not null,
    "destino_carga" varchar(20) not null,
    "data_entrega" date not null,
    "data_coleta" date not null,
    "tipo_carga" varchar(20) not null,
    "quantidade" decimal(10,2) not null,
    "unidade_medida" varchar(10) not null,
    "responsavel_cadastro" varchar(300) not null,
    "canal_comunicacao" varchar(20) not null,
    "observacao"  varchar(4000),
    "data_cadastro" timestamp not null,
    "data_atualizacao" timestamp not null,
    "ativo" integer default 1 not null,
    "acessorios_requisitos" varchar(4000),
    "usuario" varchar(4000) not null
);


create table "con_usuarios" (
    "oid" varchar(100) not null primary key,
    "nome" varchar(300) not null,
    "email" varchar(300) not null
);

create table "con_usuarios_permissoes" (
    "fk_usuario" varchar(100) not null,
    "permissao" varchar(100) not null,

    CONSTRAINT fk_usuarios_permissoes
    FOREIGN KEY ("fk_usuario")
    REFERENCES "con_usuarios"("oid")
);

create sequence "seq_con_produtos";
create table "con_produtos" (
    "id" integer primary key,
    "nome" varchar(300) not null unique,
    "usuario" varchar(300) not null
);

alter table "con_cargas" modify "origem_carga" varchar(200);
alter table "con_cargas" modify "destino_carga" varchar(200);


-- CARGA DE DADOS NA TABELA DE PRODUTOS
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ABRASIVOS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ADESIVO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ARAME', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ARGAMASSA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BARRA CHATA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BARRO DE ACO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BARRA LISA REDONDA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BARRA TREFILADA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BEBIDA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BENTONITA SODICA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BERCO METALICO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BOBINA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BOMBONA DE PLASTICO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'BORRACHA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CABO DE ACO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CAL', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CANTONEIRA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CHAPA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CINTA ADHESIVAS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CONCETRADO DE CHUMBO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CONCRETO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CONTAINER', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CONTAINER - PECAS AUTOMOTIVAS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CONTAINER DE PLASTICO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CONTAINER VAZIO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'COQUE', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CORDOALHA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'COSMETICOS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CRIOLITA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'CROMITA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ELETRODO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ELETRODOMESTICOS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'EMBALAGENS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ENVASES', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ESPACADOR', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'FERRO FOSFORO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'FERRO GUSA NODULAR', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'FERRO NIOBIO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'FERRO SILICO MANGANESE GRANULADO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'FIO MAQUINA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'FUNGICIDA A BASE DE OLEO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'HIDROXIDO DE POTASSIO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'VERGALHAO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'VIDRO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'VINHO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TUBOS PNEUMATICOS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TUBOS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TUBO DE ACO COM COSTURA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TUBO DE ACO SEM COSTURA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TRELICA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TRANSFORMADOR', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TIJOLO REFRATARIO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TELHA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TELA DE ACO SOLDADA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TELA DE ACO ROLO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'TARUGO DE ACO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'SUCATA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'SILICATO DE SODIO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'SIDERURGICOS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'SACOS (BIG BAG) VAZIOS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'ROLO DE ACO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'REFRATARIO DE ALTO-FORNO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'REAGE QUIMICO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PREGO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'POLIETILENO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'POLIAMIDA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PO PRETO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PO DE FERRO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PO DE BORRACHA', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PO DE ALUMINIO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PERFIL', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PECAS DE FIXACAO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PECAS AUTOMATIVAS', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'PALETIZADO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'MINERIO DE FERRO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'LINGOTE DE ZINCO', 'Andre Alves Leocadio');
INSERT INTO "con_produtos" ("id", "nome", "usuario") values ("seq_con_produtos".NEXTVAL, 'LIGOTE DE ALUMINIO', 'Andre Alves Leocadio');


ALTER TABLE "con_produtos" ADD ( "ativo" INTEGER DEFAULT 1 NOT NULL);
ALTER TABLE "con_produtos" ADD ( "observacao" VARCHAR(4000));

ALTER TABLE "con_cargas" ADD ("informacoes_restritivas" VARCHAR(4000));

ALTER TABLE "con_cargas" ADD ("janela_coleta" VARCHAR(5), "janela_entrega" VARCHAR(5));

CREATE TABLE "con_logs" (
    "timestamp" varchar(20) not null,
    "token" VARCHAR(4000) not null,
    "oid" VARCHAR(64) not null,
    "url" VARCHAR(4000) not null,
    "corpo" VARCHAR(4000) not null,
    "metodo" VARCHAR(10) not null
);