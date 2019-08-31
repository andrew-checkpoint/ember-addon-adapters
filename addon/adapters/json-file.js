import DS from 'ember-data';
import { Promise } from 'rsvp';

export default DS.RESTAdapter.extend({
	url: null,
	buildURL() {
		const url = this.get('url');
		if(url !== null) {
			return url;
		}
		let defaultUrl = this._super(...arguments);
		return `${defaultUrl}.json`;
	},
	findRecord: function(store, modelClass, id) {
		return new Promise(async (resolve)=>{
			let results = await this.query(store, modelClass, { id });
			let result = results[modelClass.modelName][0];
			resolve({
				[modelClass.modelName]: result
			});
		});
	},
	createRecord: function(/*store, modelClass, snapshot*/){
		return Promise.reject(new Error('Cannot persist JSON storage'));
	},
	updateRecord: function(/*store, modelClass, snapshot*/){
		return Promise.reject(new Error('Cannot persist JSON storage'));
	},
	deleteRecord: function(/*store, modelClass, snapshot*/){
		return Promise.reject(new Error('Cannot persist JSON storage'));
	},
	findAll: function(/*store, modelClass*/) {
		return this._super(...arguments);
	},
	query: function(store, modelClass, query = {}){
		return new Promise(async (resolve)=>{
			let response = {};

			let records = null;
			try{
				records = await this.findAll(store, modelClass);
				records = records[modelClass.modelName];
			} catch(err) {
				throw err;	
			}

			if( query && Object.keys(query).length>0){
				records = records.filter( (record)=>{
					return !Object.keys(query).find( (key)=>{
						let matcher = query[key];

						if(matcher instanceof RegExp){
							return !matcher.test(record[key])
						} else if(key === 'id') {
							return  `${matcher}` !== `${record[key]}`;
						} else {
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
