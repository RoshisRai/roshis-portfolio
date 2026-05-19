import { 
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Heading,
    Hr,
    Preview,
 } from "jsx-email";

interface ContactNotificationEmailProps {
    name: string;
    email: string;
    message: string;
}

export const ContactNotificationEmail = ({
    name,
    email,
    message
}: ContactNotificationEmailProps) => {
    return (
        <Html lang="en">
            <Head />
            <Preview>New Portfolio Inquiry from {name}</Preview>
            <Body style={{ backgroundColor: "#0a0a0f", fontFamily: "Inter, sans-serif" }}>
                <Container
                    style={{
                        maxWidth: "560px",
                        margin: "40px auto",
                        padding: "32px",
                        backgroundColor: "#121218",
                        borderRadius: "12px",
                        border: "1px solid #1e1e2e",
                    }}
                >
                    <Heading
                        style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#e4e4e7",
                        marginBottom: "8px",
                        }}
                    >
                        New Contact Form Submission
                    </Heading>
                    <Hr style={{ borderColor: "#27272a", margin: "16px 0" }} />
                    <Section>
                        <Text style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "4px" }}>
                            From
                        </Text>
                        <Text style={{ color: "#e4e4e7", fontSize: "15px", marginBottom: "16px" }}>
                            {name} ({email})
                        </Text>

                        <Text style={{ color: "#a1a1aa", fontSize: "13px", marginBottom: "4px" }}>
                            Message
                        </Text>
                        <Text
                            style={{
                                color: "#e4e4e7",
                                fontSize: "15px",
                                lineHeight: "1.6",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {message}
                        </Text>
                    </Section>

                    <Hr style={{ borderColor: "#27272a", margin: "24px 0 16px" }} />
                    <Text style={{ color: "#71717a", fontSize: "12px" }}>
                        Sent from your portfolio contact form.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}