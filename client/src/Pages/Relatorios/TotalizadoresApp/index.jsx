import React, { useRef } from "react";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewRotasPendentes from "./view";
import ServiceRelatorios from "../../../services/ServiceRelatorios";
import { useEffect, useState } from "react";
import io from "../../../services/socket";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { useParams } from "react-router-dom";

function RelatoriosAppMain() {
  const { id } = useParams();
  const [LoadingScreen, setLoading] = useLoadingScreen();
  const [totalizadores, setTotalizadores] = useState({
    cargas_ativas: 0,
    cargas_desativadas: 0,
    cadastro_portal: 0,
    cadastro_manual: 0,
    lotes_ativos: 0,
    lotes_desativados: 0,
    geral: [
      {
        total: 0,
        fk_situacao: 1,
        descricao: "Aguardando Alocação (Veículo)",
      },
      {
        total: 0,
        fk_situacao: 2,
        descricao: "Aguardando GR",
      },
      {
        total: 0,
        fk_situacao: 3,
        descricao: "Validado pelo GR",
      },
      {
        total: 0,
        fk_situacao: 4,
        descricao: "Veículo Reprovado",
      },
      {
        total: 0,
        fk_situacao: 5,
        descricao: "Carga cancelada",
      },
    ],
  });
  const [tempoMedioAprovacaoGr, setTempoMedioAprovacaoGr] = useState(null);
  const [resumosDiarios, setResumosDiarios] = useState([]);
  const [filters, setFilters] = useState({
    data_inicio: "",
    data_final: "",
    fk_filial: "",
  });
  const interval = useRef(null);
  const statusCargaId = String(id) === "csn" ? 1 : 0;
  useEffect(() => {
    if (statusCargaId === 1) {
      setTotalizadores(() => {
        return {
          ...totalizadores,
          geral: [
            {
              total: 0,
              fk_situacao: 1,
              descricao: "Aguardando Alocação (Veículo)",
            },
            {
              total: 0,
              fk_situacao: 2,
              descricao: "Aguardando Aprovação",
            },
            {
              total: 0,
              fk_situacao: 3,
              descricao: "Iniciando Trajeto",
            },
            {
              total: 0,
              fk_situacao: 4,
              descricao: "Em Coleta",
            },
            {
              total: 0,
              fk_situacao: 5,
              descricao: "Reprovada",
            },
            {
              total: 0,
              fk_situacao: 6,
              descricao: "Cancelada",
            },
            {
              total: 0,
              fk_situacao: 7,
              descricao: "Finalizada",
            },
            {
              total: 0,
              fk_situacao: 8,
              descricao: "EM Trânsito",
            },
          ],
        };
      });
    }
  }, [id]);
  useEffect(() => {
    reload();
  }, [filters]);

  const reload = () => {
    clearInterval(interval.current);
    interval.current = setTimeout(async () => {
      setLoading(true);
      const statusEnvioCargaApp = "1";
      const filtroTotalizador = {
        ...filters,
        carga_csn: statusCargaId,
        carga_app: statusEnvioCargaApp,
      };

      let result = (await ServiceRelatorios.totalizadores(filtroTotalizador))
        .data.data;

      if (statusCargaId === 0) {
        result.geral = await result.geral.filter(
          (item) => item.fk_situacao < 7
        );
      }

      setTotalizadores(result);

      setTempoMedioAprovacaoGr(
        await (
          await ServiceRelatorios.mediaAprovacaoGr()
        ).data.data[0]
      );

      if (!filters.fk_filial || !filters.data_final || !filters.data_inicio) {
        setResumosDiarios([]);
      } else {
        const a = (
          await ServiceRelatorios.resumosDiarios({
            ...filters,
            carga_csn: statusCargaId,
          })
        ).data.data;
        setResumosDiarios(a);
      }
      setLoading(false);
    }, 300);
  };

  async function handleExportExcel(key = "") {
    setLoading(true);

    const response = await ServiceRelatorios.exportToXlsx({ key, ...filters });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `RELATORIO_DETALHES-${new Date().getTime()}.xlsx`
    );
    link.click();
    setLoading(false);
  }

  useEffect(() => {
    if (statusCargaId === 0) {
      io.on("@carga-create", reload);
      io.on("@carga-update", reload);
      io.on("@carga-delete", reload);
      return () => {
        io.offAny(reload);
      };
    } else {
      io.on("@carga-create-csn", reload);
      io.on("@carga-update-csn", reload);
      io.on("@carga-delete-csn", reload);
      return () => {
        io.offAny(reload);
      };
    }
  }, [io, reload, filters]);

  useEffect(() => {
    let isMounted = true;
    (async function () {
      if (isMounted) {
        const statusEnvioCargaApp = "1";
        const filtroTotalizador = {
          carga_csn: statusCargaId,
          carga_app: statusEnvioCargaApp,
        };
        let total = (await ServiceRelatorios.totalizadores(filtroTotalizador))
          .data.data;

        if (statusCargaId === 0) {
          total.geral = await total.geral.filter(
            (item) => item.fk_situacao < 7
          );
        }
        setTotalizadores(total);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="class-body-relatorio">
      <LoadingScreen />
      <Menusuperior />
      <ViewRotasPendentes
        totalizadores={totalizadores}
        reload={setFilters}
        handleExportExcel={handleExportExcel}
        resumosDiarios={resumosDiarios}
        tempoMedioAprovacaoGr={tempoMedioAprovacaoGr}
        statusCargaId={statusCargaId}
      />
    </div>
  );
}

export default RelatoriosAppMain;
