import Ember from 'ember';
import Adapter from 'ember-data/adapter';
import { delegateTo } from '../utils';

export default Adapter.extend({

  defaultSerializer: '-defualt',

  service: Ember.inject.service('fv-manager'),

  findRecord: delegateTo('service.adapter', 'findRecord'),

  createRecord: delegateTo('service.adapter', 'createRecord'),

  updateRecord: delegateTo('service.adapter', 'updateRecord'),

  deleteRecord: delegateTo('service.adapter', 'deleteRecord'),

  findAll: delegateTo('service.adapter', 'findAll'),

  query: delegateTo('service.adapter', 'query'),

  findMany: delegateTo('service.adapter', 'findMany')
});
