import { getClaims } from "src/MicrosoftAuthentication";
import ServiceUsuarios from "src/services/ServiceUsuarios";

export const validationPermissionUser = async () => {
	const oid = getClaims().oid;
	const userPermission = (
		await ServiceUsuarios.index({
			oid,
		})
	).data.data;
	return userPermission;
};
