import * as chai from "chai";
import chaiHttp from "chai-http";
import { request, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";

import database from "../../src/database";
import server from "../../src/index";
chai.use(chaiHttp);
chai.use(chaiAsPromised);

const jwtToken =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjNGFjOWZkYi1kYWE3LTQ1YjktYmE4Yy05Y2QxYmJmNGVjMzgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81NmVkYTc0OS1iOTVlLTRhNzQtOTNkZS1mMDFmZDZiMTYxY2MvIiwiaWF0IjoxNjU5NTIzODQzLCJuYmYiOjE2NTk1MjM4NDMsImV4cCI6MTY1OTUyNzc0MywiYWlvIjoiQVZRQXEvOFRBQUFBYUtoNkZJWXhGMEtFcEhJejJHUW5LWU9xUVBsTmhSbUdGUXcrTUY2MmIyeTNEc1NrVUtXU0NmeFRaZFFpa3B6ZUVxV0k1dnJneDlGR1ZRLzBYM01IbCtQTU9oRU1McGRjcmVXbno5NlZTN0k9IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJmYW1pbHlfbmFtZSI6IlBpcmVzIGRlIENhc3RybyIsImdpdmVuX25hbWUiOiJNb2lzZXMiLCJpcGFkZHIiOiIxODkuODAuMTI0LjI3IiwibmFtZSI6Ik1vaXNlcyBQaXJlcyBkZSBDYXN0cm8iLCJub25jZSI6ImI0YTZiYWM2LWNiYWEtNDYxZS1iNjdmLWQ1MDBiZGRhNGQ5ZCIsIm9pZCI6IjhmNTU3ZDcxLTA0YzYtNDg4Ni05ZjMwLTBiZDdlY2M5MTA3NyIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMDA3NjQ3Mzg3LTE4NzMzNjM5ODktMzc2MzkzNDI0My0yODg1MSIsInJoIjoiMC5BUThBU2FmdFZsNjVkRXFUM3ZBZjFyRmh6TnVmck1TbjJybEZ1b3ljMGJ2MDdEZ1BBRGsuIiwic3ViIjoiRzJXSGJBbDRXcXJNNnk0VUlNRml0WFhpamo3VDBtaTVnTW5Zdlp6XzNpYyIsInRpZCI6IjU2ZWRhNzQ5LWI5NWUtNGE3NC05M2RlLWYwMWZkNmIxNjFjYyIsInVuaXF1ZV9uYW1lIjoibW9pc2VzLmNhc3Ryb0B0b3JhLmNvbS5iciIsInVwbiI6Im1vaXNlcy5jYXN0cm9AdG9yYS5jb20uYnIiLCJ1dGkiOiJfOGRwVDhVUzkwbS0zaElJclhDSUFRIiwidmVyIjoiMS4wIn0.XUJXT7HAdVsGxn-Ub2S4Q4Moxr5bdxJu4OduR99bV90sV5F_DvHjTTyH56UoiN8jAQFTcXfGC2V3_6BtucWuqbTP-jOHxXTBlh0UIfjXueOGFCdvSWgux4d5U06kdn4ypdQ099NF6itrVLLmoAx-SGA-0tK_14PEPvb_WVXAK_UjrTx1m9IkTnIyitoGWUJAa6p0bQHGf17ZffWcPFC8YL5JdZCgl-mChLP1w_nkrXrCbY9aAJTOh9Yap7X9rsBAVRh_RIECbwi2tMmcK0l1FbquZSQ3psG7JL-3JAzV-i-7gUGKnVgxJduX79SVDK9WbwQEvjhZ9OLjxO-ss01NDg";

const closeServer = () => {
  server.close();
};

describe("GERENCIADOR ROTAS VEICULOS", () => {
  it("Deve retornar 400 em caso de placa faltando número ou letra", async () => {
    const plate = "QUW551";
    request(server)
      .get(`/veiculos/${plate}/manutencao`)
      .set("Authorization", jwtToken)
      .then((resp) => {
        expect(resp.status).to.eql(400);
        expect(resp.body.message).to.eql(
          "Placa não informada ou com formato incorreto."
        );
        closeServer();
      });
  });

  it("Deve retornar 200 com uma placa válida", async () => {
    const plate = "QUW5516";
    request(server)
      .get(`/veiculos/${plate}/manutencao`)
      .set("Authorization", jwtToken)
      .then((resp) => {
        expect(resp.status).to.eql(200);
        closeServer();
      });
  });

  after(async () => {
    await database.destroy();
  });
});
