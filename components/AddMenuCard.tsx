'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

type Menu = {
  id: string;
  title: string;
  starter?: string;
  dish?: string;
  dessert?: string;
  information?: string;
  proposal: string;
  createdAt: string;
};

type MenuForm = {
  title: string;
  starter?: string;
  dish?: string;
  dessert?: string;
  information?: string;
};

type Props = {
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  menus: Menu[];
};

export default function AddMenuCard({ setMenus, menus }: Props) {
  const { data: session } = useSession();
  const userId = session?.user?.id?.toString() || '';

  const [isAdding, setIsAdding] = useState(false);
  const [newMenu, setNewMenu] = useState<MenuForm>({
    title: '',
    starter: '',
    dish: '',
    dessert: '',
    information: '',
  });

  const handleSubmit = async () => {
    console.log('newMenu');
    console.log(newMenu);

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
          proposal: userId,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error(`Erreur: ${error}`);
        return;
      }

      const createdMenu = await res.json();
      setMenus([...menus, createdMenu]); // Ajoute le menu à la liste
      setIsAdding(false);
      setNewMenu({ title: '', starter: '', dish: '', dessert: '', information: '' }); // Réinitialise après l'ajout réussi

      toast.success('Menu ajouté avec succès !');
    } catch (error) {
      toast.error("Erreur lors de l'ajout du menu");
    }
  };

  return (
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
            <Button onClick={handleSubmit}>Ajouter</Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
