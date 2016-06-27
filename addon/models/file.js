import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({

  name: attr('string', { defaultValue: '' }),

  path: attr('string', { defaultValue: '' }),

  url: attr('string', { defaultValue: '' }),

  thumbnail: attr('string', { defaultValue: '' }),

  filetype: attr('string', { defaultValue: '' }),

  size: attr('number', { defaultValue: 0 }),

  isFolder: attr('boolean', { defaultValue: false }),

  inTrash: attr('boolean', { defaultValue: false }),

  modified: attr('date', { defaultValue: () => new Date() }),

  parent: belongsTo('file', { inverse: null, defaultValue: null })
});
