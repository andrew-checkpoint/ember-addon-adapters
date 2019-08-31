import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

function setupResetStorage() {
  localStorage.clear();
}
function setupItems() {
  localStorage.setItem('test_personperson_1', '{"id": "1", "firstName": "Test 1"}');
  localStorage.setItem('test_personperson_2', '{"id": "2", "firstName": "Test 2"}');
  localStorage.setItem('test_personperson_3', '{"id": "3", "firstName": "Test 3"}');
  localStorage.setItem('test_personperson_4', '{"id": "4", "firstName": "Test 4"}');
  localStorage.setItem('test_personperson_5', '{"id": "5", "firstName": "Test 5"}');
  localStorage.setItem('test_personrecordIdentifier', '5');
}

module('Unit | Adapter | local-storage', function(hooks) {
  setupTest(hooks);

  // Specify the other units that are required for this test.
  test('should save record', function(assert) {
    setupResetStorage();

    const person = run(() => this.owner.lookup('service:store').createRecord('person'));

    person.set('firstName', 'Test');

    // wrap asynchronous call in run loop
    run(() => person.save());

    assert.equal(localStorage.test_personrecordIdentifier, 1, 'store contains 1 saved item');

    assert.equal(person.get('id'), '1', 'record has an id');
  });



  test('should fetch records', function(assert) {
    setupResetStorage();
    setupItems();

    const people = run(() => this.owner.lookup('service:store').findAll('person'));

    assert.equal(people.length, '5', 'store has items');

  });

  test('should find record', async function(assert) {
    setupResetStorage();
    setupItems();

    const person = run(() => this.owner.lookup('service:store').findRecord('person', '1'));
    await person;

    console.log(person); 

    assert.equal(person.get('id'), '1', 'store has record');

  });


  /*test('should fetch record', function(assert) {
    setupResetStorage();
    setupItems();

    const person = run(() => this.owner.lookup('service:store').findRecord('person', '1'));

    assert.equal(person.id, '1', 'store has record');

  });*/
});