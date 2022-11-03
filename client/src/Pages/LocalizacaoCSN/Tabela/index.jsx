import React, { useRef } from "react";
import "../localizacao.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TableLocalizacao = ({
  valueLocalizacao,
  globalFilter,
  header,
  actionBodyTemplate,
}) => {
  const table = useRef(null);
  return (
    <div className="datatable-crud-demo">
      <div className="card">
        <DataTable
          ref={table}
          value={valueLocalizacao}
          dataKey="id"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Exibindo {first} de {last} registro."
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            field="id"
            header="Id"
            sortable
            //style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="description"
            header="Descrição"
            sortable
            //style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="lat"
            header="Latitude"
            sortable
            //style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="lot"
            header="Longidude"
            sortable
            //style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            header="Editar/Excluir"
            body={actionBodyTemplate}
            exportable={false}
            style={{ maxWidth: "6rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default TableLocalizacao;
