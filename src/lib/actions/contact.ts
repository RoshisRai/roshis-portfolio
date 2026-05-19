'use server'

import { z } from "zod";
import { Resend } from "resend";
import { ContactNotificationEmail } from "@/components/emails/contact-notification";
import { contactSchema, type ContactFormState } from "@/lib/validators/contact";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendContactEmail = async (
    _prevState: ContactFormState, 
    formData: FormData): Promise<ContactFormState> => {
    //Parse & Validate
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    }

    const parsed = contactSchema.safeParse(rawData)

    if(!parsed.success) {
        const flat = z.flattenError(parsed.error)
        return {
            success: false,
            errors: {
                name: flat.fieldErrors.name,
                email: flat.fieldErrors.email,
                message: flat.fieldErrors.message,
                _form: flat.formErrors.length > 0 ? flat.formErrors : undefined
            },
        }
    }

    const { name, email, message } = parsed.data;

    // Send Email via Resend
    const mailFrom = process.env.MAIL_FROM;
    const personalEmail = process.env.PERSONAL_EMAIL;

    if (!mailFrom || !personalEmail) {
        return {
            success: false,
            errors: {
                _form: ["Email service is not configured. Please try again later."]
            }
        }
    }

    try {
        const { error } = await resend.emails.send({
            from: mailFrom,
            to: [personalEmail],
            replyTo: email,
            subject: `New Message From ${name} via Portfolio`,
            react: ContactNotificationEmail({ name, email, message })
        })

        if (error) {
            return {
                success: false,
                errors: {
                    _form: ["Failed to send message. Please try again or email me directly."]
                }
            }
        }
        return { success: true }
    } catch {
        return {
            success: false,
            errors: {
                _form: ["Something went wrong. Please try again later."]
            }
        }
    }
}