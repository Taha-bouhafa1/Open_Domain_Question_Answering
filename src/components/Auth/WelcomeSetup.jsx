import { useState } from 'react'
import { Sparkles, ArrowRight, User } from 'lucide-react'

function WelcomeSetup({ user, onComplete }) {
  const [preferredName, setPreferredName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!preferredName.trim()) return

    setIsSubmitting(true)

    try {
      // Sauvegarder le nom préféré dans le profil utilisateur
      await onComplete(preferredName.trim())
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bienvenue sur QueryMind ! 👋
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Bonjour <span className="font-semibold text-violet-600">{user?.user_metadata?.full_name || user?.email}</span>
            </p>
            <p className="text-gray-500">
              Pour personnaliser votre expérience, comment souhaitez-vous que je vous appelle ?
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Comment souhaitez-vous être appelé(e) ?
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition text-gray-800 placeholder-gray-400 text-lg"
                  placeholder="ex: Sarah, Mohammed, Alex..."
                  required
                  autoFocus
                />
              </div>
              <p className="mt-3 text-sm text-gray-500">
                💡 Ce nom sera utilisé dans toutes nos conversations pour une expérience plus personnelle
              </p>
            </div>

            {/* Examples */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Exemples d'utilisation
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✨ "Bonjour <span className="font-semibold text-violet-600">{preferredName || '[Votre nom]'}</span>, comment puis-je vous aider aujourd'hui ?"</p>
                <p>✨ "<span className="font-semibold text-violet-600">{preferredName || '[Votre nom]'}</span>, voici ce que j'ai trouvé pour vous..."</p>
                <p>✨ "Excellente question, <span className="font-semibold text-violet-600">{preferredName || '[Votre nom]'}</span> !"</p>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={!preferredName.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                'Enregistrement...'
              ) : (
                <>
                  Commencer l'aventure
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Skip option */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => onComplete(user?.user_metadata?.full_name || user?.email?.split('@')[0])}
              className="text-gray-500 hover:text-gray-700 text-sm transition"
            >
              Passer cette étape
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeSetup