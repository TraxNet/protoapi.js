# ProtoAPI

This library sets a thin layer on top of the ProtoAPI's REST end-points to allow simple access to platform services from javascript. 

## Download

Grab the lastest minimized version of protoapi.js here

## Adding ProtoAPI to your Javascript application

Adding protoapi.js is a matter of adding an script reference to protoapi.js file or protoapi.min.js to your application. For example using HTML markup:

	<script src="" type="javascript"></script>

Before you can start working with ProtoAPI you need to set your appid and appkey for the App you want to use. You can review your App's information at ProtoAPI's Dev Center page here. 

Protoapi's constructor take either a configuration object or an string. When a configuration object is passed, options will be read an set as globals for the subsequent calls to protoapi.js. If an string is passed, it will be used as the classname for the current api call. For example:
	
	// Configure protoapi.js
	protoapi( { } );

	// Get some objects from 'posts' collection
	protoapi( 'posts' ).get({}, function( response ){ // your callback code goes here });

