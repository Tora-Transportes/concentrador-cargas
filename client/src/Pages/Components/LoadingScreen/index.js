import React, { useState } from "react";
import "./index.css";

export function LoadingScreen() {
	return <div className="loading"></div>;
}

export default () => {
	const [loading, setLoading] = useState(false);

	return [() => (loading ? <LoadingScreen /> : null), setLoading];
};
