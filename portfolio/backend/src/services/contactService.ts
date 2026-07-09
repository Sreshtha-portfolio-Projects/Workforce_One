import { supabase } from '../config/supabase';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/** Returned from `saveMessage` only after a row is persisted; `id` is the database row id. */
export type SavedContactMessage = ContactMessage & { id: string };

function savedMessageFromRow(
  row: Record<string, unknown> | undefined,
  data: ContactMessage
): SavedContactMessage | null {
  if (!row) return null;
  const id = row.id;
  const name = row.name;
  const email = row.email;
  const message = row.message;
  if (
    typeof id === 'string' &&
    typeof name === 'string' &&
    typeof email === 'string' &&
    typeof message === 'string'
  ) {
    return { id, name, email, message };
  }
  return null;
}

export const contactService = {
  async saveMessage(data: ContactMessage): Promise<SavedContactMessage> {
    if (!supabase) {
      console.warn('Contact save: Supabase is not configured');
      console.log('📧 Contact Message (not persisted):', data);
      throw new Error('Database is not configured');
    }

    try {
      const { data: result, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: data.name,
            email: data.email,
            message: data.message,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.warn('Database error:', error.message);
        console.log('📧 Contact Message (not persisted):', data);
        throw new Error(error.message || 'Failed to save contact message');
      }

      const saved = savedMessageFromRow(result?.[0] as Record<string, unknown> | undefined, data);
      if (saved) {
        return saved;
      }

      console.warn(
        'Insert succeeded but no row was returned; expected a row with id.',
        result?.length === 0 ? '(empty result)' : '(unexpected row shape)'
      );
      console.log('📧 Contact Message (not persisted):', data);
      throw new Error('Contact message was not returned after insert');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.warn('Failed to save contact message:', error);
      console.log('📧 Contact Message (not persisted):', data);
      throw new Error('Failed to save contact message');
    }
  },
};
