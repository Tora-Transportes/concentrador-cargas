import React from "react";

import "./siteEmManutencao.css";
import imgManutencao from "./../../assets/imagManutencao.jpg";

const SiteEmManutencao = () => {
  return (
    <div
      style={{
        backgroundColor: "#00652e",
        textAlign: "center",
        height: "100vh",
      }}
    >
      <div className="text-header">
        <h4>Sistema em manutenção</h4>
        <h5>Por favor tente novamente em instantes. </h5>
      </div>
      <img
        src={imgManutencao}
        alt="logo manutencao"
        id="imgManutencao"
        className="imagManutencao"
      />
    </div>
  );
};

export default SiteEmManutencao;
