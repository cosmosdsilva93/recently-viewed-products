const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

admin.initializeApp();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // or use any SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Timeframe in milliseconds (e.g., 1 hour)
const TIMEFRAME = 60 * 60 * 1000;

exports.sendEmailNotification = functions.firestore
    .document("users/{userId}/recentlyViewed/{productId}")
    .onWrite(async (change, context) => {
        console.log(context.params);

        const { userId, productId } = context.params;

        // Get document data
        const newValue = change.after.exists ? change.after.data() : null;
        const oldValue = change.before.exists ? change.before.data() : null;

        if (!newValue) {
            // Document deleted, no action required
            return null;
        }

        // Check if product views exceed the threshold
        const currentTime = Date.now();
        const viewTimestamps = newValue.timestamp || [];

        // Filter views within the timeframe
        const recentViews = viewTimestamps.filter((timestamp) => currentTime - timestamp <= TIMEFRAME);

        if (recentViews.length > 2) {
            try {
                
                const userEmail = process.env.EMAIL_USER //userDoc.data()?.email;

                // Send email notification
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: userEmail,
                    subject: "Product Viewed Multiple Times",
                    html: `<p>You have viewed the product <strong>${productId}</strong> multiple times within the past hour.</p>`,
                };

                await transporter.sendMail(mailOptions);

                console.log(`Email sent to ${userEmail} for product ${productId}`);
            } catch (error) {
                console.error("Error sending email notification:", error);
            }
        }

        return null;
    });
