"use client";
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { InvitationCard, type Invitation } from "@/components/onboarding/InvitationCard";
import { useInvitationCount } from "@/components/onboarding/InvitationCountContext";

const dummyInvitations: Invitation[] = [
  {
    id: "1",
    organizationName: "Nexus Technologies",
    organizationInitials: "NT",
    organizationColor: "bg-violet-500",
    role: "Admin",
    invitedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    invitedBy: "Rahul Sharma",
  },
  {
    id: "2",
    organizationName: "GreenLeaf Solutions",
    organizationInitials: "GL",
    organizationColor: "bg-emerald-500",
    role: "Director",
    invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hrs ago
    invitedBy: "Priya Mehta",
  },
  {
    id: "3",
    organizationName: "BlueWave Corp",
    organizationInitials: "BW",
    organizationColor: "bg-blue-500",
    role: "HR",
    invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 27), // 1 day ago
    invitedBy: "Amit Joshi",
  },
];

const page = () => {
  const [invitations] = useState<Invitation[]>(dummyInvitations);
  const { decrement } = useInvitationCount();

  async function handleAccept(id: string) {
    // TODO: call API
    await new Promise((r) => setTimeout(r, 800));
    decrement();
    console.log("Accepted:", id);
  }

  async function handleReject(id: string) {
    // TODO: call API
    await new Promise((r) => setTimeout(r, 800));
    decrement();
    console.log("Rejected:", id);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Invitations</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Organizations that have invited you to join.
        </p>
      </div>

      {invitations.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No invitations yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            When someone invites you to join their organization, it will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {invitations.map((inv) => (
            <InvitationCard
              key={inv.id}
              invitation={inv}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default page;