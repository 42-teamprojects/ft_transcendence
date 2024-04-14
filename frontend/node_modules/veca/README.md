# veca

Veca is a simple library implementing 2-D and 3-D vectors.

## Installation

### From NodeJS

First, use `npm install` to get `veca`.
Second, require veca like so:

```js
const v = require('veca')
```

You may now use veca's `v()` function.

### From the Browser

Simply download the file `v.js` from this repository, and then include it using:

```html
<script src='v.js'></script>
```

You can also use RawGit's CDN:

```html
<script src="https://cdn.rawgit.com/emctague/veca/2cae9b9a/v.js"></script>
```

## Usage

### Creating a Vector

You can create both 2-Dimensional and 3-Dimensional vectors using the `v`
function.

```js
v(10, 20)
// => x: 10, y: 20

v(30, 40, 50)
// => x: 30, y: 40, z: 50
```

### Converting a Vector to a String

The `str` method can be used to convert a vector to a simple, readable string:

```js
v(30, 20, 49).str()
// => "x: 30, y: 20, z: 49"
```

The vector will also be implicitly converted to a string:

```js
'The vector is:' + v(5, 15)
// => "The vector is: x: 5, y: 15"
```

### Using the Values from a Vector

You can use the `x`, `y`, and `z` properties to interact directly with a
vector's values.

```js
const vector = v(5, 3, 9)

vector.x
// => 5

vector.y
// => 3

vector.z
// => 9

vector.z = 10
vector.str()
// => "x: 5, y: 3, z: 10"
```

### Getting the Number of Dimensions in a Vector

The `dimens` method will return `2` or `3`, depending on whether or not
the vector is 3-Dimensional.

```js
v(3, 6).dimens()
// => 2

v(3, 6, 9).dimens()
// => 3
```

### Converting a Vector to an Array or Object

The `arr` method converts the vector to an array.

```js
v(93, 2).arr()
// => [ 93, 2 ]
```

Similarly, the `obj` method will convert the vector to a simple object.

```js
v(20, 39, 42).obj()
// => { x: 20, y: 39, z: 42 }
```

### Basic Mathematical Operations

A number of basic operations can be used on a vector to manipulate its
values. Each of these methods can be called with either another vector,
in which case each value will be modified using the equivalent value in the
other vector, or with a single number, which will be used to modify each
of the vector values.

Division is done with the `div` method:

```js
v(2, 4, 6).div(2)
// => x: 1, y: 2, z: 3

v(2, 4, 6).div(v(2, 4, 3))
// => x: 1, y: 1, z: 2
```

Multiplication is done with the `mult` method:

```js
v(2, 4, 6).mult(2)
// => x: 4, y: 8, z: 12

v(2, 4, 6).mult(v(2, 4, 3))
// => x: 4, y: 16, z: 18
```

Addition is done with the `add` method:

```js
v(2, 4, 6).add(2)
// => x: 4, y: 6, z: 8

v(2, 4, 6).add(v(2, 4, 3))
// => x: 4, y: 8, z: 9
```

Subtraction is done with the `sub` method:

```js
v(2, 4, 6).sub(2)
// => x: 0, y: 2, z: 4

v(2, 4, 6).div(v(2, 4, 3))
// => x: 0, y: 0, z: 3
```

Powers are done with the `pow` method:

```js
v(2, 4, 6).pow(2)
// => x: 4, y: 16, z: 36

v(2, 4, 6).div(v(2, 4, 3))
// => x: 4, y: 256, z: 216
```

Modulo is done with the `mod` method:

```js
v(2, 4, 6).mod(3)
// => x: 2, y: 1, z: 0

v(2, 4, 6).mod(v(2, 4, 3))
// => x: 0, y: 0, z: 0
```

### Dot Product

The dot product can be gotten using the `dot` method.

```js
v(5, 10, 15).dot(v(3, 6, 9))
// => 210
```

### Custom Iterative Methods

Custom iterative methods, which behave in the same way as the "Basic
Mathematical Operations" specified above, can be created using the `iter`
method:

```js
const modify = v(3, 6).iter((a, b) => a**(b/2))

modify(4)
// => x: 9, y: 36

modify(v(4, 6))
// => x: 9, y: 216
```
