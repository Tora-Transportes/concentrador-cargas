import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import requireMicrosoftAuthentication, {
	withAdalLoginApi,
} from "./MicrosoftAuthentication";
import "bootstrap/dist/css/bootstrap.min.css";

const LoggedApp = withAdalLoginApi(() => <App />);

requireMicrosoftAuthentication(() => {
	ReactDOM.render(
		<BrowserRouter>
			<LoggedApp />
		</BrowserRouter>,
		document.getElementById("root")
	);
});
