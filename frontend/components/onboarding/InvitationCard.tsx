"use client";
import React, { useState } from "react";
import { Building2, Briefcase, Clock, Check, X, Loader2 } from "lucide-react";

export type InvitationStatus = "pending" | "accepted" | "rejected";

export interface Invitation {
  id: string;
  organizationName: string;
  organizationInitials: string;
  organizationColor: string; // tailwind bg class e.g. "bg-violet-500"
  role: string;
  invitedAt: Date;
  invitedBy: string;
}

interface InvitationCardProps {
  invitation: Invitation;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const roleColors: Record<string, string> = {
  Admin:       "bg-red-50 text-red-600 border-red-100",
  HR:          "bg-green-50 text-green-600 border-green-100",
  CEO:         "bg-purple-50 text-purple-600 border-purple-100",
  "Co-founder":"bg-amber-50 text-amber-600 border-amber-100",
  Director:    "bg-blue-50 text-blue-600 border-blue-100",
};

export function InvitationCard({ invitation, onAccept, onReject }: InvitationCardProps) {
  const [status, setStatus] = useState<InvitationStatus>("pending");
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  const roleCls = roleColors[invitation.role] ?? "bg-gray-50 text-gray-600 border-gray-100";

  async function handleAccept() {
    setLoading("accept");
    await onAccept(invitation.id);
    setStatus("accepted");
    setLoading(null);
  }

  async function handleReject() {
    setLoading("reject");
    await onReject(invitation.id);
    setStatus("rejected");
    setLoading(null);
  }

  /* ── Accepted state ── */
  if (status === "accepted") {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-green-100 bg-green-50">
        <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-white" />
        </span>
        <div>
          <p className="text-sm font-semibold text-green-700">Invitation accepted</p>
          <p className="text-xs text-green-500">You joined <strong>{invitation.organizationName}</strong> as {invitation.role}</p>
        </div>
      </div>
    );
  }

  /* ── Rejected state ── */
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 opacity-60">
        <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
          <X className="w-4 h-4 text-white" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-500">Invitation declined</p>
          <p className="text-xs text-gray-400">You declined the invite from <strong>{invitation.organizationName}</strong></p>
        </div>
      </div>
    );
  }

  /* ── Pending state ── */
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-sm transition-all duration-200">

      {/* Org avatar */}
      <div className={`w-11 h-11 rounded-xl ${invitation.organizationColor} flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-sm`}>
        {invitation.organizationInitials}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {invitation.organizationName}
          </p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${roleCls}`}>
            <Briefcase className="w-3 h-3" />
            {invitation.role}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Building2 className="w-3.5 h-3.5" />
            Invited by <span className="font-medium text-gray-500 ml-0.5">{invitation.invitedBy}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(invitation.invitedAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleReject}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 transition-all"
        >
          {loading === "reject" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Decline
        </button>
        <button
          onClick={handleAccept}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm shadow-blue-200"
        >
          {loading === "accept" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Accept
        </button>
      </div>
    </div>
  );
}
