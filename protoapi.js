/**
 * Javascript Official Client for ProtoAPI backend
 * 
 * Copyright 2012, Oscar Blasco Maestro
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Note: some helper functions and code has been used from other sources.
 *		  - Base64 encode/decode from webtoolkit.info
 *
 * Version History:
 *		- 0.1 Initial version.
 *
 * Currently tested on: Chrome 16.0.912.77, Firefox 9.0.1
 */

(function()
{
	/*
	 * Base64 encode / decode
	 * http://www.webtoolkit.info/
	 */
	var Base64 = {

	    // private property
	    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	    // public method for encoding
	    encode : function (input) {
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;

	        input = Base64._utf8_encode(input);

	        while (i < input.length) {

	                chr1 = input.charCodeAt(i++);
	                chr2 = input.charCodeAt(i++);
	                chr3 = input.charCodeAt(i++);

	                enc1 = chr1 >> 2;
	                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	                enc4 = chr3 & 63;

	                if (isNaN(chr2)) {
	                        enc3 = enc4 = 64;
	                } else if (isNaN(chr3)) {
	                        enc4 = 64;
	                }

	                output = output +
	                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
	                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

	        }

	        return output;
	    },

	    // private method for UTF-8 encoding
	    _utf8_encode : function (string) {
	        string = string.replace(/\r\n/g,"\n");
	        var utftext = '';

	        for (var n = 0; n < string.length; n++) {

	                var c = string.charCodeAt(n);

	                if (c < 128) {
	                        utftext += String.fromCharCode(c);
	                }
	                else if((c > 127) && (c < 2048)) {
	                        utftext += String.fromCharCode((c >> 6) | 192);
	                        utftext += String.fromCharCode((c & 63) | 128);
	                }
	                else {
	                        utftext += String.fromCharCode((c >> 12) | 224);
	                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                        utftext += String.fromCharCode((c & 63) | 128);
	                }

	        }

	        return utftext;
	    },
	}

	// TODO: This is intrusive. 
	if (!Function.prototype.bind) { // check if native implementation available
		Function.prototype.bind = function(){ 
	    	var fn = this, args = Array.prototype.slice.call(arguments),
	        	object = args.shift(); 
	    	return function(){ 
	      		return fn.apply(object, 
	        	args.concat(Array.prototype.slice.call(arguments))); 
	    	}; 
	  	};
	}

	/*
	 * RestClient is a thin warper XmlHttpRequest object to make things even easier.
	 * This is in fact the object you will be dealing with when using this
	 * library.
	 * 
	 */
	var RestClient = function( config ){
		this.config = config;
	}
	RestClient.prototype = {
		/**
		 * Warper around ajax call for GET method
		 *
		 * @param filter: A json object with the filter to apply to this search. 
		 *				  Please refer to ProtoAPI's  documentation for more 
		 *				  information regarding filters.
		 * @param callback: a callback to run once the data is received.
		 */
		get: function( filter, callback ){
			var json_data = JSON.stringify( filter );
			json_data = encodeURIComponent( json_data );
			var query_str = '?pointer=' + this.config.pointer + 
							'&limit=' + this.config.limit + 
							'&filter=' + json_data;
			var uri = this.config.apiuri + this.config.classname + query_str;
			this.__ajax( uri, '', 'GET', callback );
			return this;
		},

		/**
		 * Warper around ajax call for POST method
		 *
		 * @param data: object to post. The current classname is used, 
		 * 				in case a '_cls' field is found, both must match.
		 * @param callback: Called once a response has been received.
		 */
		post: function( data, callback ){
			var json_data = JSON.stringify( data );
			this.__ajax( this.config.apiuri + this.config.classname, 
						 json_data, 'POST', callback );
			return this;
		},

		/**
		 * Warper around ajax call for PUT method
		 *
		 */
		put: function( data, callback ){
			if(!('_id'  in data )){
				return; // silent error
			}
			json_data = JSON.stringify( data );
			var _id = data._id.toString();
			var uri = this.config.apiuri + this.config.classname + '/' + _id, json_data;
			this.__ajax( uri, json_data, 'PUT', callback );
			return this;
		},

		/**
		 * Saves an object. If object is new (doesn't contain an '_id' field),
		 * a post is issuedand a new id is generated by ProtoAPI. Otherwise a put is executed.
		 *
		 * @param data: Object to save into ProtoAPI
		 * @param callback: If present, it's called upon succesful save with the updated object
		 */
		save: function( data, callback ){
			if( '_id' in data ){ // Update
				this.put( data, callback );
			} else { // Create
				this.post( data, function( _data, _cbk ){
					// warp data and the callback into a closure
					return function( response ){
						// store returned _id into object
						_data._id = response.data; 

						// run the callback 
						if( typeof _cbk === "function" )
						{
							_cbk( _data );
						}
					}
				}( data, callback ));
			}
		},

		/** We cannot call console.log on IE */
		__log: function( log_e ){
			if( console && console.log )
				console.log(log_e);
		},

		/** 
		 * __ajax creates a XmlHttpRequest objects, sets all needed headers and fires
		 * the request. It's the tipical parttern used when dealing with XmlHttpRequest.
		 * See __onRequestStateChange to check on how data is handled once recived.
		 */
		__ajax: function( uri, data, method, callback ){
			xmlHttp = this.__createRequestObject();

			if (xmlHttp)
  			{
  				try {
  					xmlHttp.open( method, uri, true );
  					this.__addProtoAPICommonHeader( xmlHttp );
				    xmlHttp.onreadystatechange = this.__onRequestStateChange.bind( this, xmlHttp, callback );
				    xmlHttp.send(data);
  				} catch (e){
			    	if( this.config.error )
			    		this.config.error( { code: 400, error: e.toString()} );
			    }
  			}
		},

		/** 
		 * Once the request has ended (readyState == 4) we can handle its success or failure and
		 * call the apropiate callback.
		 */
		__onRequestStateChange: function( xmlHttp, callback ){
			if (xmlHttp.readyState === 4){
				if (xmlHttp.status >= 200 && xmlHttp.status < 300){
					var response = xmlHttp.responseText;

				  	if( response.length > 0 ){
				  		var data = JSON.parse( response );

				  		if( typeof callback === 'function'){
				  			callback( data );
				  		}
				  	} else{
				  		if( typeof callback === 'function'){
				  			callback();
				  		}
				  	}
				} else{
					if( this.config.error ){
						var data = { code: xmlHttp.status, error: xmlHttp.statusText };
						this.config.error( data );
					}
				}
	  		}
		},

		/** Add common required headers from ProtoAPI */
		__addProtoAPICommonHeader: function( xmlHttp ){
			xmlHttp.setRequestHeader('Authorization', 
				this.__makeBasicAuth ( this.config.appid, this.config.appkey ));
		},

		/** Creates an XmlHttpRequest object on various browsers */
		__createRequestObject: function(){
			var xmlhttp=false;
			/*@cc_on @*/
			/*@if (@_jscript_version >= 5)
			// JScript gives us Conditional compilation, we can cope with old IE versions.
			// and security blocked creation of the objects.
			 try {
			  xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			 } catch (e) {
			  try {
			   xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			  } catch (E) {
			   xmlhttp = false;
			  }
			 }
			@end @*/
			if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
				try {
					xmlhttp = new XMLHttpRequest();
				} catch (e) {
					xmlhttp=false;
				}
			}
			if (!xmlhttp && window.createRequest) {
				try {
					xmlhttp = window.createRequest();
				} catch (e) {
					xmlhttp=false;
				}
			}

			return xmlhttp;
		},

		/**
		 * Internal method to create Basic Auth header
		 */
		__makeBasicAuth: function ( user, password ) {
			var tok = user + ':' + password;
			var hash = Base64.encode(tok);
			return 'Basic ' + hash;
		},
		
		/**
		 * jQuery beforeSend hook to inject auth header
		 */
		__serviceAJAX_beforeSend: function( req ){
			req.setRequestHeader('Authorization', 
                   	this.__makeBasicAuth ( this.config.appid, this.config.appkey ));
		},
	}

	/**
	 * This object stores global configuration between calls.
	 * For example, appid and appkey is stored here once set
	 */
	var globals = {}

	/**
	 * Very simple extend function. Enough for us.
	 */
	var extend = function(){
		data = arguments[ 0 ] || {};

		if( typeof data !== "object" ){
			data = {};
		}

		i = 1;

		for( ; i < arguments.length; i++ ){
			var type = typeof arguments[ i ];
			if ( type === 'undefined' || type === 'null' )
				continue;

			var current = arguments[ i ];
			for( value in current ){
				var source = current[ value ];
				if ( typeof value === 'undefined' || typeof value === 'null' )
					continue;
				
				data[ value ] = source;
				
			}
		}

		return data;
	}

	protoapi = function( config ){
		
		if( typeof config === 'object' ){
			globals = extend(globals, config);
		}

		var options = extend(
		{
			/**
			 * A callback method to be called upon an error 
			 */
			error: undefined,

			/**
			 * ProtoAPI's Application Id
			 * An string with your AppID.
			 */
			appid: undefined,

			/**
			 * ProtoAPI's Application Key
			 * An string with either your public or private key for this AppID
			 */
			appkey: undefined,

			/**
			 * ProtoAPI REST frontend URI
			 */
			apiuri: 'https://protoapi.com/api/1/objects/',

			/**
			 * Sets the max amount of objects to retrieve when a GET is issued
			 */
			limit: 50,

			/**
			 * First object's position to retrieve. Use with limit option for paging
			 */
			pointer: 0,

		}, globals);

		// If it's an string is because caller is setting classname (collection) 
		// he wants to access for this api call.
		if( typeof config === 'string' ){
			options.classname = config;
		} // We can add a check here to be sure classname is set

		return new RestClient( options );
	}

}());