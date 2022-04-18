import AllRoutes from "./routes";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;
import "leaflet/dist/leaflet.css";

const App = () => {
	return <AllRoutes />;
};

export default App;
