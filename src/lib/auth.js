import { supabase } from './supabase'

export const authService = {
    // Sign up new user
    async signUp(email, password, metadata = {}) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata, // Additional user metadata (firstName, lastName, etc.)
            },
        })

        if (error) throw error
        return data
    },

    // Sign in existing user
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return data
    },

    // Sign out current user
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Get current session
    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        return data.session
    },

    // Get current user
    async getCurrentUser() {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error
        return data.user
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    },

    // Update user profile
    async updateProfile(updates) {
        const { data, error } = await supabase.auth.updateUser({
            data: updates,
        })

        if (error) throw error
        return data
    },

    // Reset password
    async resetPassword(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
    },
}
