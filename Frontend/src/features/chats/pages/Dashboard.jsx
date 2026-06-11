import React from 'react'
import { initializeSocketConnection } from '../services/chat.socket'
import { useEffect } from 'react'
import { use } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hook/useChat'

const Dashboard = () => {

  const chat = useChat()

  const user = useSelector((state) => state.auth.user)
  console.log(user)

  useEffect(() => {
    chat.initializeSocketConnection()
  }, [])
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard
