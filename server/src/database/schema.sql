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
