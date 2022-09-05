import React from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

export const renderHeader = (globalFilter, setGlobalFilter) => {
	return (
		<div className="header-table-add-permission">
			<div className="menu-header-table-permission">
				<input
					placeholder="Fazer busca global"
					value={globalFilter}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className=" input-empty"
				/>
				<i className="pi pi-search" />
			</div>
		</div>
	);
};

export const actionBodyTemplate = (rowData, handleSavePermissions) => {
	return (
		<div className="button-table-add-permission">
			<button onClick={() => handleSavePermissions(rowData)} disabled={false}>
				<IoIosArrowDropdownCircle size={18} />
				<span key={rowData.oid}>Permissões</span>
			</button>
		</div>
	);
};

export const permissBodyTemplate = (rowData, deletePermission) => {
	return (
		<div>
			{rowData.permissoes.map((item) => (
				<div key={rowData.oid + item}>
					<div>
						<MdDeleteForever
							className="logo-button-table-apagar-permission"
							onClick={() => deletePermission(item, rowData.oid)}
							size={17}
						/>
					</div>

					<span> {item}, </span>
				</div>
			))}
		</div>
	);
};

export const nameBodyTemplate = (rowData) => {
	return <React.Fragment>{rowData.nome}</React.Fragment>;
};
export const emailBodyTemplate = (rowData) => {
	return <React.Fragment>{rowData.email}</React.Fragment>;
};
