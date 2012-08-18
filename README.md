Owl
===

Urlship's platform, cuz we <3 open source

![Owl](http://vector.us/files/images/2/3/230897/free_vector_owl_preview.jpg)

## Status

[![Build Status](https://secure.travis-ci.org/urlship/Owl.png?branch=master)](http://travis-ci.org/urlship/Owl)

## Contribute

Our platform's code is available because we strongly believe in open source and we think that people should
be able to learn and to share code without fearing their idea to be stolen or cloned. So look around, 
fork, contribute and have fun

- Open an issue with your über cool proposal

If your idea gets accepted

* Fork repo
* Add tests
* Add feature (both to API and Web)
* Submit PR (aka pull request)
* Profit \ò\

## Dependencies and installation

* NodeJS
* MySQL (PostgreSQL for production) -> username: root password:(empty) or change in ```models/index.js```

```
$ git clone git://github.com/urlship/Owl.git
$ cd Owl
$ mysql -e "create database urlship;"
$ npm install
$ npm start
```

Visit [http://localhost:8000](http://localhost:8000)

## Tests

```
$ npm test
```

## Security

We take security very seriously, if you happen to find a bug please contact:
- __yawn[AT]urlship[DOT]com__
- __stoke[AT]urlship[DOT]com__

## License (MIT)

```
Copyright (C) 2012 Urlship

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without 
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
```
