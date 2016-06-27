import Ember from 'ember';
import layout from '../templates/components/fv-actionbar';

export default Ember.Component.extend({

  layout,

  classNames: ['fv-actionbar'],

  selection: Ember.computed.alias('viewer.selection'),

  fileSelection: Ember.computed.filterBy('selection', 'isFolder', false),

  validSelection: Ember.computed.filterBy('fileSelection', 'inTrash', false),

  isOnlyTopSelected: Ember.computed('selection.[]', 'viewer.parent', function() {
    return this.get('selection.length') === 1 &&
      this.get('selection').indexOf(this.get('viewer.parent')) > -1;
  }),

  isSelectionTrash: Ember.computed('selection.@each.inTrash', function() {
    return this.get('selection.length') &&
      this.get('selection').every((f) => f.get('inTrash'));
  }),

  actions: {

    confirmSelection() {
      this.get('viewer').sendAction('on-confirm', this.get('validSelection'));
    },

    deleteSelection() {
      let selection = this.get('selection');
      let files = this.get('viewer.files');

      let showTrash = this.get('viewer.showTrash');
      let toDelete = selection.filterBy('inTrash', false);

      if (!toDelete.length) {
        toDelete = selection;
      }

      toDelete.forEach((f) => {
        if (!f.get('inTrash')) {
          f.set('inTrash', true);
        } else {
          f.deleteRecord();
        }

        f.save().then((f) => {
          if (f.get('isDeleted') || (f.get('inTrash') && !showTrash)) {
            files.removeObject(f);
            selection.removeObject(f);
          }
        });
      });
    },

    restoreSelection() {
      this.get('selection').forEach((f) => {
        f.set('inTrash', false);
        f.save();
      });
    }
  }
});
