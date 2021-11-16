import decode from "jwt-decode";

export interface ITokenAdClaims {
  oid: string;
}

class TokenAd {
  getClaims(token: string): ITokenAdClaims {
    return decode(token);
  }
}

export default new TokenAd();
