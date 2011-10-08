/*
Note that neither iPhone OS 3.1 and earlier nor jQuery have native JSON serialization tools. You can grab @json.js@ from the @lib@ directory of this repository. It's a small library, and it will not override the native serialization and deserialization if they exist (such as on recent versions of Firefox, Safari, and iPhone OS 3.2 and later).

json.js is not forced as a dependency here, but be aware of the above.
*/
require('./jquery.offline');