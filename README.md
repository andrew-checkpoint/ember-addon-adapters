store-adapters
==============================================================================

Description
------------------------------------------------------------------------------

Adds 2 rest adapters local-storage & json-file





Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

Add to your package.json

```
"ember-adapters": https://github.com/andrew-checkpoint/ember-addon-adapters.git#master"
```


Usage
------------------------------------------------------------------------------

### Local Storage

An adapter that stores records using browsers localStorage. 

Supports

1. findRecord
1. findAll
1. query
1. createRecord
1. updateRecord
1. deleteRecord

#### Configuration

namespace: prefixes localStorage keys to avoind conflicts default: "ember_store_"

#### Example

`model.js`

```
import LocalStorageAdapter from 'ember-adapters/adapters/local-storage';

export default LocalStorageAdapter.extend({
	namespace: 'ds_'	
});

```

### JSON file

Adapter that reads static .json files.

Record file looks for file in `${host}/${namespace}/${modelPlural}.json`
Reopen/Extend `url` property to point to a custom url.

Supports

1. findRecord
1. findAll
1. query

#### Configuration

url: URL where to request .json file.


#### Example

`models/fruit.js`

```
import JsonFileAdapter from 'ember-adapters/adapters/json-file';

export default JsonFileAdapter.extend({
});

```

`public/fruit.json`
```
{
	"fruit": [
		{
			"id": 1,
			"name": "apple"
		}, 
		...
	]
}
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
