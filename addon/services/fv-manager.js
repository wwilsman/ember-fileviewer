import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  store: Ember.inject.service(),

  auth: Ember.Object.create(),

  activeService: 'file-mock',

  adapter: Ember.computed('activeService', function() {
    return this.get('store').adapterFor(this.get('activeService'));
  }).volatile(),

  serializer: Ember.computed('activeService', function() {
    return this.get('store').serializerFor(this.get('activeService'));
  }).volatile(),

  setService(serviceName) {
    this.set('activeService', serviceName);
    this.trigger('updateService', serviceName);
  },

  fetchFiles(query) {
    this.trigger('beforeFetchFiles', query);

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('store').query('file', query).then((files) => {
        files = files.toArray();
        this.trigger('fetchFiles', files);
        Ember.run(null, resolve, files);
      }, (jqXHR) => {
        this.trigger('fetchFilesFail', jqXHR);
        Ember.run(null, reject, jqXHR);
      });
    });
  }
});
