# ProtoAPI

This library sets a thin layer on top of the ProtoAPI's REST end-points to allow simple access to platform services from javascript. 
[ProtoAPI](http://protoapi.com) is a cloud platform where you can store json objects with a easy to use REST interface.


## Download

Grab the lastest version of protoapi.js [here](https://github.com/TraxNet/protoapi.js)


## Using ProtoAPI in your Javascript application

Adding protoapi.js is a matter of adding an script reference to protoapi.js file or protoapi.min.js to your application. For example using HTML markup:

	<script src="" type="javascript"></script>

Before you can start working with ProtoAPI you need to set your appid and appkey for the App you want to use. You can review your App's information at ProtoAPI's Dev Center page here. 

Protoapi's constructor take either a configuration object or an string. When a configuration object is passed, options will be read and set as globals for the subsequent calls to protoapi.js. If an string is passed, it will be used as the classname for the current api call. For example:
	
	// Configure protoapi.js
	// Next calls will be configured to perform call to this AppID
	protoapi( { appid: "4f2b8c5d3dcd200e6900005e", appkey: "25b0aa7b3cde834b90ca30a15ed03b9c" } );

	// Get some objects from 'posts' collection
	protoapi( 'posts' ).get({}, function( response ){ // your callback code goes here });

	// Get objects matching 'ProtoAPI\'s backed' as their title and classname equal to 'posts'
	protoapi( 'posts' ).get({ title: 'ProtoAPI\'s backend }, function( response ){ // your callback code goes here });


## Adding objects

To upload to ProtoAPI any javascript objects that can be converted to json simply call protoapi.post or protoapi.save and a new
request will be issued asynchronously. 

	// Create some data in ProtoAPI
	protoapi( 'operation' ).post( { type: '+', left_side: 'var01', right_side: 5 }, function( response ){} );

	// Save (create or update) some data into ProtoAPI's object store
	protoapi( 'operations' ).post( { type: '-', left_ise: 'var01', right_side: 2}, function( response ){} );

Using 'save' flavour will handle creation (POST) and updates (PUT) depending if the passed object contains an '_id' field. If a new object is created, its id will be saved withing the client-side object before calling the callback.


## Getting objects

Searching for objects is accomplished using protoapi.get fir a filter object as first argument. A wide range of query operands are supported, please check [ProtoAPI's documentation](http://protoapi.com/docs/queries) on how to perform complex queries using filter objects here.

	// Get all summatory operations stored at ProtoAPI
	protoapi( 'operations' ).get( {type: '+' }, function( response ){ // do something with your data });


## Deleting objects

Call protoapi.delete with a filter query to perform a delete operation on all objects matching that query object.

	// Delete all summartory operations
	protoapi( 'operations' ).delete( {type: '+' }, function( response ){} );


## Next steps 

Read all tests in tests.js and review ProtoDO example. ProtoDO is an small 'todo' manager application which uses ProtoAPI to store
all TODOS in the cloud so that you cannot say you forgot your grocery list at home!

Please use github issue page to point to any bug found in the platform or protoapi.js

Also don't forget to take a look to ProtoAPI's documentation and have fun storing data in the cloud without worries on scaling and server management. Send your ideas, comments, worries or tips to feedback@protoapi.com. 




