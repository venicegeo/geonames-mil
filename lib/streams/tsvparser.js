var schema  = require('../../data/schema.json'),
    through = require('through2');

var defaultSchema = schema.geoname;

/**
 * @param {sring|Array} customSchema Custom schema Array or name of the existing in shema.json
 */
function factory(customSchema){

  customSchema = customSchema || defaultSchema;

  var columns;

  switch( customSchema.constructor ){
    case String:
      columns = schema[customSchema];
      break;
    case Array:
      columns = customSchema;
      break;
    default:
      throw new TypeError('customSchema must be a string or an array');
  }

  var headerFlag = true;
  var flush = function( chunk, _, next ){
    var row = {}, cells = chunk.toString('utf-8').split('\t');
    cells.forEach( function( cell, i ){
      row[ columns[ i ] ] = ( cell || '' ).trim();
    });

    if( !!chunk ) {
      if( !headerFlag ) {
        this.push( row );
      }
      headerFlag = false;
    }
    next();
  };

  return through.obj( flush );
}

module.exports = factory;
