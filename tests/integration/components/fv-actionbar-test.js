import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fv-actionbar', 'Integration | Component | fv actionbar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{fv-actionbar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#fv-actionbar}}
      template block text
    {{/fv-actionbar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
