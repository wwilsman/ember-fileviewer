import Ember from 'ember';
import layout from '../templates/components/fv-filelist';
import DroppableMixin from '../mixins/droppable';

export default Ember.Component.extend(DroppableMixin, {

  layout,

  classNames: ['fv-filelist'],

  classNameBindings: ['layoutClass'],

  layoutClass: Ember.computed('viewer.viewLayout', function() {
    return `fv-filelist--${this.get('viewer.viewLayout')}`;
  }),

  dragging: Ember.A(),

  selection: Ember.computed.reads('viewer.selection'),

  sorted: Ember.computed.sort('viewer.files', 'sortByFolders'),

  sortByFolders: Ember.computed('viewer.sortBy', function() {
    return ['isFolder:desc'].concat(this.get('viewer.sortBy'), 'name');
  }),

  click() {
    this.get('viewer').clearSelection();
  },

  canAcceptDrop(e) {
    return (this.$().is(e.target) || this.$(e.target).length) &&
      e.originalEvent.dataTransfer.types.indexOf('text/x-fv-file') > -1;
  },

  acceptDrop() {
    this.moveSelectionHere();
    this.clearGhosts();
  },

  dragStart(e) {
    let $sel = this.$('.fv-file.is-selected');
    let box = $sel.map((i, el) => el.getBoundingClientRect());
    let $ghosts = $sel.clone().addClass('is-ghost');
    $sel.addClass('is-dragging');

    $ghosts.each((i) => {
      $ghosts.eq(i).css({
        position: 'fixed',
        width: box[i].width + 'px',
        height: box[i].height + 'px',
        pointerEvents: 'none',
        zIndex: 999,
      });
    });

    e = e.originalEvent;

    const fake = this.$('<div>').get(0);
    e.dataTransfer.setDragImage(fake, 0, 0);

    this.setProperties({
      $ghosts,
      ghostBoxes: box,
      ghostOrigin: {
        x: e.screenX,
        y: e.screenY
      }
    });

    this.get('dragging').setObjects(this.get('selection'));

    this.positionGhosts(e.screenX, e.screenY).appendTo('body');

    Ember.$(document).off('dragover.fv, dragend.fv, drop.fv')
      .on('dragover.fv', (e) => {
        this.positionGhosts(
          e.originalEvent.screenX,
          e.originalEvent.screenY
        );
      })
      .on('dragend.fv, drop.fv', () => {
        Ember.$(document).off('dragover.fv, dragend.fv, drop.fv');
        this.clearGhosts();
      });
  },

  clearGhosts() {
    let $ghosts = this.get('$ghosts');

    if ($ghosts) {
      $ghosts.remove();
      this.setProperties({
        ghostBoxes: null,
        ghostOrigin: null,
        $ghosts: null
      });
    }

    this.$('.fv-file.is-dragging').removeClass('is-dragging');
    this.get('dragging').clear();
  },

  positionGhosts(x, y) {
    let box = this.get('ghostBoxes');
    let origin = this.get('ghostOrigin');
    let $ghosts = this.get('$ghosts');

    if (box && origin && $ghosts) {
      return $ghosts.each((i) => {
        $ghosts.eq(i).css({
          top: box[i].top - (origin.y - y) + 'px',
          left: box[i].left - (origin.x - x) + 'px',
        });
      });
    }

    return this.$([]);
  },

  dragEnd() {
    this.clearGhosts();
  },

  dragEnter(e) {
    this.positionGhosts(
      e.originalEvent.screenX,
      e.originalEvent.screenY
    ).css('visibility', 'visible');
  },

  dragLeave(e) {
    if (this._super(...arguments)) {
      this.positionGhosts(
        e.originalEvent.screenX,
        e.originalEvent.screenY
      ).css('visibility', 'hidden');
    }
  },

  moveSelectionHere() {
    this.moveSelectionTo(this.get('viewer.parent'));
  },

  moveSelectionTo(model) {
    let files = this.get('viewer.files');
    let selection = this.get('selection');
    let parent = this.get('viewer.parent');

    this.clearGhosts();

    selection.forEach((f) => {
      f.get('parent').then((p) => {
        if (p !== model) {
          f.set('parent', model);
          f.save().then(() => {
            if (parent === model) {
              files.addObject(f);
            } else {
              files.removeObject(f);
              selection.removeObject(f);
            }
          });
        }
      });
    });
  }
});
