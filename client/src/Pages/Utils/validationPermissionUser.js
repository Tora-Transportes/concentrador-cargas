import { getClaims } from "src/MicrosoftAuthentication";
import ServiceUsuarios from "src/services/ServiceUsuarios";

export const validationPermissionUser = async () => {
	const oid = getClaims().oid;
	let permission = localStorage.getItem("adal.user");
	permission = JSON.parse(permission);
	if (permission == null) {
		permission = (
			await ServiceUsuarios.index({
				oid,
			})
		).data.data;
		localStorage.setItem("adal.user", JSON.stringify(permission));
	}
	return permission;
};
