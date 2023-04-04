import * as chai from "chai";
import chaiHttp from "chai-http";
import { request, expect } from "chai";
import "mocha";

import server from "../../src/index";
chai.use(chaiHttp);

interface IBodyAvisos {
  TITULO: string;
  MENSAGEM: string;
  AUTOR: string;
}

const jwtToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjNGFjOWZkYi1kYWE3LTQ1YjktYmE4Yy05Y2QxYmJmNGVjMzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MvIiwiaWF0IjoxNjU5NTIzODQzLCJuYmYiOjE2NTk1MjM4NDMsImV4cCI6MTY1OTUyNzc0MywiYWlvIjoiQVZRQXEvOFRBQUFBYUtoNkZJWXhGMEtFcEhJejJHUW5LWU9xUVBsTmhSbUdGUXcrTUY2MmIyeTNEc1NrVUtXU0NmeFRaZFFpa3B6ZUVxV0k1dnJneDlGR1ZRLzBYM01IbCtQTU9oRU1McGRjcmVXbno5NlZTN0k9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJmYW1pbHlfbmFtZSI6IlBpcmVzIGRlIENhc3RybyIsImdpdmVuX25hbWUiOiJNb2lzZXMiLCJpcGFkZHIiOiIxODkuODAuMTI0LjI3IiwibmFtZSI6Ik1vaXNlcyBQaXJlcyBkZSBDYXN0cm8iLCJub25jZSI6ImI0YTZiYWM2LWNiYWEtNDYxZS1iNjdmLWQ1MDBiZGRhNGQ5ZCIsIm9pZCI6IjhmNTU3ZDcxLTA0YzYtNDg4Ni05ZjMwLTBiZDdlY2M5MTA3NyIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMDA3NjQ3Mzg3LTE4NzMzNjM5ODktMzc2MzkzNDI0My0yODg1MSIsInJoIjoiMC5BUThBU2FmdFZsNjVkRXFUM3ZBZjFyRmh6TnVmck1TbjJybEZ1b3ljMGJ2MDdEZ1BBRGsuIiwic3ViIjoiRzJXSGJBbDRXcXJNNnk0VUlNRml0WFhpamo3VDBtaTVnTW5Zdlp6XzNpYyIsInRpZCI6IjU2ZWRhNzQ5LWI5NWUtNGE3NC05M2RlLWYwMWZkNmIxNjFjYyIsInVuaXF1ZV9uYW1lIjoibW9pc2VzLmNhc3Ryb0B0b3JhLmNvbS5iciIsInVwbiI6Im1vaXNlcy5jYXN0cm9AdG9yYS5jb20uYnIiLCJ1dGkiOiJfOGRwVDhVUzkwbS0zaElJclhDSUFRIiwidmVyIjoiMS4wIn0.XUJXT7HAdVsGxn-Ub2S4Q4Moxr5bdxJu4OduR99bV90sV5F_DvHjTTyH56UoiN8jAQFTcXfGC2V3_6BtucWuqbTP-jOHxXTBlh0UIfjXueOGFCdvSWgux4d5U06kdn4ypdQ099NF6itrVLLmoAx-SGA-0tK_14PEPvb_WVXAK_UjrTx1m9IkTnIyitoGWUJAa6p0bQHGf17ZffWcPFC8YL5JdZCgl-mChLP1w_nkrXrCbY9aAJTOh9Yap7X9rsBAVRh_RIECbwi2tMmcK0l1FbquZSQ3psG7JL-3JAzV-i-7gUGKnVgxJduX79SVDK9WbwQEvjhZ9OLjxO-ss01NDg";

const closeServer = () => {
  server.close();
};

describe("Gerenciar avisos", () => {
  const makeBodyAviso: IBodyAvisos = {
    TITULO: "TESTE INTEGRAÇÃO BACK",
    MENSAGEM:
      "Teste da tela de aviso, verificão de funcionalidades, testando tudo.",
    AUTOR: "MOISES PIRES DE CASTRO",
  };
  it("Deve retornar os 10 avisos  mais recentes", async () => {
    const result = await request(server).get("/avisos");

    expect(result.status).to.eql(200);
    closeServer();
  });

  it("Deve retornar 404 caso não exita o aviso na busca", async () => {
    const result = await request(server).get("/avisos/9999");

    expect(result.status).to.eql(404);
    closeServer();
  });

  it("Deve retornar 400 na falta de enviar o TITULO no body da criação", function () {
    const body = {
      MENSAGEM: makeBodyAviso.MENSAGEM,
      AUTOR: makeBodyAviso.AUTOR,
    };

    request(server)
      .post("/avisos")
      .send(body)
      .set("Authorization", `Bearer ${jwtToken}`)
      .then((res) => {
        expect(res.status).to.eql(400);
        closeServer();
      });
  });
});
