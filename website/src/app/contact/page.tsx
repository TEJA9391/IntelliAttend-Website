"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Have questions about IntelliAttend? Our team is here to help you transform your campus.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Our Office</h4>
                  <p className="text-slate-600 dark:text-slate-400">123 Innovation Drive<br />Tech District, CA 94103</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Phone</h4>
                  <p className="text-slate-600 dark:text-slate-400">+1 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Email</h4>
                  <p className="text-slate-600 dark:text-slate-400">hello@intelliattend.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Send us a message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"></textarea>
              </div>
              <Button type="button" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
