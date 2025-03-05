"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "react-hot-toast";

export default function CreateUserPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/compte/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Compte créé avec succès !");
      setTimeout(() => router.push("/auth"), 2000);
    } else {
      toast.error(data.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-semibold">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 w-80">
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Créer le compte</Button>
      </form>
    </div>
  );
}
