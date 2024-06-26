import database, { mssqlPPO, mssqlPPOView } from "../../database";
import IAvaliacao from "../../models/IAvaliacao";
import IAtributo from "../../models/IAtributo";
import AppError from "../../models/AppError";
import { encrypt } from "../../Utils/utlis";

interface IPPORepository {
  avaliacoes(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<IAvaliacao[] | undefined>;
  exporta_protheus(
    mes: string,
    ano: string,
    cpf: string,
    grupo_id: string
  ): Promise<any | undefined>;
  distancia(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<any | undefined>;
  infracoes(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<any | undefined>;
  interjornada(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<any | undefined>;
  atributos(): Promise<IAtributo[] | undefined>;
  resultado_ppo(
    cpf: string,
    mes: string,
    ano: string
  ): Promise<IAtributo[] | undefined>;
  relatorio_motoristas(
    query: Record<string, any>,
    page?: number,
    pageSize?: number
  ): Promise<any | undefined>;
  motorista_by_grupo(cpf: string, permissoes: string): Promise<any | undefined>;
}
const isValid = (value: string | null | undefined) =>
  !["", null, undefined, "null", "undefined"].includes(value);

export class PPORepository implements IPPORepository {
  async exporta_protheus(
    mes: string,
    ano: string,
    cpf: string,
    grupo_id: string
  ): Promise<any | undefined> {
    let filtro = "";
    if (cpf != "undefined") {
      filtro = filtro + ` AND r.cpf = '${cpf}' `;
    }
    if (grupo_id != "undefined") {
      filtro = filtro + ` AND g.id = ${grupo_id} `;
    }

    const sql = `
    SELECT 
       x.filial
       ,x.matricula
       ,x.cod_verba
       ,x.total
       ,CONCAT(x.filial,x.matricula,x.cod_verba,x.total) as exporta_final
    FROM (
    SELECT 
      REPLICATE('0', 2 -LEN(g.cod_filial))+RTRIM(g.cod_filial) as filial,
      REPLICATE('0', 6 -LEN(r.matricula))+RTRIM(r.matricula) as matricula,
      REPLICATE('0', 3 -LEN(p.cod_verba))+RTRIM(p.cod_verba) as cod_verba,
      REPLICATE('0', 9 -LEN(CAST( FORMAT(SUM(CAST(r.premio AS FLOAT)), '0.00') AS varchar)))+RTRIM(CAST( FORMAT(SUM(CAST(r.premio AS FLOAT)), '0.00') AS varchar)) as total
    FROM dbo.ppo_resultado r
      INNER JOIN dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
      INNER JOIN dbo.ppo_grupos g on g.id=pg.grupo_id
      INNER JOIN dbo.ppo_parametros p on p.id = pg.parametro_id
      WHERE apto = 1
      AND r.mes_avaliacao = '${mes}'
      AND r.ano_avaliacao = '${ano}'
      ${filtro}
      GROUP BY r.matricula,g.cod_filial,p.cod_verba
    UNION
    SELECT 
      REPLICATE('0', 2 -LEN(g.cod_filial))+RTRIM(g.cod_filial) as filial,
      REPLICATE('0', 6 -LEN(r.matricula))+RTRIM(r.matricula) as matricula,
      REPLICATE('0', 3 -LEN(p.cod_verba))+RTRIM(p.cod_verba) as cod_verba,
      REPLICATE('0', 9 -LEN(CAST( FORMAT(SUM(CAST(r.premio AS FLOAT)), '0.00') AS varchar)))+RTRIM(CAST( FORMAT(SUM(CAST(r.premio AS FLOAT)), '0.00') AS varchar)) AS total
    FROM dbo.ppo_resultado r
    INNER JOIN dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
    INNER JOIN dbo.ppo_grupos g on g.id=pg.grupo_id
    INNER JOIN dbo.ppo_parametros p on p.id = pg.parametro_id
    WHERE ppo_cancelado = 1
    AND mes_avaliacao = '${mes}'
    AND ano_avaliacao = '${ano}'
    ${filtro}
    GROUP BY r.matricula,g.cod_filial,p.cod_verba
    ) X
  `;
    const exporta = await mssqlPPO.raw(sql);

    return exporta;
  }

  async avaliacoes(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<IAvaliacao[] | undefined> {
    return await mssqlPPO.raw(`
    select classificacao
          ,nome_motorista
          ,cpf
          ,pontuacao
          ,periodo_inicial
          ,periodo_final 
          from ppo_rank_avaliacao_fleet
    where cpf = '${cpf}' 
    AND periodo_inicial BETWEEN '${data_ini}' AND '${data_fim}'
    AND periodo_final BETWEEN '${data_ini}' AND '${data_fim}'
    `);
  }
  async distancia(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<any | undefined> {
    const distancia = await mssqlPPO.raw(`
    SELECT
        SUBSTRING(motorista, 1, CHARINDEX('-', motorista) - 1) AS nome,
        SUBSTRING(motorista, CHARINDEX('-', motorista) + 1, LEN(motorista)) AS cpf,
        veiculo,
        CONCAT(distancia,' KM') as distancia
    FROM
        [dbo].[ppo_distancia_percorrida_fleet]
    WHERE
        motorista LIKE '%${cpf}%'
        AND data_ini BETWEEN '${data_ini}' AND '${data_fim}'
        AND data_fim BETWEEN '${data_ini}' AND '${data_fim}'
    ORDER BY
    veiculo;
    `);
    return distancia;
  }
  async infracoes(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<any | undefined> {
    const dados_motorista = await mssqlPPOView.raw(`
    SELECT  
      RTRIM(LTRIM(RA_NOME)) as nome
      ,RA_CIC as cpf
      ,RTRIM(LTRIM(RA_MAT)) as matricula
      FROM dbo.VW_DADO_MOTORISTA_PPO
      WHERE RA_CIC = '${cpf}'
    `);
    if (dados_motorista.length == 0) {
      return [];
    } else {
      const sql = `
      SELECT 
      SUBSTRING(motorista, 1, CHARINDEX('-', motorista + '-') - 1) AS nome,
      SUBSTRING(motorista, CHARINDEX('-', motorista) + 2, 
              CASE WHEN CHARINDEX('-', motorista) > 0 THEN LEN(motorista) - CHARINDEX('-', motorista) 
                   ELSE LEN(motorista) END) AS matricula,
      veiculo,
      CONCAT(velocidadekmh,' KM') as velocidade,
      tipo_evento
      FROM [dbo].[ppo_sascar_velocidade]
      WHERE velocidadekmh > '87.0' 
      AND CONVERT(date,data,105) BETWEEN '${data_ini}' AND '${data_fim}'
      AND motorista <> 'Sem Motorista'
      AND SUBSTRING(motorista, 1, CHARINDEX('-', motorista + '-') - 1) LIKE '%${dados_motorista[0]["nome"]}%'
      AND SUBSTRING(motorista, CHARINDEX('-', motorista) + 2, 
                  CASE WHEN CHARINDEX('-', motorista) > 0 THEN LEN(motorista) - CHARINDEX('-', motorista) 
                       ELSE LEN(motorista) END) LIKE '%${dados_motorista[0]["matricula"]}%'
      `;
      const infracoes = await mssqlPPO.raw(sql);
      return infracoes;
    }
  }

  async interjornada(
    cpf: string,
    data_ini: string,
    data_fim: string
  ): Promise<any | undefined> {
    const interjornadas = await mssqlPPO.raw(`
      SELECT [NomeMotorista] as nome
        ,[cpf]
        ,[Data] as data
        ,[JornadaNormal] as jornada_normal
        ,[JornadaDiaria] as jornada_diaria
        ,[Interjornada] as interjornada
      FROM [dbo].[ppo_interjornada]
      WHERE Data BETWEEN '${data_ini}' AND '${data_fim}'
      AND cpf LIKE '%${cpf}%'`);
    return interjornadas;
  }

  async atributos(): Promise<any | undefined> {
    const atributos = await mssqlPPO.raw(`
    SELECT 
    pr.id as id_rotulo,
    CASE WHEN TABELAS.TABLE_SCHEMA IS NULL THEN 'dbo' ELSE TABELAS.TABLE_SCHEMA END AS schemas,
    CASE WHEN TABELAS.TABLE_NAME  IS NULL THEN pr.tabela ELSE TABELAS.TABLE_NAME END AS tabela,
    CASE WHEN COLUNAS.COLUMN_NAME  IS NULL THEN pr.campo ELSE COLUNAS.COLUMN_NAME END AS coluna,
    pr.rotulo as rotulo
    FROM INFORMATION_SCHEMA.COLUMNS AS COLUNAS
    INNER JOIN INFORMATION_SCHEMA.TABLES  AS TABELAS ON TABELAS.TABLE_NAME = COLUNAS.TABLE_NAME
    RIGHT JOIN [dbo].[ppo_de_para_rotulo] AS pr ON pr.tabela = CONCAT ( TABELAS.TABLE_SCHEMA, '.',TABELAS.TABLE_NAME) and pr.campo = COLUNAS.COLUMN_NAME  
    `);

    const tabelasAgrupadas: any = [];

    atributos.forEach(
      (objeto: {
        id_rotulo: number;
        schemas: string;
        tabela: string;
        coluna: string;
        rotulo: string;
      }) => {
        tabelasAgrupadas.push({
          id_rotulo: objeto.id_rotulo,
          tabela: `${objeto.schemas}.${objeto.tabela}`,
          coluna: objeto.coluna,
          rotulo: objeto.rotulo,
        });
      }
    );
    return tabelasAgrupadas;
  }

  async demonstrativos(filter: Record<string, any>): Promise<any | undefined> {
    let clausula = "";

    for (const i in filter) {
      if (filter[i] !== undefined && filter[i] !== null) {
        if (i != "assinado" && i != "permissoes") {
          clausula = clausula + ` AND r.${i} LIKE '%${filter[i]}%'`;
        } else if (i == "permissoes") {
          const position = filter[i].search("TODAS"); // se tiver essa permissão anula Filtro
          if (position == -1) {
            clausula = clausula + ` AND g.filial IN(${filter[i]})`;
          }
        } else {
          if (filter[i] != "undefined" || filter[i] != "") {
            if (filter[i] == "1") {
              clausula = clausula + "AND c.file_link_signed IS NOT NULL";
            } else {
              clausula = clausula + "AND c.file_link_signed IS NULL";
            }
          }
        }
      }
    }

    const query = ` 
    SELECT DISTINCT r.nome_motorista as nome
    ,r.cpf
    ,r.mes_avaliacao
    ,r.ano_avaliacao 
	  ,c.file_link_signed
    ,g.filial
    FROM dbo.ppo_resultado r
    inner join dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
    inner join dbo.ppo_parametros p on p.id =  pg.parametro_id
    inner join dbo.ppo_grupos g on g.id = pg.grupo_id
	  left join ASSINADOR_DIGITAL.DBO.controle c on  CONCAT(
        SUBSTRING(c.cpf, 1, 3), 
        '.', 
        SUBSTRING(c.cpf, 4, 3), 
        '.', 
        SUBSTRING(c.cpf, 7, 3), 
        '-', 
        SUBSTRING(c.cpf, 10, 2)
    ) = r.cpf and  c.mes = r.mes_avaliacao and  c.ano = r.ano_avaliacao 
    WHERE 1=1
    ${clausula}
  `;

    const data = await mssqlPPO.raw(query);

    if (data.length == 0) {
      throw new AppError("Sem dados de demonstrativo", 400);
    }

    return data;
  }

  async resultado_ppo(
    cpf: string,
    mes: string,
    ano: string
  ): Promise<any | undefined> {
    const data_hash = await mssqlPPO.raw(`
    SELECT 
    CONCAT( r.cpf,'|',
    RTRIM(LTRIM(r.matricula)),'|',
    g.nome,'|',  g.empresa,'|',
    sum(cast(r.premio as float)),'|',
	  r.mes_avaliacao,'|',r.ano_avaliacao) as hash
    FROM 
    dbo.ppo_resultado r
    INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
    INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
    INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
    WHERE  r.cpf = '${cpf}'
    AND r.mes_avaliacao = '${mes}'
    AND r.ano_avaliacao = '${ano}'
    GROUP BY 
    r.cpf,r.matricula,g.nome, g.empresa, r.mes_avaliacao,
    r.ano_avaliacao;
    `);

    const total = await mssqlPPO.raw(`
      SELECT 'R$ '+CONVERT(VARCHAR, CAST(SUM(CAST(premio as float)) AS MONEY), 1) as valor FROM dbo.ppo_resultado
      WHERE cpf = '${cpf}'
      and apto = 1
      AND mes_avaliacao = '${mes}'
      AND ano_avaliacao = '${ano}'
      `);
    const valores = await mssqlPPO.raw(` 
    SELECT 
    DISTINCT
      x.nome,
      CASE WHEN  x.dado_verificado is NULL THEN 'Sem informação' ELSE x.dado_verificado END AS dado_verificado,
      CASE WHEN x.ADICIONAL=1 and x.apto=0 THEN 'R$ 0.00' ELSE x.valor END as valor
      FROM
      (
      SELECT 
         p.nome,
         ADICIONAL = case when p.nome = 'INFRAÇÃO VELOCIDADE' AND TRY_CAST(r.dado_verificado AS INT) > 0 THEN  1
                   when p.nome = 'INFRAÇÃO DE INTERJORNADA' AND TRY_CAST(r.dado_verificado AS INT) > 0 THEN  1
                ELSE 0
                END ,
      ADICIONAL_AVAL = case when p.nome = 'AVALIAÇÃO' AND r.dado_verificado IS NULL THEN  1
                   when p.nome = 'AVALIAÇÃO' AND r.dado_verificado IS NULL THEN  1
                ELSE 0
                END ,
	  ADICIONAL_KM = case when p.nome = 'KM' AND r.dado_verificado IS NULL THEN  1
                   when p.nome = 'KM' AND r.dado_verificado IS NULL THEN  1
                ELSE 0
                END ,
         r.dado_verificado,
       CASE WHEN r.dado_verificado is null THEN 'R$ 0.00' ELSE 'R$ '+CONVERT(VARCHAR, CAST(r.premio AS MONEY), 1) END AS valor,
         apto
         FROM dbo.ppo_resultado r
            inner join dbo.ppo_parametros_grupo pg on pg.id = r.parametro_grupo_id
            join dbo.ppo_parametros p on p.id =  pg.parametro_id
            WHERE r.cpf = '${cpf}'
            AND r.mes_avaliacao = '${mes}'
            AND r.ano_avaliacao = '${ano}'
          ) X
          WHERE ( x.ADICIONAL = 1 or X.apto = 1 or x.ADICIONAL_AVAL = 1 or x.ADICIONAL_KM=1)
    `);

    const dados_motorista = await mssqlPPO.raw(` 
    SELECT DISTINCT 
    r.nome_motorista AS nome,
    r.cpf,
    r.matricula,
    CASE 
        WHEN r.ppo_cancelado = 1 THEN 'Sim' 
        ELSE 'Não' 
    END AS cancelado,
    CASE 
        WHEN r.ppo_cancelado = 1 THEN 
            CASE 
                WHEN r.dado_verificado IS NULL THEN r.observacao
                ELSE r.observacao + ' | ' + r.dado_verificado + ' KM' 
            END
        ELSE 
            CASE 
                WHEN r.observacao IS NOT NULL THEN r.observacao 
                ELSE 'Sem Observação' 
            END 
    END AS observacao,
    CONCAT(r.mes_avaliacao, '/', r.ano_avaliacao) AS mes_ano
FROM 
    dbo.ppo_resultado r
INNER JOIN 
    dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
JOIN 
    dbo.ppo_parametros p ON p.id = pg.parametro_id
    WHERE r.cpf = '${cpf}'
    AND r.mes_avaliacao = '${mes}'
    AND r.ano_avaliacao = '${ano}'
  `);
    if (dados_motorista.length == 0) {
      throw new AppError("Sem dados para gerar demonstrativo", 400);
    }
    const hash = encrypt(data_hash[0]["hash"]);

    const update_hash = await mssqlPPO("dbo.ppo_resultado") //update hash
      .update({ hash: hash })
      .where("cpf", cpf)
      .andWhere("mes_avaliacao", mes)
      .andWhere("ano_avaliacao", ano);

    return {
      dados_motorista: dados_motorista[0],
      valores: valores,
      total: total[0]["valor"] ? total[0]["valor"] : "R$ 0.00",
      hash: hash,
    };
  }

  async relatorio_motoristas(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    let filtro = "";
    let filtroTot = "";

    if (isValid(query?.cpf)) {
      filtro = filtro + ` AND cpf LIKE '%${query.cpf}%'`;
      filtroTot = filtroTot + ` AND r.cpf LIKE '%${query.cpf}%'`;
    }
    if (isValid(query?.matricula)) {
      filtro = filtro + ` AND matricula LIKE '%${query.matricula}%'`;
      filtroTot = filtroTot + ` AND r.matricula LIKE '%${query.matricula}%'`;
    }
    if (isValid(query?.nome_motorista)) {
      filtro = filtro + ` AND nome_motorista LIKE '%${query.nome_motorista}%'`;
      filtroTot =
        filtroTot + ` AND r.nome_motorista LIKE '%${query.nome_motorista}%'`;
    }
    if (isValid(query?.mes_avaliacao)) {
      filtro = filtro + ` AND mes_avaliacao LIKE '%${query.mes_avaliacao}%'`;
      filtroTot =
        filtroTot + ` AND r.mes_avaliacao LIKE '%${query.mes_avaliacao}%'`;
    }
    if (isValid(query?.ano_avaliacao)) {
      filtro = filtro + ` AND ano_avaliacao LIKE '%${query.ano_avaliacao}%'`;
      filtroTot =
        filtroTot + ` AND r.ano_avaliacao LIKE '%${query.ano_avaliacao}%'`;
    }
    if (isValid(query?.ppo_cancelado)) {
      filtro = filtro + ` AND ppo_cancelado LIKE '%${query.ppo_cancelado}%'`;
      filtroTot =
        filtroTot + ` AND r.ppo_cancelado LIKE '%${query.ppo_cancelado}%'`;
    }
    if (isValid(query?.grupo)) {
      filtro = filtro + ` AND grupo LIKE '%${query.grupo}%'`;
      filtroTot = filtroTot + ` AND g.nome LIKE '%${query.grupo}%'`;
    }
    if (isValid(query?.permissoes)) {
      const position = query.permissoes.search("TODAS"); // se tiver essa permissão anula Filtro
      if (position == -1) {
        filtroTot = filtroTot + ` AND g.filial IN (${query.permissoes})`;
      }
    }

    const sqlTot = `
    select count(distinct(r.cpf)) as total from ppo_resultado r 
      inner join ppo_parametros_grupo p on p.id = r.parametro_grupo_id
      inner join ppo_grupos g on g.id=p.grupo_id
      where 1=1
      ${filtroTot}
    `;

    const tot = await mssqlPPO.raw(sqlTot);

    const sql = `
    DECLARE @tabelaRelatorio TABLE
    (
    id int,
    empresa NVARCHAR(255) NULL,
    grupo NVARCHAR(255) NULL,
    matricula  NVARCHAR(255) NULL,
    cpf NVARCHAR(255) NULL,
    nome_motorista NVARCHAR(255) NULL,
    QtdeEventosInterjornada NVARCHAR(255) NULL,
    QtdeEventosVelocidade  NVARCHAR(255) NULL,
    NotaAvaliacaoMotorista NVARCHAR(255) NULL ,
    KmRodado  NVARCHAR(255) NULL,
    ValorInterjornada DECIMAL(10,2) NULL,
    ValorVelocidade DECIMAL(10,2) NULL,
    ValorAvaliacao DECIMAL(10,2) NULL,
    ValorKMRodado DECIMAL(10,2) NULL,
    Total DECIMAL(10,2) NULL,
    ppo_cancelado BIT NULL,
    observacao NVARCHAR(MAX) NULL,
          mes_avaliacao NVARCHAR(10) NULL,
          ano_avaliacao NVARCHAR(10) NULL
   );

DECLARE @CPF_MOT VARCHAR(20),
        @Contador INT = 0,
            @PPO_Cancelado INT,
                @Column1 NVARCHAR(MAX),
                @Column2 NVARCHAR(MAX),
                @ColumnKM NVARCHAR(MAX),
                @mes NVARCHAR(2) = '${query.mes_avaliacao}',
                @ano NVARCHAR(4) = '${query.ano_avaliacao}';

DECLARE PPO_Cursor CURSOR FOR
      SELECT DISTINCT (r.cpf) FROM ppo_resultado r 
        INNER JOIN ppo_parametros_grupo p ON p.id = r.parametro_grupo_id
        INNER JOIN ppo_grupos g ON g.id=p.grupo_id
        where 1=1
        ${filtroTot}
        ORDER BY r.cpf ASC
        OFFSET ${(realPage - 1) * pageSize} ROWS
        FETCH NEXT  ${pageSize} ROWS ONLY
        


OPEN PPO_Cursor;

FETCH NEXT FROM PPO_Cursor INTO
    @CPF_MOT;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @Contador = @Contador + 1; --id linha motorista

        -- verificando se o ppo foi cancelado
        SELECT  @PPO_Cancelado = COUNT(0) FROM [dbo].[ppo_resultado] WHERE cpf =  @CPF_MOT
        AND ppo_cancelado = 1
        AND mes_avaliacao = @mes
        AND ano_avaliacao =  @ano

    IF @PPO_Cancelado > 0
      BEGIN

      SET @ColumnKM = NULL;

      -- busca KM
        SELECT 
            TOP 1
              @ColumnKM =  distancia
        FROM ppo_distancia_percorrida_fleet
        WHERE motorista  like   ''+'%'+ @CPF_MOT+'%'+''
            AND MONTH(created_at) = CONVERT(INT,@mes)+1
            AND YEAR(created_at) = CONVERT(INT,@ano)
            AND veiculo = 'Todos'
        ORDER BY created_at DESC


        -- insert ppo cancelado
                 INSERT INTO @tabelaRelatorio
                 SELECT  @Contador,g.empresa,g.nome,r.matricula,r.cpf,r.nome_motorista,0,0,0,CASE WHEN @ColumnKM IS NULL THEN 0 ELSE @ColumnKM END,0,0,0,0,0,r.ppo_cancelado,r.observacao,r.mes_avaliacao,r.ano_avaliacao FROM [dbo].[ppo_resultado] r
         INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
         INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
         WHERE cpf = @CPF_MOT
         AND ppo_cancelado = 1
                 AND mes_avaliacao = @mes
             AND ano_avaliacao =  @ano
      END
    ELSE
      BEGIN
            -- insere dados motorista
                INSERT INTO @tabelaRelatorio (id,Empresa,Grupo,matricula,cpf,nome_motorista,PPO_Cancelado,Observacao,mes_avaliacao,ano_avaliacao)
        SELECT DISTINCT  @Contador,g.empresa,g.nome,r.matricula,r.cpf,r.nome_motorista,r.ppo_cancelado,NULL,r.mes_avaliacao,r.ano_avaliacao from [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        WHERE cpf = @CPF_MOT
                AND mes_avaliacao = @mes
            AND ano_avaliacao =  @ano

                --insere avalicao
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'AVALIAÇÃO'
              AND mes_avaliacao = @mes
              AND ano_avaliacao =  @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET NotaAvaliacaoMotorista = @Column1,
           ValorAvaliacao  = @Column2
           WHERE id =  @Contador
           --fim insere avalicao

           --insere INFRAÇÃO VELOCIDADE
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'INFRAÇÃO VELOCIDADE'
              AND mes_avaliacao = @mes
              AND ano_avaliacao =  @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET QtdeEventosVelocidade = @Column1,
           ValorVelocidade  = @Column2
           WHERE id =  @Contador
           --fim insere INFRAÇÃO VELOCIDADE

           --insere INFRAÇÃO DE INTERJORNADA
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'INFRAÇÃO DE INTERJORNADA'
              AND mes_avaliacao = @mes
              AND ano_avaliacao = @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET QtdeEventosInterjornada = @Column1,
           ValorInterjornada  = @Column2
           WHERE id =  @Contador
           --fim insere INFRAÇÃO DE INTERJORNADA

           --insere KM
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'KM'
              AND mes_avaliacao = @mes
              AND ano_avaliacao = @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET KmRodado = @Column1,
           ValorKMRodado  = @Column2
           WHERE id =  @Contador
           --fim insere KM

           -- INSERE TOTAL
           SELECT
          @Column1 = SUM(CAST(premio AS FLOAT))
       FROM [dbo].[ppo_resultado]
       WHERE cpf = @CPF_MOT
           AND mes_avaliacao = @mes
           AND ano_avaliacao = @ano
       AND apto = 1

           UPDATE @tabelaRelatorio
             SET Total = @Column1
           WHERE id =  @Contador
           -- INSERE TOTAL

      END

    FETCH NEXT FROM PPO_Cursor INTO  -- Busque a próxima linha
        @CPF_MOT;
END
CLOSE PPO_Cursor; -- Feche o cursor
DEALLOCATE PPO_Cursor; -- Libere recursos do cursor

select * from @tabelaRelatorio
WHERE 1=1
${filtro}
    `;

    const results = await mssqlPPO.raw(sql);
    const totalRegisters = Number(tot[0]["total"]) || 0;

    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: results,
    };
  }

  async searchExcel(
    query: Record<string, any>,
    pageSize = 5
  ): Promise<any | undefined> {
    let filtro = "";

    if (isValid(query?.cpf)) {
      filtro = filtro + ` AND cpf LIKE '%${query.cpf}%'`;
    }
    if (isValid(query?.matricula)) {
      filtro = filtro + ` AND matricula LIKE '%${query.matricula}%'`;
    }
    if (isValid(query?.nome_motorista)) {
      filtro = filtro + ` AND nome_motorista LIKE '%${query.nome_motorista}%'`;
    }
    if (isValid(query?.mes_avaliacao)) {
      filtro = filtro + ` AND mes_avaliacao LIKE '%${query.mes_avaliacao}%'`;
    }
    if (isValid(query?.ano_avaliacao)) {
      filtro = filtro + ` AND ano_avaliacao LIKE '%${query.ano_avaliacao}%'`;
    }
    if (isValid(query?.ppo_cancelado)) {
      filtro = filtro + ` AND ppo_cancelado LIKE '%${query.ppo_cancelado}%'`;
    }
    if (isValid(query?.permissoes)) {
      const position = query.permissoes.search("TODAS"); // se tiver essa permissão anula Filtro
      if (position == -1) {
        filtro = filtro + ` AND filial IN (${query.permissoes})`;
      }
    }

    const sql = `
    DECLARE @tabelaRelatorio TABLE
    (
    id int,
    empresa NVARCHAR(255) NULL,
    filial NVARCHAR(255) NULL,
    grupo NVARCHAR(255) NULL,
    matricula  NVARCHAR(255) NULL,
    cpf NVARCHAR(255) NULL,
    nome_motorista NVARCHAR(255) NULL,
    QtdeEventosInterjornada NVARCHAR(255) NULL,
    QtdeEventosVelocidade  NVARCHAR(255) NULL,
    NotaAvaliacaoMotorista NVARCHAR(255) NULL ,
    KmRodado  NVARCHAR(255) NULL,
    ValorInterjornada DECIMAL(10,2) NULL,
    ValorVelocidade DECIMAL(10,2) NULL,
    ValorAvaliacao DECIMAL(10,2) NULL,
    ValorKMRodado DECIMAL(10,2) NULL,
    Total DECIMAL(10,2) NULL,
    ppo_cancelado BIT NULL,
    observacao NVARCHAR(MAX) NULL,
          mes_avaliacao NVARCHAR(10) NULL,
          ano_avaliacao NVARCHAR(10) NULL
   );

DECLARE @CPF_MOT VARCHAR(20),
        @Contador INT = 0,
            @PPO_Cancelado INT,
                @Column1 NVARCHAR(MAX),
                @Column2 NVARCHAR(MAX),
                @ColumnKM NVARCHAR(MAX),
                @mes NVARCHAR(2) = '${query.date_execel_inicio}',
                @ano NVARCHAR(4) = '${query.date_execel_fim}';

DECLARE PPO_Cursor CURSOR FOR
    SELECT DISTINCT cpf
    FROM [dbo].[ppo_resultado]
    WHERE mes_avaliacao = @mes
        AND ano_avaliacao =  @ano

OPEN PPO_Cursor;

FETCH NEXT FROM PPO_Cursor INTO
    @CPF_MOT;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @Contador = @Contador + 1; --id linha motorista

        -- verificando se o ppo foi cancelado
        SELECT  @PPO_Cancelado = COUNT(0) FROM [dbo].[ppo_resultado] WHERE cpf =  @CPF_MOT
        AND ppo_cancelado = 1
        AND mes_avaliacao = @mes
        AND ano_avaliacao =  @ano

    IF @PPO_Cancelado > 0
      BEGIN
       
      SET @ColumnKM = NULL;
      
      -- busca KM
        SELECT 
          TOP 1
              @ColumnKM =  distancia
        FROM ppo_distancia_percorrida_fleet
        WHERE motorista  like   ''+'%'+ @CPF_MOT+'%'+''
            AND MONTH(created_at) = CONVERT(INT,@mes)+1
            AND YEAR(created_at) = CONVERT(INT,@ano)
            AND veiculo = 'Todos'
        ORDER BY created_at DESC

        -- insert ppo cancelado
                 INSERT INTO @tabelaRelatorio
                 SELECT  @Contador,g.empresa,g.filial,g.nome,r.matricula,r.cpf,r.nome_motorista,0,0,0,CASE WHEN @ColumnKM IS NULL THEN 0 ELSE @ColumnKM END,0,0,0,0,0,r.ppo_cancelado,r.observacao,r.mes_avaliacao,r.ano_avaliacao FROM [dbo].[ppo_resultado] r
         INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
         INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
         WHERE cpf = @CPF_MOT
         AND ppo_cancelado = 1
                 AND mes_avaliacao = @mes
             AND ano_avaliacao =  @ano
      END
    ELSE
      BEGIN
            -- insere dados motorista
                INSERT INTO @tabelaRelatorio (id,Empresa,filial,Grupo,matricula,cpf,nome_motorista,PPO_Cancelado,Observacao,mes_avaliacao,ano_avaliacao)
        SELECT DISTINCT  @Contador,g.empresa,g.filial,g.nome,r.matricula,r.cpf,r.nome_motorista,r.ppo_cancelado,NULL,r.mes_avaliacao,r.ano_avaliacao from [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        WHERE cpf = @CPF_MOT
                AND mes_avaliacao = @mes
            AND ano_avaliacao =  @ano

                --insere avalicao
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'AVALIAÇÃO'
              AND mes_avaliacao = @mes
              AND ano_avaliacao =  @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET NotaAvaliacaoMotorista = @Column1,
           ValorAvaliacao  = @Column2
           WHERE id =  @Contador
           --fim insere avalicao

           --insere INFRAÇÃO VELOCIDADE
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'INFRAÇÃO VELOCIDADE'
              AND mes_avaliacao = @mes
              AND ano_avaliacao =  @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET QtdeEventosVelocidade = @Column1,
           ValorVelocidade  = @Column2
           WHERE id =  @Contador
           --fim insere INFRAÇÃO VELOCIDADE

           --insere INFRAÇÃO DE INTERJORNADA
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'INFRAÇÃO DE INTERJORNADA'
              AND mes_avaliacao = @mes
              AND ano_avaliacao = @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET QtdeEventosInterjornada = @Column1,
           ValorInterjornada  = @Column2
           WHERE id =  @Contador
           --fim insere INFRAÇÃO DE INTERJORNADA

           --insere KM
                SELECT
          top 1
          @Column1 = r.dado_verificado,
          @Column2 = CASE WHEN apto = 1 THEN r.premio ELSE '0' END
        FROM [dbo].[ppo_resultado] r
        INNER JOIN dbo.ppo_parametros_grupo pg ON pg.id = r.parametro_grupo_id
        INNER JOIN dbo.ppo_grupos g ON g.id = pg.grupo_id
        INNER JOIN dbo.ppo_parametros p ON p.id = pg.parametro_id
        WHERE cpf = @CPF_MOT
          AND p.nome = 'KM'
              AND mes_avaliacao = @mes
              AND ano_avaliacao = @ano
       ORDER BY apto DESC

           UPDATE @tabelaRelatorio
           SET KmRodado = @Column1,
           ValorKMRodado  = @Column2
           WHERE id =  @Contador
           --fim insere KM

           -- INSERE TOTAL
           SELECT
          @Column1 = SUM(CAST(premio AS FLOAT))
       FROM [dbo].[ppo_resultado]
       WHERE cpf = @CPF_MOT
           AND mes_avaliacao = @mes
           AND ano_avaliacao = @ano
       AND apto = 1

           UPDATE @tabelaRelatorio
             SET Total = @Column1
           WHERE id =  @Contador
           -- INSERE TOTAL

      END

    FETCH NEXT FROM PPO_Cursor INTO  -- Busque a próxima linha
        @CPF_MOT;
END
CLOSE PPO_Cursor; -- Feche o cursor
DEALLOCATE PPO_Cursor; -- Libere recursos do cursor

select 
empresa as Empresa,
grupo as Grupo,
matricula as Matricula,
cpf as CPF,
nome_motorista AS 'Nome Motorista',
QtdeEventosInterjornada 'Qtde. Eventos Interjornada' ,
QtdeEventosVelocidade 'Qtde. Eventos Velocidade',
NotaAvaliacaoMotorista 'Nota Avaliação Motorista',
KmRodado as 'Km Rodados',
CONVERT(VARCHAR, CAST(ValorInterjornada AS MONEY), 1) as 'Valor Interjornada',
CONVERT(VARCHAR, CAST(ValorVelocidade AS MONEY), 1) as 'Valor Velocidade',
CONVERT(VARCHAR, CAST(ValorAvaliacao AS MONEY), 1) as 'Valor Avaliação',
CONVERT(VARCHAR, CAST(ValorKMRodado AS MONEY), 1) as 'Valor Km Rodado',
Total,
CASE WHEN ppo_cancelado=1 THEN 'Sim' ELSE 'Não'END as 'PPO Cancelado',
CASE WHEN observacao is null THEN 'Sem Observação' ELSE observacao END 'Observação',
mes_avaliacao as Mês,
ano_avaliacao as Ano
from @tabelaRelatorio
WHERE 1=1
${filtro}
ORDER BY id ASC
OFFSET 0 ROWS
FETCH NEXT  ${pageSize} ROWS ONLY
    `;

    const rows = await mssqlPPO.raw(sql);
    return {
      results: rows,
    };
  }

  async relatorioDocumentosExcel(
    query: Record<string, any>,
    pageSize = 5
  ): Promise<any | undefined> {
    let filtro = "";

    if (isValid(query?.cpf)) {
      filtro =
        filtro +
        ` AND ass.cpf LIKE '%${query.cpf
          .replace(".", "")
          .replace(".", "")
          .replace("-", "")}%'`;
    }
    if (isValid(query?.viewed)) {
      filtro = filtro + ` AND viewed ${query.viewed}`;
    }
    if (isValid(query?.signed)) {
      filtro = filtro + ` AND signed ${query.signed}`;
    }
    if (isValid(query?.mes)) {
      filtro = filtro + ` AND mes LIKE '%${query.date_execel_inicio}%'`;
    }
    if (isValid(query?.ano)) {
      filtro = filtro + ` AND ano LIKE '%${query.date_execel_fim}%'`;
    }
    if (isValid(query?.rejected)) {
      filtro = filtro + ` AND rejected ${query.rejected}`;
    }
    if (isValid(query?.permissoes)) {
      const position = query.permissoes.search("TODAS"); // se tiver essa permissão anula Filtro
      if (position == -1) {
        filtro = filtro + ` AND m.filial IN (${query.permissoes})`;
      }
    }
    if (isValid(query?.filial)) {
      filtro = filtro + ` AND m.filial LIKE '%${query.filial}%'`;
    }
    if (isValid(query?.nome)) {
      filtro = filtro + ` AND m.motorista LIKE '%${query.nome}%'`;
    }

    const results = mssqlPPO.raw(`
    SELECT
    CONCAT(
            SUBSTRING(ass.cpf, 1, 3), 
            '.', 
            SUBSTRING(ass.cpf, 4, 3), 
            '.', 
            SUBSTRING(ass.cpf, 7, 3), 
            '-', 
            SUBSTRING(ass.cpf, 10, 2)) as cpf
        ,m.motorista as nome
		,m.filial
        ,link
        ,file_link_original
        ,file_link_signed
        ,CASE WHEN viewed is null THEN 0 ELSE 1 END as viewed
        ,viewed as viewed_data
        ,CASE WHEN signed is null THEN 0 ELSE 1 END as signed
        ,signed as signed_data
        ,CASE WHEN rejected is null THEN 0 ELSE 1 END as rejected
        ,rejected as rejected_data
        ,mes
        ,ano
        ,created_at 
        ,updated_at
    FROM ASSINADOR_DIGITAL.DBO.controle ass
	LEFT JOIN PPO.dbo.motoristas m on m.cpf =  CONCAT(
            SUBSTRING(ass.cpf, 1, 3), 
            '.', 
            SUBSTRING(ass.cpf, 4, 3), 
            '.', 
            SUBSTRING(ass.cpf, 7, 3), 
            '-', 
            SUBSTRING(ass.cpf, 10, 2))
    WHERE 1=1
    ${filtro}
    ORDER BY id ASC
    OFFSET 0 ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `);

    const rows = await results;
    return {
      results: rows,
    };
  }

  async relatorioDocumentos(
    query: Record<string, any>,
    page = 1,
    pageSize = 5
  ): Promise<any | undefined> {
    const realPage = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

    let filtro = "";

    if (isValid(query?.cpf)) {
      filtro =
        filtro +
        ` AND ass.cpf LIKE '%${query.cpf
          .replace(".", "")
          .replace(".", "")
          .replace("-", "")}%'`;
    }
    if (isValid(query?.viewed)) {
      filtro = filtro + ` AND viewed ${query.viewed}`;
    }
    if (isValid(query?.signed)) {
      filtro = filtro + ` AND signed ${query.signed}`;
    }
    if (isValid(query?.mes)) {
      filtro = filtro + ` AND mes LIKE '%${query.mes}%'`;
    }
    if (isValid(query?.ano)) {
      filtro = filtro + ` AND ano LIKE '%${query.ano}%'`;
    }
    if (isValid(query?.rejected)) {
      filtro = filtro + ` AND rejected ${query.rejected}`;
    }
    if (isValid(query?.permissoes)) {
      const position = query.permissoes.search("TODAS"); // se tiver essa permissão anula Filtro
      if (position == -1) {
        filtro = filtro + ` AND m.filial IN (${query.permissoes})`;
      }
    }
    if (isValid(query?.filial)) {
      filtro = filtro + ` AND m.filial LIKE '%${query.filial}%'`;
    }
    if (isValid(query?.nome)) {
      filtro = filtro + ` AND m.motorista LIKE '%${query.nome}%'`;
    }

    const total = await mssqlPPO.raw(
      `SELECT COUNT(0) as total FROM ASSINADOR_DIGITAL.DBO.controle ass
       LEFT JOIN PPO.dbo.motoristas m on m.cpf =  CONCAT(
        SUBSTRING(ass.cpf, 1, 3), 
        '.', 
        SUBSTRING(ass.cpf, 4, 3), 
        '.', 
        SUBSTRING(ass.cpf, 7, 3), 
        '-', 
        SUBSTRING(ass.cpf, 10, 2))
       WHERE 1=1
       ${filtro}
      `
    );

    const sql = `
    SELECT
    CONCAT(
            SUBSTRING(ass.cpf, 1, 3), 
            '.', 
            SUBSTRING(ass.cpf, 4, 3), 
            '.', 
            SUBSTRING(ass.cpf, 7, 3), 
            '-', 
            SUBSTRING(ass.cpf, 10, 2)) as cpf
        ,m.motorista as nome
		,m.filial
        ,link
        ,file_link_original
        ,file_link_signed
        ,CASE WHEN viewed is null THEN 0 ELSE 1 END as viewed
        ,viewed as viewed_data
        ,CASE WHEN signed is null THEN 0 ELSE 1 END as signed
        ,signed as signed_data
        ,CASE WHEN rejected is null THEN 0 ELSE 1 END as rejected
        ,rejected as rejected_data
        ,mes
        ,ano
        ,created_at 
        ,updated_at
    FROM ASSINADOR_DIGITAL.DBO.controle ass
	LEFT JOIN PPO.dbo.motoristas m on m.cpf =  CONCAT(
            SUBSTRING(ass.cpf, 1, 3), 
            '.', 
            SUBSTRING(ass.cpf, 4, 3), 
            '.', 
            SUBSTRING(ass.cpf, 7, 3), 
            '-', 
            SUBSTRING(ass.cpf, 10, 2))
    WHERE 1=1
    ${filtro}
    ORDER BY id ASC
    OFFSET ${(realPage - 1) * pageSize} ROWS
    FETCH NEXT  ${pageSize} ROWS ONLY
    `;
    const results = await mssqlPPO.raw(sql);
    const totalRegisters = Number(total[0]["total"]) || 0;

    return {
      page: realPage,
      total_pages: Math.ceil(totalRegisters / pageSize),
      total_registers: totalRegisters,
      results: results,
    };
  }

  async motorista_by_grupo(cpf: string, permissoes: string): Promise<any> {
    const positionT = permissoes.search("TODAS");
    const positionH = permissoes.search("HISTORICO");
    if (positionT == -1 || positionH == -1) {
      const sql = `SELECT * FROM dbo.VW_DADO_MOTORISTA_PPO
      WHERE RA_CIC = '${cpf}'
      AND M0_FILIAL IN (${permissoes})
      `;

      return mssqlPPOView.raw(sql);
    } else {
      return [{}];
    }
  }
}
