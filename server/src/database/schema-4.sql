alter table "con_coordenadas_veiculos" add (
    "distancia_ate_destino" FLOAT DEFAULT NULL,
    "tempo_ate_destino" FLOAT DEFAULT NULL
);


insert into "con_localizacoes" ("id", "cidade", "estado", "pais", "lat", "lng", "sigla_pais", "sigla_pais_extendida", "capital", "sigla_estado") values 
(899, 'VARGEM GRANDE DO SUL', 'SAO PAULO', 'BRASIL', 0, 0, 'BR', 'BRA', null, 'SP');

insert into "con_localizacoes" ("id", "cidade", "estado", "pais", "lat", "lng", "sigla_pais", "sigla_pais_extendida", "capital", "sigla_estado") values 
(999, 'BRACO DO TROMBUDO', 'SANTA CATARINA', 'BRASIL', 0, 0, 'BR', 'BRA', null, 'SC');


update "con_localizacoes" set "lat" = NULL, "lng" = NULL;
alter table "con_localizacoes" modify (
    "lat" NUMBER,
    "lng" NUMBER
);
alter table "con_localizacoes" rename column "sigla_pais_extendida" to "sigla_pais_estendida";
Alter table "con_localizacoes" drop primary key;


create table "con_veiculos_distancia" (
    "placa" VARCHAR(10) primary key,
    "tempo_ate_destino" FLOAT DEFAULT NULL,
    "distancia_ate_destino" FLOAT DEFAULT NULL,
    "data_atualizacao" DATE DEFAULT NULL
);

alter table "con_coordenadas_veiculos" DROP COLUMN "tempo_ate_destino";
alter table "con_coordenadas_veiculos" DROP COLUMN "distancia_ate_destino";

alter table "con_veiculos_distancia" rename column "placa" TO "fk_placa";


create table "con_cargas_logs_aprovacao" (
    "fk_carga" INTEGER PRIMARY KEY,
    "segundos" INTEGER DEFAULT NULL,
    "fk_usuario" VARCHAR(100) not null,
    "data_criacao" DATE NOT NULL
);


update "con_situacoes_cargas" set "descricao" = 'Documento emitido' where "id" = 6;

insert into "con_localizacoes" ("id", "cidade", "estado", "pais", "lat", "lng", "sigla_pais", "sigla_pais_estendida", "capital", "sigla_estado") values
(2, 'SENADOR CANEDO', 'GOIAS', 'BRASIL', null, null, 'BR', 'BRA', null, 'GO');

