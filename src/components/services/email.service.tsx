export async function sendEmail(email: String) {
    try {
        const response = await fetch("https://build-x-designer-api.vercel.app/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export async function emailResponse(subject: String, from: String, text: String) {
    if (!subject || !from || !text) {
        throw new Error("Missing required email fields");
    }

    try {
        const response = await fetch("https://build-x-designer-api.vercel.app/api/record-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject, from, text }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error recording email response:", error);
        throw error;
    }
}