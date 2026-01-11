import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error)
    return Promise.reject(error)
  }
)

// Exporter toutes les fonctions
export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export const askQuestion = async (question, conversationId, userId) => {
  const response = await api.post('/api/ask', {
    question,
    conversation_id: conversationId,
    user_id: userId,
  })
  return response.data
}

export const getConversations = async (userId) => {
  const response = await api.get(`/api/conversations/${userId}`)
  return response.data
}

export const getMessages = async (conversationId) => {
  const response = await api.get(`/api/messages/${conversationId}`)
  return response.data
}

export const createConversation = async (userId, title = 'Nouvelle conversation') => {
  const response = await api.post('/api/conversations', {
    user_id: userId,
    title,
  })
  return response.data
}

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/api/conversations/${conversationId}`)
  return response.data
}

// 🔥 NOUVELLE FONCTION : Mettre à jour le titre d'une conversation
export const updateConversationTitle = async (conversationId, title) => {
  try {
    // Tronquer le titre si trop long
    let truncatedTitle = title
    if (title.length > 60) {
      truncatedTitle = title.substring(0, 57) + '...'
    }
    
    const response = await api.put(`/api/conversations/${conversationId}`, {
      title: truncatedTitle,
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du titre:', error)
    throw error
  }
}

// Fonction pour sauvegarder les messages
export const saveMessage = async (conversationId, userId, question, answer, confidence) => {
  const response = await api.post('/api/messages', {
    conversation_id: conversationId,
    user_id: userId,
    question,
    answer,
    confidence,
  })
  return response.data
}

export default api