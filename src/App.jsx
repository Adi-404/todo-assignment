import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Todo from './components/Todo'

const App = () => {
  return (
    <Router>
      <div className='bg-stone-900 grid py-4 min-h-screen'>
        <Routes>
          <Route path="/developer" element={<Todo initialRole="developer" />} />
          <Route path="/manager" element={<Todo initialRole="manager" />} />
          <Route path="*" element={<Navigate to="/developer" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App