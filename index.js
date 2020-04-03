const fs = require("fs");
const file = fs.readFileSync("variables.json");

const variables = JSON.parse(file);
/** get all unique keys in all objects **/

const getAllKeys = variables => {
  const set = new Set();
  const result = {};
  const objects = Object.keys(variables);
  objects.forEach(( objectsKey ) => {
    const innerObject = variables[ objectsKey ];
    Object.keys(innerObject).forEach(( key ) => {
      if ( set.has(key) ) {
        result[ key ].objects.push(objectsKey);
        const entries = result[ key ].objects.length;
        if ( entries === objects.length ) {
          result[ key ].isUnique = false;
          result[ key ].isSomewhere = false;
          result[ key ].isEverywhere = true;
        } else {
          result[ key ].isUnique = false;
          result[ key ].isSomewhere = true;
          result[ key ].isEverywhere = false;
        }
      } else {
        result[ key ] = {
          title: key,
          isUnique: true,
          isSomewhere: false,
          isEverywhere: false,
          objects: [ objectsKey ]
        };
        set.add(key);
      }

    });
  });
  return result;
};
const allKeys = getAllKeys(variables);

const uniqueKeys = () => {
  const result = {};
  Object.keys(allKeys)
    .filter(outerKey => allKeys[ outerKey ].isUnique)
    .forEach(innerKey => {
      result[innerKey] = allKeys[innerKey].objects;
    });
  console.log(`\n${Object.keys(result).length} keys is UNIQUE`);
  return result;
};

const somewhereKeys = () => {
  const result = {};
  Object.keys(allKeys)
    .filter(outerKey => allKeys[ outerKey ].isSomewhere)
    .forEach(innerKey => {
      result[innerKey] = allKeys[innerKey].objects;
    });
  console.log(`\n${Object.keys(result).length} keys included to SEVERAL objects`);
  return result;
};

const everywhereKeys = () => {
  const result = {};
  Object.keys(allKeys)
    .filter(outerKey => allKeys[ outerKey ].isEverywhere)
    .forEach(innerKey => {
      result[innerKey] = allKeys[innerKey].objects;
    });
  console.log(`\n${Object.keys(result).length} keys included to ALL objects\n`);
  return result;
};

const pathFolder = 'results/';
const pathUnique = `${ pathFolder }unique.json`;
const pathEverywhere = `${ pathFolder }everywhere.json`;
const pathSomewhere = `${ pathFolder }somewhere.json`;

const writeFile = ( fileName, data ) => {
  fs.writeFile(fileName, JSON.stringify(data), error => {
    if ( error ) {
      console.log(error);
    } else {
      console.log(`The file ${ fileName } was successfully written.`);
    }
  });
};

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////  call function -writeFile- for files and data that you need  ///////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

writeFile(pathUnique, uniqueKeys());
writeFile(pathSomewhere, somewhereKeys(variables));
writeFile(pathEverywhere, everywhereKeys(variables));

