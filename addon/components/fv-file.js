import Ember from 'ember';
import layout from '../templates/components/fv-file';
import DroppableMixin from '../mixins/droppable';

export default Ember.Component.extend(DroppableMixin, {

  layout,

  classNames: ['fv-file'],

  classNameBindings: ['isFolder', 'isGrandparent', 'isDetailed', 'isSelected', 'isEditing', 'inTrash'],

  attributeBindings: ['draggable'],

  draggable: Ember.computed.not('isGrandparent'),

  isFolder: Ember.computed.alias('model.isFolder'),

  isDetailed: Ember.computed.equal('viewer.viewLayout', 'list'),

  isEditing: false,

  inTrash: Ember.computed('model.inTrash', 'viewer.parent.inTrash', function() {
    return this.get('model.inTrash') || this.get('viewer.parent.inTrash');
  }),

  isSelected: Ember.computed('viewer.selection.[]', 'model', function() {
    return this.get('viewer.selection').indexOf(this.get('model')) > -1;
  }),

  isOnlySelected: Ember.computed('isSelected', function() {
    return this.get('isSelected') && this.get('viewer.selection.length') === 1;
  }),

  isGrandparent: Ember.computed('viewer.parent.parent', 'model', function() {
    return this.get('viewer.parent.parent') === this.get('model');
  }),

  newName: Ember.computed.oneWay('model.name'),

  growNameField: Ember.observer('newName', function() {
    let $field = this.$('.fv-file-input');

    const $mock = this.$('<div>').css({
      position: 'fixed',
      top: '-9999px',
      left: '-9999px',
      overflow: 'hidden',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      height: '0px',
    });

    if ($field.is('textarea')) {
      $mock.appendTo('body').css({
        font: $field.css('font'),
        padding: $field.css('padding'),
        border: $field.css('border'),
        width: $field.css('width'),
      }).text(this.get('newName')||' ');

      Ember.run.next(() => {
        $field.css('height', $mock.prop('scrollHeight') +
          parseInt($field.css('border-top-width'), 10) +
          parseInt($field.css('border-bottom-width'), 10));
        $mock.remove();
      });
    }
  }),

  triggerEditing() {
    if (!this.get('isGrandparent')) {
      this.set('isEditing', true);
      Ember.run.next(() => {
        let input = this.$('.fv-file-input');
        if (input) { input.select(); }
        this.growNameField();
      });
    }
  },

  click(e) {
    let now = new Date().getTime();
    let ellapsed = now - this.get('_clickTime');
    this.set('_clickTime', now);

    if (this.get('isEditing')) {
      return false;
    }

    let selectMethod = (e.ctrlKey||e.metaKey) ? 'toggle' : e.shiftKey ? 'range' : 'replace';

    if (
      selectMethod === 'replace' &&
      this.get('isOnlySelected') &&
      !this.get('isGrandparent') &&
      ellapsed < 1500
    ) {
      this.set('_editTimeout', Ember.run.later(this, 'triggerEditing', 150));
      return false;
    }

    this.get('viewer').selectFile(this.get('model'), selectMethod);

    if (document.selection && document.selection.empty) {
      document.selection.empty();
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }

    return false;
  },

  doubleClick() {
    Ember.run.cancel(this.get('_editTimeout'));
    this.get('viewer').openFile(this.get('model'));
  },

  canAcceptDrop(e) {
    return (this.get('isFolder') || this.get('isGrandparent')) && !this.get('isDragging') &&
      e.originalEvent.dataTransfer.types.indexOf('text/x-fv-file') > -1;
  },

  acceptDrop() {
    Ember.run.cancel(this.get('_dragEnterTimer'));
    this.sendAction('on-drop', this.get('model'));
    return false;
  },

  dragStart(e) {
    if (!this.get('isSelected')) {
      this.get('viewer').selectFile(this.get('model'));
    }

    let dataList = e.originalEvent.dataTransfer.items;

    this.get('viewer.selection').forEach((f) => {
      dataList.add(f.get('id'), 'text/x-fv-file');
    });
  },

  dragEnd() {
    Ember.run.cancel(this.get('_dragEnterTimer'));
  },

  dragEnter() {
    if (this._super(...arguments)) {
      this.set('_dragEnterTimer', Ember.run.later(() => {
        this.get('viewer').openFile(this.get('model'), true);
      }, 1000));
    }
  },

  dragLeave() {
    if (this._super(...arguments)) {
      Ember.run.cancel(this.get('_dragEnterTimer'));
    }
  },

  actions: {

    save() {
      let model = this.get('model');
      let oldName = model.get('name');
      let newName = this.get('newName').trim();
      let existing = this.get('viewer.files').any((f) => {
        return f.get('name') === newName;
      });

      if (!newName || newName === oldName || existing) {
        return this.send('cancelEditing');
      }

      model.set('name', newName);
      model.save().then(() => {
        this.set('isEditing', false);
        this.$().focus();
      });
    },

    cancelEditing() {
      this.set('newName', this.get('model.name'));
      this.set('isEditing', false);
      this.$().focus();
    },

    preventNewline(n, e = n) {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.send('save');
      }
    }
  }
});
