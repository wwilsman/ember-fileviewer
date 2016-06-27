import Ember from 'ember';

export default Ember.Mixin.create({

  classNameBindings: ['isDropTarget'],

  canAcceptDrop() {
    return true;
  },

  acceptDrop() {
    return true;
  },

  isDropTarget: false,

  dragOver(e) {
    if (this.canAcceptDrop(e)) {
      this.set('isDropTarget', true);
      e.preventDefault();
    }
  },

  dragEnter(e) {
    if (this.canAcceptDrop(e) &&
        this.incrementProperty('_dragEnterCount') === 1) {
      return true;
    }
  },

  dragLeave(e) {
    if (this.canAcceptDrop(e) &&
        this.decrementProperty('_dragEnterCount') === 0) {
      this.resetDroppability();
      return true;
    }
  },

  drop(e) {
    if (this.canAcceptDrop(e)) {
      this.resetDroppability();

      if (this.acceptDrop(e) === false) {
        e.stopPropagation();
        return false;
      }
    }
  },

  resetDroppability() {
    this.set('_dragEnterCount', 0);
    this.set('isDropTarget', false);
  }
});
