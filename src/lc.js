
// This is a singleton class which contains global/config stuff
//
//  No function should go in here, probably due to the singleton stuff but we
//  need to verify this

class LC {

  constructor() {
    this.version = '0.1.0';
    this.audio = null;
  }

}

export default (new LC);

