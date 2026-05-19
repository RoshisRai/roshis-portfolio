'use client'

import { useActionState } from "react"
import { Floatinginput, FloatingTextarea } from "./floating-input"
import { sendContactEmail } from "@/lib/actions/contact"
import { type ContactFormState } from "@/lib/validators/contact"
import { Magnetic } from "@/components/global/cursor/magnetic"
import { cn } from "@/lib/utils"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { CursorZone } from "@/components/global/cursor/cursor-zone"

const initialState: ContactFormState = { success: false }

export const ContactForm = () => {
    const [state, formAction, isPending] = useActionState(
        sendContactEmail,
        initialState
    )

    if (state.success) {
        return (
            <div className="flex flex-col gap-8 w-full lg:w-[55%] mb-10 lg:mb-0">
                <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in duration-500">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 size={24} className="text-emerald-400" />
                    </div>
                    <p className="text-lg text-foreground font-medium">
                        Message sent successfully!
                    </p>
                    <p className="text-sm text-text-primary/60 text-center max-w-prose">
                        Thanks for reaching out. I&rsquo;ll get back to you within 24–48 hours.
                    </p>
                </div>
            </div>
        )
    }
    return (
        <form action={formAction} className="flex flex-col gap-8 w-full lg:w-[55%] mb-10 lg:mb-0">
            {/* Global Form Errors  */}
            {state.errors?._form && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    {state.errors._form.map((error) => (
                        <p key={error} className="text-[13px] text-red-400" role="alert">
                            {error}
                        </p>
                    ))}
                </div>
            )}

            <Floatinginput
                label="Name"
                name="name"
                type="text"
                errors={state.errors?.name}
                />

            <Floatinginput
                label="Email"
                name="email"
                type="email"
                errors={state.errors?.email}
                />

            <FloatingTextarea
                label="Message"
                name="message"
                rows={4}
                errors={state.errors?.message}
            />

            <Magnetic strength={0.05} elementPull={0.05} radius={1.01}>
               <CursorZone variant="button">
                    <button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "group relative w-full flex items-center justify-center gap-2",
                            "py-3.5 px-6 rounded-xl text-[15px] font-semibold",
                            "bg-accent/95 text-white",
                            "transition-all duration-200",
                            "hover:bg-accent active:scale-98 hover:shadow-[0_8px_24px_var(--color-accent-glow)]",
                            "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-accent/80"
                        )}
                    >
                        { isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Message...</span>
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>
               </CursorZone>
            </Magnetic>
        </form>
    )
}