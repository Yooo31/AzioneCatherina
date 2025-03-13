'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Pencil, Trash } from 'lucide-react'; // Icônes pour modifier et supprimer

type Comment = {
  id: string;
  menuId: string;
  userId: string;
  comment: string;
  createdAt: string;
};

type Props = {
  menuId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function CommentDialog({ menuId, userId, isOpen, onClose }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/menu/comment?menuId=${menuId}`)
        .then((res) => res.json())
        .then((data) => setComments(Array.isArray(data) ? data : []))
        .catch(() => toast.error('Erreur lors du chargement des commentaires'));
    }
  }, [isOpen, menuId]);

  // 🟢 Ajouter un commentaire
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      const res = await fetch('/api/menu/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId, userId, comment: newComment }),
      });

      if (!res.ok) throw new Error('Erreur');

      const createdComment = await res.json();
      setComments((prev) => [...prev, createdComment]);
      setNewComment('');
      toast.success('Commentaire ajouté !');
    } catch {
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  // 🟢 Modifier un commentaire
  const handleEditComment = async (commentId: string) => {
    if (!editedText.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      const res = await fetch('/api/menu/comment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, comment: editedText }),
      });

      if (!res.ok) throw new Error('Erreur');

      const updatedComment = await res.json();
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, comment: updatedComment.comment } : comment,
        ),
      );
      setEditingComment(null);
      toast.success('Commentaire modifié !');
    } catch {
      toast.error('Erreur lors de la modification du commentaire');
    }
  };

  // 🟢 Supprimer un commentaire
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;

    try {
      const res = await fetch('/api/menu/comment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId }),
      });

      if (!res.ok) throw new Error('Erreur');

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success('Commentaire supprimé !');
    } catch {
      toast.error('Erreur lors de la suppression du commentaire');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>💬 Chat des commentaires</DialogTitle>
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
        </DialogHeader>

        {/* 🔥 Zone d'affichage des commentaires */}
        <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-100 flex flex-col gap-2">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center">Aucun commentaire pour le moment.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`flex ${comment.userId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative flex flex-col">
                  {editingComment === comment.id ? (
                    <Input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEditComment(comment.id)}
                    />
                  ) : (
                    <p
                      className={`p-2 rounded-lg max-w-[75%] ${
                        comment.userId === userId ? 'bg-blue-500 text-white' : 'bg-white border'
                      }`}
                    >
                      {comment.comment}
                    </p>
                  )}

                  {/* {comment.userId === userId && ( */}
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        editingComment
                          ? setEditingComment(null)
                          : (setEditingComment(comment.id), setEditedText(comment.comment))
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  {/* )} */}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder="Écrire un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>Envoyer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
