export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          avatar_url?: string
          full_name?: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          avatar_url?: string
          full_name?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          avatar_url?: string
          full_name?: string
        }
      }
    }
  }
} 