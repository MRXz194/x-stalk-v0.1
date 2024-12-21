"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import { Input, Button } from "@nextui-org/react";
import { signInWithOTP, verifyOTP } from "@/app/actions/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signInWithOTP(email);

      if (result.error) {
        throw new Error(result.error);
      }

      setShowOtpInput(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await verifyOTP(email, otp);

      if (result.error) {
        throw new Error(result.error);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Sign in with Email</h2>

        {!showOtpInput ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="bordered"
            />

            {error && <div className="text-danger text-sm">{error}</div>}

            <Button
              type="submit"
              isLoading={isLoading}
              color="primary"
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send Login Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Please enter the verification code sent to your email.
            </p>

            <Input
              type="text"
              label="Verification Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              variant="bordered"
              pattern="\d{6}"
              maxLength={6}
            />

            {error && <div className="text-danger text-sm">{error}</div>}

            <Button
              type="submit"
              isLoading={isLoading}
              color="primary"
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            <Button
              variant="light"
              onPress={() => setShowOtpInput(false)}
              className="w-full"
            >
              Back to Email Input
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
