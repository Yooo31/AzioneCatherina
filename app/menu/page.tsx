'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import AddMenuCard from '@/components/AddMenuCard';
import CommentDialog from '@/components/CommentDialog';

type Menu = {
  id: string;
  title: string;
  starter?: string;
  dish?: string;
  dessert?: string;
  information?: string;
  proposal: string;
  proposalUser?: { username: string };
  owner?: string;
  ownerUser?: { username: string };
  createdAt: string;
};

export default function MenuPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id?.toString() ?? '';

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [openChatMenuId, setOpenChatMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then(setMenus)
      .finally(() => setLoading(false));
  }, []);

  const handleBecomeOwner = async (menuId: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId, userId: userId }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error);
        return;
      }

      const updatedMenu = await res.json();
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === updatedMenu.id ? { ...menu, owner: updatedMenu.owner } : menu,
        ),
      );

      toast.success('Vous êtes maintenant responsable de ce menu !');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'assignation");
    }
  };

  const openChat = (menuId: string) => {
    setOpenChatMenuId(menuId);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Liste des menus</h1>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-md" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="border p-4 rounded-lg shadow bg-white">
              <h2 className="text-xl font-bold">{menu.title}</h2>
              <p className="text-gray-600">🍽️ {menu.starter ?? "Pas d'entrée"}</p>
              <p className="text-gray-600">🍛 {menu.dish ?? 'Pas de plat'}</p>
              <p className="text-gray-600">🍰 {menu.dessert ?? 'Pas de dessert'}</p>
              <p className="text-sm text-gray-500">
                📅 Créé le : {new Date(menu.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                👤 Proposé par : {menu.proposalUser?.username}
              </p>

              {menu.owner ? (
                <p className="text-sm text-green-600">
                  ✅ Responsable : {menu.ownerUser?.username}
                </p>
              ) : (
                <Button onClick={() => handleBecomeOwner(menu.id)} className="mt-4 w-full">
                  Devenir responsable
                </Button>
              )}

              <Button
                variant="outline"
                className="mt-4 flex items-center"
                onClick={() => openChat(menu.id)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Commentaires
              </Button>

              {openChatMenuId === menu.id && (
                <CommentDialog
                  menuId={menu.id}
                  userId={userId}
                  isOpen={true}
                  onClose={() => setOpenChatMenuId(null)}
                />
              )}
            </div>
          ))}
          <AddMenuCard setMenus={setMenus} menus={menus} />
        </div>
      )}
    </div>
  );
}
