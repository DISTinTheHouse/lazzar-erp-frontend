import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/src/lib/auth';

export default async function NotFound() {
  const session = await getServerSession(authOptions);

  redirect(session ? '/' : '/auth/login');
}
