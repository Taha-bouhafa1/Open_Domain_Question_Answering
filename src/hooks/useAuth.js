import { useState, useEffect } from 'react'
import { supabase, getCurrentUser, signIn, signUp, signOut, signInWithGoogle } from '../services/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const { data, error: signInError } = await signIn(email, password)
      
      if (signInError) throw signInError
      
      setUser(data.user)
      return { success: true }
    } catch (err) {
      console.error('Erreur de connexion:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, fullName) => {
    try {
      setError(null)
      setLoading(true)
      const { data, error: signUpError } = await signUp(email, password, {
        full_name: fullName
      })
      
      if (signUpError) throw signUpError
      
      return { success: true, data }
    } catch (err) {
      console.error('Erreur d\'inscription:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      setLoading(true)
      const { error: signOutError } = await signOut()
      
      if (signOutError) throw signOutError
      
      setUser(null)
      return { success: true }
    } catch (err) {
      console.error('Erreur de déconnexion:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const { data, error: googleError } = await signInWithGoogle()
      
      if (googleError) throw googleError
      
      return { success: true, data }
    } catch (err) {
      console.error('Erreur de connexion Google:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    isAuthenticated: !!user
  }
}