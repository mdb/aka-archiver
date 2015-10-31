module.exports = {
  domains: function() {
    return '/config-gtm/v1/domains';
  },

  domain: function(domain) {
    return this.domains() + '/' + domain;
  },

  properties: function(domain) {
    return this.domain(domain) + '/properties';
  },

  dataCenters: function(domain) {
    return this.domain(domain) + '/datacenters';
  },

  datacenters: function(domain) {
    return this.dataCenters(domain);
  }
};
