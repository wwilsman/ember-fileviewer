import Ember from 'ember';
import layout from '../templates/components/fv-services';

export default Ember.Component.extend({

  layout,

  classNames: ['fv-services'],

  classNameBindings: ['isActive'],

  isActive: false,

  service: Ember.inject.service('fv-manager'),

  activeService: Ember.computed('service.activeService', function() {
    return this.get('availableServices').findBy('name', this.get('service.activeService'));
  }),

  availableServices: Ember.A([
    {
      label: 'Memory',
      name: 'file-mock',
      icon: '<i class="database icon"></i>',
    },
    {
      label: 'Dropbox',
      name: 'file-dropbox',
      icon: '<svg viewBox="0 0 900 840.59003"><g transform="matrix(8.1469128,0,0,8.1469128,-242.48759,-272.19257)"><polygon points="63.524,36.479 32.833,56.518 54.054,73.512 85,54.403 " fill="#007ee5"/><polygon points="32.833,90.507 63.524,110.546 85,92.62 54.054,73.512 " fill="#007ee5"/><polygon points="85,92.62 106.476,110.546 137.167,90.507 115.946,73.512 " fill="#007ee5"/><polygon points="137.167,56.518 106.476,36.479 85,54.403 115.946,73.512 " fill="#007ee5"/><polygon points="85.063,96.477 63.524,114.35 54.307,108.332 54.307,115.078 85.063,133.521 115.819,115.078 115.819,108.332 106.602,114.35 " fill="#007ee5"/></g></svg>',
    },
    //{
    //  label: 'Google Drive',
    //  name: 'gdrive-file',
    //  icon: '<svg viewBox="0 0 133156 115341"><g style="transform:scale(0.9)"><polygon fill="#3777E3" points="22194,115341 44385,76894 133156,76894 110963,115341 "/><polygon fill="#FFCF63" points="88772,76894 133156,76894 88772,0 44385,0 "/><polygon fill="#11A861" points="0,76894 22194,115341 66578,38447 44385,0 "/></g></svg>'
    //},
  ]),

  init() {
    this._super(...arguments);

    Ember.$(document).on('click', () => {
      if (this.get('isActive')) {
        this.set('isActive', false);
      }
    });
  },

  click() {
    return false;
  },

  actions: {

    setService(service) {
      this.get('service').setService(service.name);
      this.set('isActive', false);
    }
  }
});
