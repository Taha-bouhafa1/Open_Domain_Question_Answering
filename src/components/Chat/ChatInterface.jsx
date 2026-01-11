import { useState, useRef, useEffect } from 'react'
import { Send, Menu, Sparkles, User, Bot } from 'lucide-react'
import { askQuestion, saveMessage, getMessages } from '../../services/api'

function ChatInterface({ 
  currentConversation, 
  messages, 
  onSendMessage, 
  userId,
  preferredName,
  onToggleSidebar,
  sidebarOpen
}) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [localMessages, setLocalMessages] = useState([])
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [localMessages])

  // 🆕 Charger les messages quand on change de conversation
  useEffect(() => {
    if (currentConversation?.id) {
      loadConversationMessages(currentConversation.id)
    } else {
      setLocalMessages([])
    }
  }, [currentConversation?.id])

  // 🆕 Fonction pour charger l'historique des messages
  const loadConversationMessages = async (conversationId) => {
    try {
      const savedMessages = await getMessages(conversationId)
      
      // Transformer les messages du backend au format frontend
      const formattedMessages = []
      savedMessages.forEach(msg => {
        // Message utilisateur
        formattedMessages.push({
          id: `${msg.id}_user`,
          role: 'user',
          content: msg.question,
          timestamp: msg.created_at,
        })
        
        // Message assistant
        formattedMessages.push({
          id: `${msg.id}_assistant`,
          role: 'assistant',
          content: msg.answer,
          timestamp: msg.created_at,
        })
      })
      
      setLocalMessages(formattedMessages)
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
      setLocalMessages([])
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const questionText = input.trim()
    
    const userMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: questionText,
      timestamp: new Date().toISOString(),
    }

    // 🆕 Ajouter immédiatement le message à l'interface
    setLocalMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 🔥 NOUVEAU : Détecter si c'est le premier message de la conversation
      const isFirstMessage = localMessages.length === 0
      
      const response = await askQuestion(
        questionText,
        currentConversation?.id,
        userId
      )

      const botMessage = {
        id: `temp_bot_${Date.now()}`,
        role: 'assistant',
        content: response.answer || 'Désolé, je n\'ai pas pu traiter votre question.',
        timestamp: new Date().toISOString(),
      }

      // 🆕 Ajouter la réponse du bot à l'interface
      setLocalMessages(prev => [...prev, botMessage])

      // 🆕 Sauvegarder dans le backend si on a une conversation
      if (currentConversation?.id) {
        await saveMessage(
          currentConversation.id,
          userId,
          questionText,
          botMessage.content,
          response.confidence_logit
        )
      }

      // 🔥 NOUVEAU : Notifier le parent avec le titre si c'est le premier message
      if (onSendMessage) {
        onSendMessage(botMessage, isFirstMessage ? questionText : null)
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date().toISOString(),
      }
      setLocalMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header avec design moderne */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-xl transition lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentConversation?.title || 'Nouvelle conversation'}
                </h2>
                <p className="text-xs text-gray-500">Assistant IA • En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages avec design moderne */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl p-8 shadow-xl">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              Bonjour {preferredName} ! 
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md">
              Je suis votre assistant IA. Posez-moi n'importe quelle question et je vous aiderai !
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
              {[
               { icon: '📖', text: 'Pose une question factuelle', color: 'from-blue-600 to-sky-500' },
               { icon: '⏱️', text: 'Dates & événements historiques', color: 'from-emerald-600 to-green-500' },
               { icon: '🌍', text: 'Lieux & organisations', color: 'from-indigo-600 to-purple-500' },
               { icon: '🧠', text: 'Personnes & faits connus', color: 'from-amber-600 to-orange-500' },

              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion.text)}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-200 border-2 border-gray-100 hover:border-gray-200 group"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${suggestion.color} rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                    {suggestion.icon}
                  </div>
                  <span className="text-gray-700 font-medium text-left">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {localMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div
                    className={`inline-block max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="message-content whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-violet-200' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-200">
                  <div className="typing-indicator flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input moderne */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder={`Posez votre question, ${preferredName}...`}
                className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none transition-all"
                rows={1}
                style={{
                  minHeight: '56px',
                  maxHeight: '200px',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-2xl hover:from-violet-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Entrée pour envoyer • Shift+Entrée pour une nouvelle ligne
          </p>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface