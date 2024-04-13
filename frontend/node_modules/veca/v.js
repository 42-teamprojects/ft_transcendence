// veca: Simple 2D and 3D vectors for JS.
function v (x, y, z) {
  return new (function () {
    this.x = x
    this.y = y
    this.z = z

    // Prints contents as a string.
    this.str = this.toString = () => this.z ?
      `x: ${this.x}, y: ${this.y}, z: ${this.z}` :
      `x: ${this.x}, y: ${this.y}`

    // Returns number of dimensions in vector.
    this.dimens = () => this.z ? 3 : 2

    // Generates an iterator over this vector and another.
    this.iter = (cb) => (b) => v(
          cb(this.x, b.x || b),
          cb(this.y, b.y || b),
          this.z ? cb(this.z, b.z || b) : undefined
        )

    // Makes an array of this vector's values.
    this.arr = () => this.z ?
      [ this.x, this.y, this.z ] :
      [ this.x, this.y ]

    // Makes a basic x,y,z object of this vector.
    this.obj = () => this.z ?
      { x: this.x, y: this.y, z: this.z } :
      { x: this.x, y: this.y }

    // Basic operations with another vector.
    this.mult = this.iter((a, b) => a * b)
    this.div = this.iter((a, b) => a / b)
    this.add = this.iter((a, b) => a + b)
    this.sub = this.iter((a, b) => a - b)
    this.pow = this.iter((a, b) => a ** b)
    this.mod = this.iter((a, b) => a % b)

    // Dot product with another vector.
    this.dot = (b) =>
      this.x * b.x + this.y * b.y + (this.z ? this.z * b.z : 0)
  })
}

// Export, if being used from NodeJS.
if (typeof window === 'undefined' && typeof module !== 'undefined')
  module.exports = v;
