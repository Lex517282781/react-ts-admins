import React, { useState, useEffect } from 'react'

export default function Demo () {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `You clicked ${count} times`
  })

  return (
    <div>
      <div style={{
        height: '1cm'
      }}>{count}</div>
      <button onClick={() => setCount(count + 1)}>点一下</button>
    </div>
  )
}
