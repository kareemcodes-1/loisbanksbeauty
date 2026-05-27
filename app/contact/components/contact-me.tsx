"use client";
import Badge from '@/components/badge'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import AnimatedBorder from '@/components/animated-border';
import BlurText from '@/components/animations/blur-text';

const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-[1.5rem] text-white placeholder:text-white/30 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:outline-none focus:bg-white/[0.05] text-sm"

const labelClass = "text-white/50 text-xs uppercase tracking-widest"

const ContactMe = () => {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [service, setService] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const form = e.currentTarget
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
            service,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        }

        await fetch('https://formsubmit.co/ajax/YOUR_EMAIL@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
        })

        setLoading(false)
        setSent(true)
        form.reset()
        setService('')
    }

    return (
        <section className="section-spacing relative mt-[6rem] lg:mt-[8rem] px-4 sm:px-6 lg:px-0">
            <div className="flex items-center justify-center w-full flex-col">
                <Badge text="Contact Us" />

                {/* Header */}
                <div className="flex items-center justify-center w-full flex-col gap-4 mb-14">

                    <div className="flex flex-col items-center text-center">
                        <BlurText
                            text="Let's talk about"
                            delay={50}
                            animateBy="words"
                            direction="bottom"
                            className="text-white overflow-hidden"
                        />
                        <BlurText
                            text="your business"
                            delay={50}
                            animateBy="words"
                            direction="bottom"
                            stepDuration={0.5}
                            className="text-white/70 overflow-hidden"
                        />
                    </div>

                    <p className="text-[1rem] lg:text-[1.2rem] text-gray-400 max-w-[480px] leading-[1.7] text-center">
                        Fill out the form and I'll get back to you as soon as possible — or just hit me up directly on WhatsApp.
                    </p>
                </div>

                {/* Form */}
                <AnimatedBorder className="w-full max-w-[900px]" innerClassName="shadow-[0_0_120px_rgba(246,58,34,0.08)]">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 sm:px-6 md:px-8 py-8 md:py-10 backdrop-blur-xl flex flex-col gap-6 sm:gap-[2rem]"
                    >
                        {/* Name & Email */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                                <Label htmlFor="name" className={labelClass}>Your Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Kareem Braimoh"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-1">
                                <Label htmlFor="email" className={labelClass}>Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Phone & Service */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                                <Label htmlFor="phone" className={labelClass}>Phone (Optional)</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+234 000 000 0000"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-2 flex-1">
                                <Label className={labelClass}>Service Needed</Label>
                                <Select onValueChange={setService} value={service}>
                                    <SelectTrigger className={`${inputClass} h-auto`}>
                                        <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0a0a] border border-white/10 text-white rounded-xl">
                                        <SelectItem value="Website Design & Development">Website Design & Development</SelectItem>
                                        <SelectItem value="SEO">SEO</SelectItem>
                                        <SelectItem value="Copywriting & Content">Copywriting & Content</SelectItem>
                                        <SelectItem value="Branding">Branding</SelectItem>
                                        <SelectItem value="Automations">Automations</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="message" className={labelClass}>Tell me about your project</Label>
                            <Textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                placeholder="What do you need, what's your timeline, any other details..."
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || sent}
                            className="btn-primary w-full sm:w-auto !h-[3.5rem]"
                        >
                            {sent ? 'Message Sent ✓' : loading ? 'Sending...' : 'Send Message'}
                        </button>

                        {sent && (
                            <p className="text-center text-white/40 text-sm">
                                I'll get back to you as soon as possible.
                            </p>
                        )}
                    </form>
                </AnimatedBorder>
            </div>
        </section>
    )
}

export default ContactMe