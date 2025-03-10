'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CommentDialog from '@/components/CommentDialog'; // Import du chat

type Menu = {
  id: string;
  title: string;
  starter?: string;
  dish?: string;
  dessert?: string;
  information?: string;
  proposal: string;
  owner?: string;
  createdAt: string;
};

const USER_ID = 'user123'; // TODO: Remplacer par l'ID réel de l'utilisateur connecté

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [openChatMenuId, setOpenChatMenuId] = useState<string | null>(null);
  const [newMenu, setNewMenu] = useState({
    title: '',
    starter: '',
    dish: '',
    dessert: '',
    information: '',
  });

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then(setMenus)
      .finally(() => setLoading(false));
  }, []);

  // 🟢 Fonction pour devenir responsable d'un menu
  const handleBecomeOwner = async (menuId: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId, userId: USER_ID }),
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
      toast.error("Erreur lors de l'assignation");
    }
  };

  // 🟢 Fonction pour ajouter un menu
  const handleAddMenu = async () => {
    if (!newMenu.title.trim()) {
      toast.error('Le titre est requis !');
      return;
    }

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMenu,
          proposal: USER_ID,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(`Erreur: ${error}`);
        return;
      }

      const createdMenu = await res.json();
      setMenus([...menus, createdMenu]);
      setIsAdding(false);
      setNewMenu({ title: '', starter: '', dish: '', dessert: '', information: '' });

      toast.success('Menu ajouté avec succès !');
    } catch (error) {
      toast.error("Erreur lors de l'ajout du menu");
    }
  };

  // 🟢 Fonction pour ouvrir le chat des commentaires
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
              <p className="text-gray-600">🍽️ {menu.starter || "Pas d'entrée"}</p>
              <p className="text-gray-600">🍛 {menu.dish || 'Pas de plat'}</p>
              <p className="text-gray-600">🍰 {menu.dessert || 'Pas de dessert'}</p>
              <p className="text-sm text-gray-500">
                📅 Créé le : {new Date(menu.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">👤 Proposé par : {menu.proposal}</p>

              {menu.owner ? (
                <p className="text-sm text-green-600">✅ Responsable : {menu.owner}</p>
              ) : (
                <Button onClick={() => handleBecomeOwner(menu.id)} className="mt-4 w-full">
                  Devenir responsable
                </Button>
              )}

              {/* 🟢 Bouton pour ouvrir le chat */}
              <Button
                variant="outline"
                className="mt-4 flex items-center"
                onClick={() => openChat(menu.id)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Commentaires
              </Button>

              {/* 🟢 Popup des commentaires */}
              {openChatMenuId === menu.id && (
                <CommentDialog
                  menuId={menu.id}
                  userId={USER_ID}
                  isOpen={true}
                  onClose={() => setOpenChatMenuId(null)}
                />
              )}
            </div>
          ))}

          {/* 🟢 Carte d'ajout de menu */}
          <div
            className="border p-4 rounded-lg shadow bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setIsAdding(true)}
          >
            {!isAdding ? (
              <>
                <Plus className="w-12 h-12 text-gray-500" />
                <p className="text-lg font-medium text-gray-700 mt-2">Ajouter un menu</p>
              </>
            ) : (
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Nom du menu"
                  value={newMenu.title}
                  onChange={(e) => setNewMenu({ ...newMenu, title: e.target.value })}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Entrée"
                  value={newMenu.starter}
                  onChange={(e) => setNewMenu({ ...newMenu, starter: e.target.value })}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Plat"
                  value={newMenu.dish}
                  onChange={(e) => setNewMenu({ ...newMenu, dish: e.target.value })}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Dessert"
                  value={newMenu.dessert}
                  onChange={(e) => setNewMenu({ ...newMenu, dessert: e.target.value })}
                  className="mb-2"
                />
                <Input
                  type="text"
                  placeholder="Infos supplémentaires"
                  value={newMenu.information}
                  onChange={(e) => setNewMenu({ ...newMenu, information: e.target.value })}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddMenu}>Ajouter</Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
