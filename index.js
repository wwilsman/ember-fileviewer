/* jshint node: true */
'use strict';

module.exports = {

  name: 'fileviewer',

  included: function(app) {
    this._super.included(app);
  },

  contentFor: function(type) {
    if (type === 'head') {
      return '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/components/icon.min.css">';
    }
  }
};
