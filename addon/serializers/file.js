import Ember from 'ember';
import Serializer from 'ember-data/serializer';
import { delegateTo } from '../utils';

export default Serializer.extend({

  service: Ember.inject.service('fv-manager'),

  normalizeResponse: delegateTo('service.serializer', 'normalizeResponse'),

  serialize: delegateTo('service.serializer', 'serialize'),

  normalize: delegateTo('service.serializer', 'normalize')
});
