'use client'

import { useEffect } from 'react'

export default function NewOrderPage() {
  useEffect(() => {
    alert("NEW ORDER PAGE IS LIVE " + Math.random())
  }, []);

  return (
    <main>
      <h1>PAGE TEST: /orders/new {Math.random()}</h1>
      <p style={{fontWeight: 'bold', color: 'red'}}>If you do not see THIS LINE, you are not editing the correct file!</p>

      {/* Place your full order form here */}
      <p>
        This is the /orders/new test page. You should only see THIS header and alert if you're editing <b>src/app/orders/new/page.tsx</b>!
      </p>
    </main>
  );
}
