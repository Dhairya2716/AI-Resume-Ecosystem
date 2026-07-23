async function test() {
    try {
        const res = await fetch("https://resume-ai-backend-wgof.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Origin": "https://ai-resume-ecosystem-builder.vercel.app",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "Test User",
                email: "testuser992@example.com",
                password: "password123"
            })
        });
        const text = await res.text();
        console.log(res.status, text);
    } catch (e) {
        console.error(e);
    }
}
test();
