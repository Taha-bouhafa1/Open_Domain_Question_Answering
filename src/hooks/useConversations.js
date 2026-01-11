import { useState, useEffect, useCallback } from 'react'
import {
  getConversations,
  createConversation,
  deleteConversation,
  updateConversationTitle,
} from '../services/api'

export const useConversations = (userId) => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  // Charger les conversations au démarrage
  useEffect(() => {
    if (userId) {
      loadConversations()
    }
  }, [userId])

  const loadConversations = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const data = await getConversations(userId)
      setConversations(data)
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Créer une nouvelle conversation
  const createNew = async () => {
    if (!userId) return
    
    try {
      const newConversation = await createConversation(userId, 'Nouvelle conversation')
      setConversations([newConversation, ...conversations])
      setCurrentConversation(newConversation)
      setMessages([])
      return newConversation
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error)
    }
  }

  // Supprimer une conversation
  const deleteConv = async (conversationId) => {
    try {
      await deleteConversation(conversationId)
      setConversations(conversations.filter((c) => c.id !== conversationId))
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error)
    }
  }

  // Sélectionner une conversation
  const selectConversation = (conversation) => {
    setCurrentConversation(conversation)
    setMessages([])
  }

  // 🔥 NOUVELLE FONCTION : Mettre à jour le titre de la conversation
  const updateTitle = async (conversationId, title) => {
    try {
      console.log('🎯 Mise à jour du titre:', { conversationId, title })
      
      const updatedConversation = await updateConversationTitle(conversationId, title)
      
      // Mettre à jour la liste des conversations
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === conversationId ? { ...conv, title: updatedConversation.title } : conv
        )
      )
      
      // Mettre à jour la conversation actuelle si c'est celle-ci
      if (currentConversation?.id === conversationId) {
        setCurrentConversation((prev) => ({ ...prev, title: updatedConversation.title }))
      }
      
      console.log('✅ Titre mis à jour avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du titre:', error)
    }
  }

  // 🔥 FONCTION MODIFIÉE : Ajouter un message (avec gestion du titre)
  const addMessage = useCallback(
    async (message, conversationTitle = null) => {
      console.log('📨 addMessage appelé:', { message, conversationTitle })
      
      setMessages((prev) => [...prev, message])

      // Si un titre est fourni, c'est le premier message de la conversation
      if (conversationTitle && currentConversation?.id) {
        console.log('🎯 Premier message détecté, mise à jour du titre...')
        await updateTitle(currentConversation.id, conversationTitle)
      }
    },
    [currentConversation?.id]
  )

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    createNew,
    deleteConv,
    selectConversation,
    addMessage,
    updateTitle, // Exposer aussi cette fonction au cas où
  }
}