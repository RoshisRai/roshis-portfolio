import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name must be under 100 characters."),
    email: z
        .email("Please enter a valid email address."),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters.")
        .max(5000, "Message must be under 5000 characters.")
})

export type ContactFormState = {
    success: boolean;
    errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
        _form?: string[];
    };
}
