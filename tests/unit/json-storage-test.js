import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';


module('Unit | Adapter | json-storage', function(hooks) {
  setupTest(hooks);
  
  test('should findAll', async function(assert) {
    
    const fruit = run(() => this.owner.lookup('service:store').findAll('fruit'));
    
    await fruit;

    assert.equal(fruit.length, 3, 'store has items');

  });

  test('should findRecord', async function(assert) {
    
    const fruit = run(() => this.owner.lookup('service:store').findRecord('fruit', 1));
    
    await fruit;

    assert.equal(fruit.get('id'), '1', 'response has id 1');
    assert.equal(fruit.get('name'), 'Apple', 'response has correct name');

  });

  test('should query', async function(assert) {
    
    const fruit = run(() => this.owner.lookup('service:store').query('fruit', { name: 'Banana'}));
    await Promise.resolve(fruit);

    assert.equal(fruit.length, 1, 'store has items');

    const fruitItem = fruit.get('firstObject');

    assert.equal(fruitItem.get('id'), '3', 'response has id 3');
    assert.equal(fruitItem.get('name'), 'Banana', 'response has correct name');

  });

  test('should not create', async function(assert) {
    
    const fruit = run(() => this.owner.lookup('service:store').createRecord('fruit'));
    
    await Promise.resolve(fruit);

    const f = fruit;
  
    f.set('name', '???');

    assert.throws(f.save, Error, 'Create should throw error')
  });

  test('should not save', async function(assert) {
    
    const fruit = run(() => this.owner.lookup('service:store').findRecord('fruit', 1));
    
    await Promise.resolve(fruit);

    const f = fruit.content;

    f.set('name', '???');

    assert.throws(f.save, Error, 'Save should throw error')
  });

  test('should not delete', async function(assert) {
    
    const fruit = run(() => this.owner.lookup('service:store').findRecord('fruit', 1));
    
    await Promise.resolve(fruit);

    const f = fruit.content;

    f.deleteRecord();

    assert.throws(f.save, Error, 'Delete should throw error')
  });

/* 
  
  // Specify the other units that are required for this test.
  test('should get records', function(assert) {
  
    const person = run(() => this.owner.lookup('service:store').findRecords('person'));

    person.set('firstName', 'Test');

    // wrap asynchronous call in run loop
    run(() => person.save());

    assert.equal(localStorage.test_personrecordIdentifier, 1, 'store contains 1 saved item');

    assert.equal(person.get('id'), '1', 'record has an id');
  });

  test('should fetch record', function(assert) {
  	setupResetStorage();
  	setupItems();

    const person = run(() => this.owner.lookup('service:store').findRecord('person', '1'));

    assert.equal(person.id, '1', 'store has record');

  });*/


  /*test('should fetch record', function(assert) {
  	setupResetStorage();
  	setupItems();

    const person = run(() => this.owner.lookup('service:store').findRecord('person', '1'));

    assert.equal(person.id, '1', 'store has record');

  });*/
});