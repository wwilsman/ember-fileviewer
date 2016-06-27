import Ember from 'ember';
import layout from '../templates/components/fv-toolbar';

export default Ember.Component.extend({

  layout,

  classNames: ['fv-toolbar'],

  store: Ember.inject.service(),

  sortOptions: [
    { label: 'A - Z', value: 'name:asc' },
    { label: 'Z - A', value: 'name:desc' },
    { label: 'Recent', value: 'modified:desc' },
    { label: 'Oldest', value: 'modified:asc' }
  ],

  activeSort: Ember.computed.alias('viewer.sortBy'),

  layoutOptions: [
    { name: 'grid', icon: 'block layout icon' },
    { name: 'list', icon: 'list layout icon' }
  ],

  activeLayout: Ember.computed.alias('viewer.viewLayout'),

  showTrash: Ember.computed.alias('viewer.showTrash'),

  showMenu: Ember.computed.alias('viewer.showMenu'),

  actions: {

    newFolder() {
      let name = 'New Folder';
      let nameReg = new RegExp(`^${name}(\\s\\d+)?$`);
      let viewer = this.get('viewer');
      let dup = false;

      if (viewer.get('parent.isDeleted')) {
        return;
      }

      viewer.get('files').filterBy('isFolder', true).forEach((f) => {
        let m = f.get('name').match(nameReg);

        if (m) {
          let i = parseInt(m[1], 10);
          dup = Math.max(isNaN(i) ? 0 : i, dup);
        }
      });

      name = dup !== false ? `${name} ${dup + 1}` : name;

      let folder = this.get('store').createRecord('file', {
        parent: viewer.get('parent'),
        modified: new Date(),
        isFolder: true,
        name,
      });

      folder.save().then((f) => {
        viewer.get('files').addObject(f);
      });

      viewer.clearSelection();
    }
  }
});
