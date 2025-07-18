import React from 'react'

const TestComponent = () => {
  return (
    <div className="test-container">
      <h2 className="test-heading">Test Component</h2>
      <p>This is a test component to check if CSS is working.</p>
      
      {/* Tailwind classes test */}
      <div className="mt-4 p-4 bg-blue-500 text-white rounded">
        This should be a blue box with white text if Tailwind is working.
      </div>
      
      {/* Custom Tailwind classes test */}
      <div className="mt-4 p-4 bg-primary-card text-text-primary rounded">
        This should use our custom Tailwind theme colors if configured correctly.
      </div>
    </div>
  )
}

export default TestComponent