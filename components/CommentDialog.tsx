"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

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
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/menu/comment?menuId=${menuId}`)
        .then((res) => res.json())
        .then(setComments)
        .catch(() => toast.error("Erreur lors du chargement des commentaires"));
    }
  }, [isOpen, menuId]);

  // 🟢 Ajouter un commentaire
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      const res = await fetch("/api/menu/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId, userId, comment: newComment }),
      });

      if (!res.ok) throw new Error("Erreur");

      const createdComment = await res.json();
      setComments((prev) => [...prev, createdComment]);
      setNewComment("");
      toast.success("Commentaire ajouté !");
    } catch {
      toast.error("Erreur lors de l'ajout du commentaire");
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

        <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-100 flex flex-col gap-2">
          {comments.map((comment) => (
            <div key={comment.id} className={`flex ${comment.userId === userId ? "justify-end" : "justify-start"}`}>
              <p
                className={`p-2 rounded-lg max-w-[75%] ${
                  comment.userId === userId ? "bg-blue-500 text-white" : "bg-white border"
                }`}
              >
                {comment.comment}
              </p>
            </div>
          ))}
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
