// importer
const calculatrice = require('./calculatrice');

// stocker le resultat dans result
const result = calculatrice.add(10,20);

// afficher du texte formatté (Template string / Template literals)
console.log(`le résultat est : ${result}`);


const result2 = calculatrice.multiply(5,4);
console.log(`le résultat de la multiplication est : ${result2}`)