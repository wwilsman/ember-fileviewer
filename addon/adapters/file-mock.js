import Ember from 'ember';
import FileAdapter from './file';

export default FileAdapter.extend({

  findAll() {
    return new Ember.RSVP.Promise((resolve) => {
      Ember.run(null, resolve, FIXTURES);
    });
  },

  query(store, type, query) {
    return new Ember.RSVP.Promise((resolve) => {
      let results = FIXTURES;
      let filters = {
        parent: query.parent
      };

      if (!query.includeDeleted) {
        filters.inTrash = false;
      }

      Object.keys(filters).forEach((q) => {
        results = Ember.A(results.filterBy(q, filters[q]));
      });

      Ember.run(null, resolve, results);
    });
  },

  createRecord(store, type, snapshot) {
    let data = this.serialize(snapshot, { includeId: true });

    if (!data.id) {
      data.id = FIXTURES.mapBy('id').reduce((c, n) => {
        return Math.max(c, parseInt(n, 10));
      }, 0) + 1;
    }

    return new Ember.RSVP.Promise((resolve) => {
      Ember.run(null, resolve, FIXTURES.pushObject(data));
    });
  },

  updateRecord(store, type, snapshot) {
    let data = this.serialize(snapshot, { includeId: true });
    let record = FIXTURES.findBy('id', data.id);

    if (record) {
      Ember.assign(record, data);
    }

    return new Ember.RSVP.Promise((resolve) => {
      Ember.run(null, resolve, record);
    });
  },

  deleteRecord(store, type, snapshot) {
    let data = this.serialize(snapshot, { includeId: true });
    let record = FIXTURES.findBy('id', data.id);

    if (record) {
      delete FIXTURES[FIXTURES.indexOf(record)];
    }

    return new Ember.RSVP.Promise((resolve) => {
      Ember.run(null, resolve, record);
    });
  },
});

const FIXTURES = Ember.A([
  {
    "id": "1",
    "name": "New Folder",
    "parent": null,
    "mimetype": "application/folder",
    "modified": "2016-06-02T00:00:00",
    "inTrash": false,
    "isFolder": true,
    "size": 0
  },
  {
    "id": "2",
    "name": "Image 1",
    "parent": null,
    "thumbnail": "http://unsplash.it/80?random=1",
    "mimetype": "image/png",
    "modified": "2016-06-02T00:00:00",
    "inTrash": false,
    "size": 708
  },
  {
    "id": "3",
    "name": "Image 2",
    "parent": null,
    "thumbnail": "http://unsplash.it/80?random=2",
    "mimetype": "image/png",
    "modified": "2016-06-02T00:00:00",
    "inTrash": false,
    "size": 708
  },
  {
    "id": "4",
    "name": "Image 3",
    "parent": "1",
    "thumbnail": "http://unsplash.it/80?random=3",
    "mimetype": "image/png",
    "modified": "2016-06-02T00:00:00",
    "inTrash": false,
    "size": 708
  },
  {
    "id": "5",
    "name": "Image 4",
    "parent": null,
    "thumbnail": "http://unsplash.it/80?random=4",
    "mimetype": "image/png",
    "modified": "2016-06-02T00:00:00",
    "inTrash": true,
    "size": 708
  }
]);
