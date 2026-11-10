"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { submitUserFeedback } from "@/lib/feedback-service";

interface CenteredFeedbackDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function CenteredFeedbackDrawer({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: CenteredFeedbackDrawerProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen;

  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Listen for global open-feedback event
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("intelliattend:open-feedback", handleOpen);
    return () => window.removeEventListener("intelliattend:open-feedback", handleOpen);
  }, [setOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Please enter your feedback message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await submitUserFeedback({
        name,
        role: "Community Member",
        institution: "Malla Reddy Colleges",
        text: message,
        rating: rating || 5,
        email,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setOpen(false);
        setName("");
        setEmail("");
        setMessage("");
        setRating(5);
      }, 2000);
    } catch {
      setErrorMsg("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger !== null && (
        <DrawerTrigger asChild>
          {trigger ?? <Button variant="default">Give Feedback</Button>}
        </DrawerTrigger>
      )}

      <DrawerContent className="bg-white border-t border-slate-200 text-slate-900">
        <div className="flex flex-col items-center justify-center text-center py-8 px-4 max-h-[85vh] overflow-y-auto">
          <DrawerHeader className="max-w-md space-y-2">
            <DrawerTitle className="text-xl font-bold">
              We Value Your Feedback
            </DrawerTitle>
            <DrawerDescription>
              Help us improve by sharing your thoughts.
            </DrawerDescription>
          </DrawerHeader>

          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Thank you, {name}!</h4>
              <p className="text-sm text-slate-600">Your feedback has been received successfully.</p>
            </div>
          ) : (
            <>
              {/* Form area */}
              <div className="w-full max-w-md space-y-4 mt-4">
                {/* Name */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Your name" 
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </div>

                {/* Rating */}
                <div className="grid gap-2 text-left">
                  <Label>Rate your experience</Label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer transition-transform hover:scale-110 ${
                          rating >= star
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your experience..."
                    className="min-h-[100px]"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  />
                </div>

                {errorMsg && (
                  <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-left">
                    {errorMsg}
                  </div>
                )}
              </div>

              {/* Footer */}
              <DrawerFooter className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-6">
                <Button 
                  className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-xl cursor-pointer" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export { CenteredFeedbackDrawer };

