/**
 * Mock API Service
 * Simulates backend endpoints using localStorage
 */

const DELAY = 800

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const getStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch (e) {
    return []
  }
}

const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const initializeData = () => {
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@etud.univ-jfc.fr',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'Admin',
        passwordChangeRequired: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'contributeur@etud.univ-jfc.fr',
        password: 'contrib123',
        firstName: 'Contributeur',
        lastName: 'User',
        role: 'Contributeur',
        passwordChangeRequired: true,
        createdAt: new Date().toISOString()
      }
    ]
    setStorage('users', defaultUsers)
  }
}

initializeData()

export const api = {
  auth: {
    login: async (email, password) => {
      await delay(DELAY)
      const users = getStorage('users')
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (user) {
        const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2)}`
        const userData = { ...user }
        delete userData.password

        localStorage.setItem('authToken', token)
        return {
          success: true,
          token,
          user: userData,
          requiresPasswordChange: user.passwordChangeRequired
        }
      }
      return { success: false, message: 'Identifiants invalides. Veuillez réessayer.' }
    },

    changePassword: async (userId, oldPassword, newPassword) => {
      await delay(DELAY)
      const users = getStorage('users')
      const userIndex = users.findIndex(u => u.id === userId)

      if (userIndex === -1) return { success: false, message: 'Utilisateur non trouvé' }

      if (users[userIndex].password !== oldPassword) {
        return { success: false, message: 'Le mot de passe actuel est incorrect' }
      }

      users[userIndex].password = newPassword
      users[userIndex].passwordChangeRequired = false
      users[userIndex].updatedAt = new Date().toISOString()

      setStorage('users', users)
      return { success: true }
    }
  },

  documents: {
    list: async (filters = {}) => {
      await delay(DELAY)
      let docs = getStorage('documents')

      if (filters.search) {
        const q = filters.search.toLowerCase()
        docs = docs.filter(d =>
          d.objet.toLowerCase().includes(q) ||
          d.auteur.toLowerCase().includes(q) ||
          (d.tags && d.tags.toLowerCase().includes(q))
        )
      }

      if (filters.periode) docs = docs.filter(d => d.periode === filters.periode)
      if (filters.service) docs = docs.filter(d => d.service === filters.service)

      return docs.reverse()
    },

    get: async (id) => {
      await delay(DELAY)
      const docs = getStorage('documents')
      return docs.find(d => d.id === id)
    },

    create: async (data, user) => {
      await delay(DELAY)
      const docs = getStorage('documents')
      const newDoc = {
        id: `doc_${Date.now()}`,
        ...data,
        createdBy: user.id,
        createdByName: `${user.firstName} ${user.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      docs.push(newDoc)
      setStorage('documents', docs)

      await api.history.log({
        action: 'CREATE',
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        details: `Document créé: ${newDoc.objet}`,
        documentId: newDoc.id
      })

      return newDoc
    },

    update: async (id, data, user) => {
      await delay(DELAY)
      const docs = getStorage('documents')
      const index = docs.findIndex(d => d.id === id)

      if (index === -1) throw new Error('Document introuvable')

      docs[index] = { ...docs[index], ...data, updatedAt: new Date().toISOString() }
      setStorage('documents', docs)

      await api.history.log({
        action: 'UPDATE',
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        details: `Document mis à jour: ${docs[index].objet}`,
        documentId: id
      })

      return docs[index]
    },

    delete: async (id, user) => {
      await delay(DELAY)
      let docs = getStorage('documents')
      const doc = docs.find(d => d.id === id)

      if (!doc) throw new Error('Document introuvable')

      docs = docs.filter(d => d.id !== id)
      setStorage('documents', docs)

      await api.history.log({
        action: 'DELETE',
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        details: `Document supprimé: ${doc.objet}`,
        documentId: id
      })

      return { success: true }
    }
  },

  users: {
    list: async () => {
      await delay(DELAY)
      return getStorage('users')
    },

    get: async (id) => {
      await delay(DELAY)
      const users = getStorage('users')
      return users.find(u => u.id === id)
    },

    create: async (data) => {
      await delay(DELAY)
      const users = getStorage('users')

      if (users.some(u => u.email === data.email)) {
        throw new Error('Cet email existe déjà')
      }

      const newUser = {
        id: `user_${Date.now()}`,
        ...data,
        passwordChangeRequired: true,
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      setStorage('users', users)
      return newUser
    },

    update: async (id, data) => {
      await delay(DELAY)
      const users = getStorage('users')
      const index = users.findIndex(u => u.id === id)

      if (index === -1) throw new Error('Utilisateur introuvable')

      if (data.email !== users[index].email && users.some(u => u.email === data.email)) {
        throw new Error('Cet email existe déjà')
      }

      users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() }
      setStorage('users', users)
      return users[index]
    },

    delete: async (id) => {
      await delay(DELAY)
      let users = getStorage('users')
      users = users.filter(u => u.id !== id)
      setStorage('users', users)
      return { success: true }
    }
  },

  history: {
    list: async (filters = {}) => {
      await delay(DELAY)
      let history = getStorage('history')

      if (filters.action) {
        history = history.filter(h => h.action === filters.action)
      }

      return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },

    log: async (entry) => {
      const history = getStorage('history')
      history.push({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry
      })
      setStorage('history', history)
    }
  }
}
