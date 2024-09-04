

import React from 'react'
import UserStore from './userStore'
import AdminStore from './adminStore'
import PowerStore from './powerStore' 
import NewsStore from './newsStore'

export const storesContext = React.createContext({
    UserStore,
    AdminStore,
    PowerStore,
    NewsStore
})