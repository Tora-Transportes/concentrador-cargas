import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./engateDesengate.css";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";

export default function SelecionarProcesso() {
  return (
    <>
      <Menusuperior />
      <Container className="cargas-container">
        <h1 className="h1-title">Selecione um dos processos:</h1>
        <div className="button-icons">
          <>
            <Link className="text-decoration-none" to="/engate">
              <BiLockAlt size={70} className="icon-engate" />
              <p className="title-icon-engate">Engatar</p>
            </Link>

            <Link className="text-decoration-none" to="/desengate">
              <BiLockOpenAlt size={75} className="icon-desengate" />
              <p className="title-CSN">Desengatar</p>
            </Link>
          </>
        </div>
      </Container>
    </>
  );
}
