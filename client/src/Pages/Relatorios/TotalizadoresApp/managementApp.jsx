import { Table } from "react-bootstrap";
//import { BsDownload } from "react-icons/bs";
import { MdOutlineSendToMobile } from "react-icons/md";

export function TableCarga({
  totalizadores,
  percentage,
  //handleExportExcel,
  //statusCargaId,
}) {
  // const keyExcelAtivo = statusCargaId === 0 ? "app_ativas" : "app_csn_ativas";
  // const keyExcelDesativo =
  //   statusCargaId === 0 ? "app_desativadas" : "app_csn_desativadas";
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Situação</th>
          <th>Percentual</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <MdOutlineSendToMobile size={30} className="icons-success" />
          </td>
          <td>Cargas Ativadas</td>
          <td>
            <span className="span-cargas-ativadas">
              {percentage(
                totalizadores.cargas_ativas + totalizadores.cargas_desativadas,
                totalizadores.cargas_ativas
              )}
              %
            </span>
          </td>
          <td>
            <b>{totalizadores.cargas_ativas}</b>
          </td>
          <td>
            {/* <Button variant="" onClick={() => handleExportExcel(keyExcelAtivo)}>
              <BsDownload />
            </Button> */}
          </td>
        </tr>

        <tr>
          <td>
            <MdOutlineSendToMobile size={30} className="icons-danger" />
          </td>
          <td>Cargas Desativadas</td>
          <td>
            <span className="span-cargas-desativadas">
              {percentage(
                totalizadores.cargas_ativas + totalizadores.cargas_desativadas,
                totalizadores.cargas_desativadas
              )}
              %
            </span>
          </td>
          <td>
            <b>{totalizadores.cargas_desativadas}</b>
          </td>
          <td>
            {/* <Button
              variant=""
              onClick={() => handleExportExcel(keyExcelDesativo)}
            >
              <BsDownload />
            </Button> */}
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
