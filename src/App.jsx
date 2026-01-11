import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useConversations } from './hooks/useConversations'
import AuthPage from './components/Auth/AuthPage'
import WelcomeSetup from './components/Auth/WelcomeSetup'
import ChatInterface from './components/Chat/ChatInterface'
import Sidebar from './components/Sidebar/Sidebar'
import { Loader2 } from 'lucide-react'

function App() {
  const { user, loading: authLoading, logout } = useAuth()
  const {
    conversations,
    currentConversation,
    messages,
    loading: conversationsLoading,
    createNew,
    deleteConv,
    selectConversation,
    addMessage,
  } = useConversations(user?.id)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [preferredName, setPreferredName] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)

  // Vérifier si l'utilisateur a déjà configuré son nom
  useEffect(() => {
    if (user) {
      const savedName = localStorage.getItem(`preferred_name_${user.id}`)
      if (savedName) {
        setPreferredName(savedName)
        setShowWelcome(false)
      } else {
        setShowWelcome(true)
      }
    }
  }, [user])

  const handleWelcomeComplete = (name) => {
    setPreferredName(name)
    localStorage.setItem(`preferred_name_${user.id}`, name)
    setShowWelcome(false)
  }

  // Afficher un loader pendant le chargement
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement de QueryMind...</p>
        </div>
      </div>
    )
  }

  // Si non connecté, afficher la page d'authentification
  if (!user) {
    return <AuthPage />
  }

  // Si connecté mais pas encore configuré, afficher la page de bienvenue
  if (showWelcome) {
    return <WelcomeSetup user={user} onComplete={handleWelcomeComplete} />
  }

  // Utilisateur connecté et configuré - afficher l'interface principale
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={selectConversation}
        onNewConversation={createNew}
        onDeleteConversation={deleteConv}
        user={user}
        preferredName={preferredName}
        onLogout={logout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Zone principale - Chat */}
      <div className="flex-1 flex flex-col">
        <ChatInterface
          currentConversation={currentConversation}
          messages={messages}
          onSendMessage={addMessage}
          userId={user.id}
          preferredName={preferredName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  )
}

export default App