import React from 'react'
import { Decimal } from 'decimal.js'
console.log(new Decimal(0.1).mul(0.2).toNumber())
class Demo extends React.Component {
  render () {
    return (
      <div>
        <button>Notify !</button>
      </div>
    )
  }
}

export default Demo
