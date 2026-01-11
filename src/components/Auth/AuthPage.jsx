import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Mail, Lock, User, Chrome, AlertCircle, Loader2, Sparkles, MessageSquare, Brain, Zap } from 'lucide-react'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register, loginWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const result = await login(email, password)
        if (!result.success) {
          setError(result.error || 'Erreur de connexion')
        }
      } else {
        if (!fullName.trim()) {
          setError('Le nom complet est requis')
          setLoading(false)
          return
        }
        const result = await register(email, password, fullName)
        if (!result.success) {
          setError(result.error || 'Erreur d\'inscription')
        } else {
          setError('')
          alert('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.')
          setIsLogin(true)
        }
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await loginWithGoogle()
      if (!result.success) {
        setError(result.error || 'Erreur de connexion avec Google')
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion avec Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">QueryMind</h1>
                <p className="text-purple-200">Votre assistant IA intelligent</p>
              </div>
            </div>

            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Conversations intelligentes</h3>
                  <p className="text-purple-200 text-sm">Posez vos questions et obtenez des réponses précises instantanément</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personnalisé pour vous</h3>
                  <p className="text-purple-200 text-sm">Une expérience unique adaptée à vos besoins</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Rapide et efficace</h3>
                  <p className="text-purple-200 text-sm">Des réponses en quelques secondes grâce à l'IA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">QueryMind</h1>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Bon retour !' : 'Créez votre compte'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Connectez-vous pour continuer' : 'Rejoignez QueryMind aujourd\'hui'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition text-gray-800 placeholder-gray-400"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition text-gray-800 placeholder-gray-400"
                    placeholder="vous@exemple.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition text-gray-800 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>{isLogin ? 'Se connecter' : 'Créer mon compte'}</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Ou continuer avec</span>
              </div>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border-2 border-gray-300 bg-white text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>

            {/* Toggle */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-violet-600 hover:text-violet-700 font-semibold text-sm transition"
              >
                {isLogin
                  ? "Pas encore de compte ? Créer un compte"
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default AuthPage