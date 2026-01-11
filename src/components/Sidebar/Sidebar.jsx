import { MessageSquarePlus, Trash2, LogOut, User, X } from 'lucide-react'

function Sidebar({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  user,
  onLogout,
  isOpen,
  onToggle
}) {
  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 bg-gray-900 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">Q</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">QueryMind</h1>
              <p className="text-xs text-gray-400">Votre assistant IA</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nouveau chat */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewConversation()
              onToggle()
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Nouvelle conversation
          </button>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto px-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            Conversations récentes
          </h3>
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Aucune conversation
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`
                    group relative p-3 rounded-lg cursor-pointer transition
                    ${
                      currentConversation?.id === conv.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-800'
                    }
                  `}
                  onClick={() => {
                    onSelectConversation(conv)
                    onToggle()
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conv.title || 'Nouvelle conversation'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (
                          confirm('Voulez-vous vraiment supprimer cette conversation ?')
                        ) {
                          onDeleteConversation(conv.id)
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profil utilisateur */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar