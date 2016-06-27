import Ember from 'ember';

const SIZES = ['B', 'KB', 'MB', 'GB'];

export function formatBytes(params) {
  let num = params[0] || 0;
  let l = 0;

  while (num > 1024) {
    num /= 1024;
    l += 1;
  }

  return Math.round(num) + ' ' + SIZES[l];
}

export default Ember.Helper.helper(formatBytes);
