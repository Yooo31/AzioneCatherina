import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import NextAuth, { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

// Crée une instance de PrismaClient
const prismaClient = new PrismaClient();

// Configuration de NextAuth
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'johndoe' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Tentative de connexion avec:', credentials);

        if (!credentials?.username || !credentials?.password) {
          console.error('Erreur: Identifiant ou mot de passe manquant');
          throw new Error('Missing username or password');
        }

        const user = await prismaClient.user.findUnique({
          where: { username: credentials.username },
        });
        console.log('Utilisateur trouvé:', user);

        if (!user) {
          console.error('Erreur: Utilisateur non trouvé');
          throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        console.log('mdps : ' + passwordMatch);

        if (!passwordMatch) {
          console.error('Erreur: Mot de passe invalide');
          throw new Error('Invalid password');
        }

        console.log('Connexion réussie pour:', user.username);
        return { id: user.id, name: user.username };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.user = { id: user.id, name: user.name };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Créer le handler pour NextAuth
const handler = NextAuth(authOptions);

// Exporter les méthodes GET et POST
export { handler as GET, handler as POST };
