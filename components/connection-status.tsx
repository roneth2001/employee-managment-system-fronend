"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  isConnected: boolean
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  const [showStatus, setShowStatus] = useState(true)

  useEffect(() => {
    // Auto-hide the status after 10 seconds if connected
    if (isConnected) {
      const timer = setTimeout(() => setShowStatus(false), 10000)
      return () => clearTimeout(timer)
    } else {
      setShowStatus(true)
    }
  }, [isConnected])

  if (!showStatus && isConnected) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2 px-3 py-2">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4" />
            Connected to API
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            Using Demo Data
          </>
        )}
      </Badge>
    </div>
  )
}
