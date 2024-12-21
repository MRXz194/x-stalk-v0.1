"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiRefreshCw, FiUser, FiArrowUpCircle, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import OrderModal from "../payment/OrderModal";
import AuthModal from "../auth/AuthModal";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { signOut } from "@/app/actions/auth";
import { toast } from "sonner";

interface Profile {
  username: string;
  role: string;
}

export default function UserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile");
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProfile();
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      setProfile(null);
      fetchProfile();
      router.refresh();
    } else {
      toast.error(result.error || "Failed to sign out");
    }
  };

  if (isLoading) return null;

  if (!profile) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="inline-flex items-center gap-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-full px-3 py-1.5 border transition-colors"
        >
          <FiUser className="w-3 h-3" />
          <span className="font-medium">Sign In</span>
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            fetchProfile();
            router.refresh();
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="inline-flex items-center gap-2 text-xs bg-gray-50 rounded-full px-3 py-1.5 border">
        <FiUser className="w-3 h-3 text-gray-400" />
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <button className="font-medium hover:text-blue-500 transition-colors">
              {profile.username}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded hover:bg-gray-50"
            >
              <FiLogOut className="w-4 h-4" />
              Sign Out
            </button>
          </PopoverContent>
        </Popover>
        {profile.role === "premium" ? (
          <FaStar className="w-3 h-3 text-yellow-500" />
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-[10px] font-medium">Free</span>
            <button
              onClick={() => setShowOrderModal(true)}
              className="text-blue-500 hover:text-blue-600 transition-colors"
              title="Upgrade to Premium"
            >
              <FiArrowUpCircle className="w-3 h-3" />
            </button>
          </div>
        )}
        <button
          onClick={handleRefresh}
          className={`text-gray-400 hover:text-gray-600 transition-all ${
            isRefreshing ? "animate-spin" : ""
          }`}
        >
          <FiRefreshCw className="w-3 h-3" />
        </button>
      </div>

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </>
  );
}
