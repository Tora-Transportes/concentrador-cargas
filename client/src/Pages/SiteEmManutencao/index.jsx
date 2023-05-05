import React from "react";

import "./siteEmManutencao.css";
import imgManutencao from "./../../assets/imagManutencao.jpg";
import imgFabricaTora from "./../../assets/img-tora.png";

const SiteEmManutencao = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${imgFabricaTora})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        textAlign: "center",
        width: "100vw",
        height: "100vh",
        paddingTop: "5.5vh",
      }}
    >
      <div>
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
    </div>
  );
};

export default SiteEmManutencao;
