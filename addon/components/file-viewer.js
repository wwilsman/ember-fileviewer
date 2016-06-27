import Ember from 'ember';
import layout from '../templates/components/file-viewer';
import DroppableMixin from '../mixins/droppable';

export default Ember.Component.extend(DroppableMixin, {

  layout,

  classNames: ['fv', 'fv-modal'],

  classNameBindings: ['isLoading'],

  store: Ember.inject.service(),

  service: Ember.inject.service('fv-manager'),

  title: 'File Viewer',

  allowMultiple: true,

  sortBy: ['name'],

  viewLayout: 'grid',

  showTrash: false,

  parent: null,

  files: Ember.A(),

  selection: Ember.A(),

  isLoading: true,

  titlebar: Ember.computed('title', 'parent.name', function() {
    let title = this.get('title');
    let parentName = this.get('parent.name');
    return parentName ? `${title} (${parentName})` : title;
  }),

  init() {
    let service = this.get('service');

    service.on('updateService', this, 'refreshFiles');

    service.on('beforeFetchFiles', () => {
      this.setProperties({
        isLoading: true,
        files: Ember.A()
      });
    });

    service.on('fetchFiles', (files) => {
      this.setProperties({
        isLoading: false,
        files
      });
    });

    this._super(...arguments);
    this.refreshFiles();
  },

  refreshFiles: Ember.observer('parent', 'showTrash', function() {
    this.get('service').fetchFiles({
      parent: this.getWithDefault('parent.id', null),
      includeDeleted: this.get('showTrash')
    });
  }),

  selectFile(model, method = 'replace') {
    let files = this.get('files');
    let selection = this.get('selection');
    let isSelected = selection.indexOf(model) > -1;
    let lastIndex = files.indexOf(this.get('lastSelected'));

    if (!model) {
      selection.clear();
      return;
    }

    if (!this.get('allowMultiple')) {
      method = 'replace';
    }

    if ((method === 'remove' || method === 'toggle') && isSelected) {
      selection.removeObject(model);

    } else if ((method === 'add' || method === 'toggle') && !isSelected) {
      selection.addObject(model);

    } else if (method === 'range' && lastIndex > -1) {
      let index = files.indexOf(model);
      selection.setObjects(index > lastIndex ?
        files.slice(lastIndex, index + 1) :
        files.slice(index, lastIndex + 1));

    } else {
      selection.setObjects([model]);
    }

    if (method !== 'range' || lastIndex === -1) {
      this.set('lastSelected', model);
    }
  },

  clearSelection() {
    this.get('selection').clear();
  },

  openFile(model, keepSelection) {
    if (model.get('isFolder')) {
      this.set('parent', model);
    } else if (model.get('content') === null) {
      this.set('parent', null);
    } else {
      this.sendAction('on-confirm', model);
    }

    if (!keepSelection) {
      this.clearSelection();
    }
  }
});
