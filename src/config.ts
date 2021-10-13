export class Config {
  private config_data: any = null;

  public configuration() {
    // if the static data was already set. return it
    if (this.config_data != null && this.config_data != undefined) {
      return this.config_data
    }

    this.config_data = {}
    // LOAD JSON
    if (process.env.NODE_ENV === undefined || process.env.NODE_ENV == null) {
      this.config_data = require('./local.json')
    }
    else if (process.env.NODE_ENV === 'development') {
      this.config_data = require('./development.json')
    }
    else if (process.env.NODE_ENV === 'production') {
      this.config_data = require('./production.json')
    }

    return this.config_data;
  }
}
