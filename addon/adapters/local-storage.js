import DS from 'ember-data';
import { Promise } from 'rsvp';

function getAllRecordsOfType(recordType, ns=''){
	return Object.keys(localStorage).filter( (key)=>{
		return key.slice( 0, `${ns}${recordType}`.length ) === `${ns}${recordType}`;
	} ).map( (key)=>{
		return JSON.parse( localStorage.getItem(`${key}`) );
	} )
}

function getRecordOfType(recordType, id, ns='') {
	let record = localStorage.getItem(`${ns}${recordType}_${id}`);
	return JSON.parse(record);
}

function saveRecord(snapshot, ns=''){
	let id = snapshot.id;
	let serialized = snapshot.serialize();
	if( !id){
		id = getNextId(ns);
	}
	serialized.id = id;
	localStorage.setItem( `${ns}${snapshot.modelName}_${id}`, JSON.stringify( serialized ));
	return serialized;
}

function removeRecord(snapshot, ns=''){
	let id = snapshot.id;
	localStorage.removeItem( `${ns}${snapshot.modelName}_${id}` )
}

function getNextId(ns=''){
	let nextId = localStorage.getItem(`${ns}recordIdentifier`) || 0;
	nextId++;
	localStorage.setItem(`${ns}recordIdentifier`, nextId);
	return nextId;
}

export default DS.RESTAdapter.extend({
	namespace: 'ember_store_',
	findRecord: function(store, modelClass, id) {
		return new Promise( (resolve)=>{
			let r = getRecordOfType(modelClass.modelName, id, this.namespace);
			let response = {};
			response[modelClass.modelName] = [r];
			resolve( response );
		});
	},
	createRecord: function(store, modelClass, snapshot){
		return new Promise( (resolve)=>{
			let response = {};
			response[modelClass.modelName] = saveRecord(snapshot, this.namespace);
			resolve( response );
		} );
	},
	updateRecord: function(store, modelClass, snapshot){
		return new Promise( (resolve)=>{
			let response = {};
			response[modelClass.modelName] = saveRecord(snapshot, this.namespace);
			resolve( response );
		} );
	},
	deleteRecord: function(store, modelClass, snapshot){
		return new Promise( (resolve)=>{
			let response = {};
			response[modelClass.modelName] = removeRecord(snapshot, this.namespace);
			resolve(true);
		} );
	},
	findAll: function(store, modelClass){
		return this.query(store, modelClass);
	},
	query: function(store, modelClass, query){
		return new Promise( (resolve)=>{
			let response = {};

			let records = getAllRecordsOfType(modelClass.modelName, this.namespace);

			if( query && Object.keys(query).length>0){
				records = records.filter( (record)=>{
					return !Object.keys(query).find( (key)=>{
						let matcher = query[key];
						if(typeof matcher === "object"){
							return !matcher.test(record[key])
						}else{
							return  matcher !== record[key];
						}
					} );
				} );
			}
			response[modelClass.modelName] = records.sort( (a,b)=> +a.id<+b.id?1:-1  );
			resolve( response );
		} );

	},
});
