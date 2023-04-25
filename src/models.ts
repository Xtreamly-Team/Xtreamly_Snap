export class VCModel {
  raw_string;
  vc;
  proof;
  did;
  data;
  issuer;

  constructor(raw_string, vc, proof, did, data, issuer) {
    this.raw_string = raw_string;
    this.vc = vc;
    this.proof = proof;
    this.did = did;
    this.data = data;
    this.issuer = issuer;
  }

  toString() {
      return `
      vc: ${this.vc},
      proof: ${this.proof},
      did: ${this.did},
      data: ${this.data},
      issuer: ${this.issuer},
      `;
  }
}
