tash.namespace( tash, 'debug' );

(function($){

	//add some debug options to global config object
	$.config.debug =  {
			isDebug: false,
			consoleId: 'debugConsole'
	};

	$.debug.getConsole = ( function _getConsole() {
		var consoleEl = null;

		return function() {
			var consoleWrapper,
				consoleScroller,
				computedStyles = [],
				consoleStyle,
				mainStyleSelector = "#" + $.config.debug.consoleId + "-wrapper",
				logLineSelector = "#" + $.config.debug.consoleId + " p";

			function createTitleBar( mainStyleSelector, styles ) {
				var consoleTitleBar,
					buttons,
					clearAll,
					titleBarStyles;

				titleBarStyles = [
					mainStyleSelector + " .debugConsole-titlebar {",
						"height: 20px;",
						"background-color: #333;",
						"border-bottom: 1px solid #666;",
						"border-top: 1px solid #888;",
					"}",
					mainStyleSelector + " .debugConsole-titlebar .titlebar-buttons {",
						"float: right;",
						"overflow: hidden;",
					"}",
					mainStyleSelector + " .debugConsole-titlebar .titlebar-buttons .clear-all{",
						"background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBZJREFUeNpMVGtIm1cYfpN8akzUWKPGeIn3GDVacThFYXUqE1eEFmVsxX+tPwqlCO1wqShlP8ag/SGsjLmx7gJDHR2DldJF67zMab2EoquiMXhJTIzRRqNG4zV73tBtPXDQk++c931u54iam5vp5OSEqqqqKCIigra3tykzMzNyf3//cnJycm5QUNB2aGgo/y7zeDy+nZ2droODA7PD4aCsrCzq6uqivb09EtPr4ff7A3+jo6OvJiQkPI2Nja07Pj52OJ3OpZGRkTmpVLpyenqq0Wq1P6nV6gchISHRZ2dn/x4ngQvwPDw8lGRnZ9+Xy+UF8/PzLWtra3+Eh4cTENDm5iYFBweTy+XqcLvdSSjWXFFR8WhhYaERxRf4vCCRSAgLSklJ+RQdMmw22yWsPehIR0dHNDk5GWgkFospJiaGQMkGdDcgQ1NGRsZ3oH0ZIDZE3d3dvOHd0tLSe8PDw+/7fD4XJoGeKCoq6iKKfYQGqsjISAuQ/TIxMdGbn58vn5qa8ubl5X2blJR0MDo6ekMABTFg3hwfH/8aE+hdlJqaKi0vL/9CqVReg042CO5EsSsajeaaQqF4jCa9aPal0WhsaWtrewyztGJUP49NGpPJ9Mjr9RI0IHT6mIsMDQ096Ojo0K6vr7/d2tqavYKRnp5+CdQSQYtEIpFzenr6RUFBwQcCDuplMplTr9e72XoIriwpKWlaXV0d6ezsvIm1HAffwncHqP4Mg+Kg2WRcXBxVVlYSEE4gDoVCfHy8DnS8oBDIErRQY3MUxDWiq7+wsPAWNt8F3au7u7sGdhJIAk4ia+ykG/teCVtbW17ADVKpVITKvOkYB9lJJQJIr6EPDgwMvOQIVFdXk9VqJehFjApxCQYrqaSxsfFcYmLihcHBwR/Hxsaor6/Pm5ubexHBvIDEPgGNP0H5e3S3Q7dk6Oltb28/4yY88dt7KKYW2+32F+h+DlR0DBUu+vr7+w3Ikay2ttYI924jlB/i/8/q6ur+hhSfMDJoGCiE6FQsLi6OitlecH9WVFR0HfpwMJm/cWlp6Qq+7eC+3auvr+8EagPWJnzr5QDjO6HZO4iCEvL8KgJMgisJDQ0Nvy0vL9+ZnZ01cgx0Oh1fCwXWxUCrRJKtEPz5xsbGKRuDhCtqamp6oeFXMzMzDwWLxcJXwZ6WltaCYH4OFwRsfMJdoZEHYethE6BDwCm+Ljk5OaqysrJvQO2vnp6ehyyJBFcjYCcoWIBghanAjRzoYoV7LlyBwD0rLi4m5DEWqBpgxH0UfY5pwAX38zMk/PcMCAIL/bvZbH6JQ00I4g8I6ivotw8tjqBfGHRUcTMMA/Y9wyvw/zNCbwx+CWDvKq7EbUwN0Jyfm5vTI4QyaGMOCwubRWETvwzc+M3xjwADALPAUrORzSeCAAAAAElFTkSuQmCC);",
						"height: 18px;",
						"width: 18px;",
						"float: left;",
						"text-indent: -9999px;",
					"}"
				];
				$.addToArray( styles, titleBarStyles );
				consoleTitleBar = document.createElement( "div" );
				consoleTitleBar.setAttribute( "class", "debugConsole-titlebar");

				buttons = document.createElement( "div" );
				buttons.setAttribute( "class", "titlebar-buttons" );

				clearAll = document.createElement( "a" );
				clearAll.setAttribute( "href", "#" );
				clearAll.setAttribute( "class", "clear-all" );
				clearAll.onclick = function() {
					//consoleEl.parentNode.removeChild( consoleEl );
					consoleEl.parentNode.parentNode.removeChild( consoleEl.parentNode );
					consoleScroller = null;
					consoleEl = null;
					return false;
				};
				clearAll.appendChild( document.createTextNode( 'clear' ) );
				buttons.appendChild( clearAll );

				consoleTitleBar.appendChild( buttons );
				return consoleTitleBar;
			}

			function createConsoleWrapper( styles ) {
				var st = [
					mainStyleSelector + " {",
						"font-size: 0.60em;",
						"font-family: Monaco, 'Andale Mono', 'Courier New', 'Lucida Console', 'Lucida Sans Unicode', 'Lucida Grande', courier, sans-serif;",
						"line-height: 1.4em;",
						"display: block;",
						"position: absolute;",
						"bottom: 0;",
						"height: 100px;",
						"width: 100%;",
						"overflow: hidden;",
						"background-color: #000;",
						"opacity: 0.8;",
					"}"
				];

				consoleWrapper = document.getElementById( mainStyleSelector.substr(1) );

				if( !consoleWrapper ) {

					$.addToArray( styles, st );

					consoleWrapper = document.createElement( "div");
					//note: the class 'overload-hook' is given to allow overriding styles ;)
					consoleWrapper.id = $.config.debug.consoleId + "-wrapper";
					consoleWrapper.setAttribute( 'class', 'overload-hook' );

					consoleWrapper.appendChild( createTitleBar( mainStyleSelector, computedStyles ) );
					return true;
				}
				return false;
			}

			function createScroller( id, styles ) {
				var st = [
					"#" + id + " {",
						"overflow: auto;",
						"position: absolute;",
						"top: 22px;",
						"bottom: 0;",
						"width: 100%;",
					"}"
				];

				consoleScroller = document.getElementById( id );
				if( !consoleScroller ) {
					$.addToArray( styles, st );
					consoleScroller = document.createElement( "div" );
					consoleScroller.id = id;
				}
				return consoleScroller;
			}

			if( consoleEl === null ) {
				consoleEl = document.getElementById( $.config.debug.consoleId );
				if( !consoleEl ) {

					computedStyles = [
							"#" + $.config.debug.consoleId + "{",
								"padding: 5px;",
								"color: #aaa;",
								"overflow: auto;",
							"}",
							logLineSelector + " {",
								"padding: 0;",
								"margin: 0;",
							"}",
							logLineSelector + ".log-level-INFO {",
								"color: #12C474;",
							"}",
							logLineSelector + ".log-level-WARN {",
								"color: #FFC869;",
							"}",
							logLineSelector + ".log-level-ERR {",
								"color: #FC3232;",
							"}"
						];

					var created = createConsoleWrapper( computedStyles );

					createScroller( $.config.debug.consoleId + "-scroller", computedStyles );
					consoleEl = document.createElement( "div" );
					consoleEl.id = $.config.debug.consoleId;
					consoleScroller.appendChild( consoleEl );
					consoleWrapper.appendChild( consoleScroller );

					consoleStyle = document.createElement( "style" );
					consoleStyle.appendChild( document.createTextNode( computedStyles.join('') ) );


					if( created ) {
						document.body.appendChild( consoleStyle );
						document.body.appendChild( consoleWrapper );
					}
				}
			}
			return consoleEl;
		};
	}());

	$.log = function log( msg, level ) {

		var message = msg,
			levelLabel = $.log.INFO;

		if( !$.config.debug.isDebug ) {
			return;
		}


		if( typeof console !== 'undefined' && typeof console.log === 'function' ) {
			return console.log.apply( console, arguments );
		}

		if( ['INFO', 'WARN', 'ERR '].indexOf( level ) >= 0 ) {
			levelLabel = level;
		}

		message = '[' + levelLabel + '] ' + msg;

		var p = document.createElement('p');
		p.setAttribute( "class", "log-level-" + (level ? level.toUpperCase() : "INFO" ) );
		p.appendChild( document.createTextNode( message ) );
		$.debug.getConsole().appendChild( p );
		//$.debug.getConsole().scrollTop( $.debug.getConsole().height() );
		p.scrollIntoView();
	};
	$.log.INFO = "INFO";
	$.log.WARN = "WARN";
	$.log.ERR  = "ERR ";

	$.info = function info( msg ) {
		$.log( msg, $.log.INFO );
	};
	$.warn = function err( msg ) {
		$.log( msg, $.log.WARN );
	};
	$.err = function err( msg ) {
		$.log( msg, $.log.ERR );
	};


}(tash));