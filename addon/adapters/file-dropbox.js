import Ember from 'ember';
import FileAdapter from './file';

export default FileAdapter.extend({

  service: Ember.inject.service('fv-manager'),

  authenticate() {
    let token = 'YJKUaPwWzN4AAAAAAAADJekYgjJpH1laIMtR3aNN3fAqUftZj_WgSgMI4_zNOyi5';
    return this.set('service.auth.dropbox', token);
  },

  authToken: Ember.computed('service.auth.dropbox', function() {
    let token = this.get('service.auth.dropbox');
    return token || this.authenticate();
  }),

  listFolder(path) {
    let url = 'https://api.dropboxapi.com/2/files/list_folder';
    let authHeader = `Bearer ${this.get('authToken')}`;
    let query = { path, include_media_info: true };

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax({
        url,
        method: 'post',
        processData: false,
        data: JSON.stringify(query),
        contentType: 'application/json',
        headers: { Authorization: authHeader },
      }).then((data) => {
        const supported = /\.(jpg|jpeg|png|tiff|tif|gif|bmp)$/;

        data.entries.forEach((entry) => {
          if (entry['.tag'] === 'file' && entry.name.match(supported)) {
            let store = this.store;

            let req = new XMLHttpRequest();
            req.open('POST', 'https://content.dropboxapi.com/2/files/get_thumbnail');
            req.setRequestHeader('Authorization', authHeader);
            req.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
              path: entry.path_lower
            }));

            req.onload = function() {
              if (this.status === 200) {
                let url = URL.createObjectURL(this.response);
                let e = store.peekRecord('file', entry.id);
                e.set('thumbnail', url);
              }
            };

            req.responseType = 'blob';
            req.send();
          }
        });

        Ember.run(null, resolve, data);
      }, (jqXHR) => {
        jqXHR.then = null;
        Ember.run(null, reject, jqXHR);
      });
    });
  },

  findAll() {
    return this.listFolder('');
  },

  query(store, modelName, options) {
    let path = '';

    if (options.parent) {
      let folder = store.peekRecord('file', options.parent);
      path = folder.get('path');
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.listFolder(path).then((data) => {
        data.entries.forEach((entry) => {
          entry.parent = options.parent;
        });

        Ember.run(null, resolve, data);
      }, (jqXHR) => {
        jqXHR.then = null;
        Ember.run(null, reject, jqXHR);
      });
    });
  }
});
