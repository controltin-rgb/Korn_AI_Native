import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin as adminPlugin, twoFactor } from "better-auth/plugins"
import { ac, admin, manager, user } from "@/lib/permissions"
import nodemailer from "nodemailer"
import { prisma } from "@/lib/prisma"

interface EmailPasswordProps {
    user: {
        name?: string | null
        email: string
    }
    url: string
}

// สร้าง SMTP transporter สำหรับ Gmail
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
})


export const auth = betterAuth({

    // config for better auth using
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    // อนุญาติ CORS ของ better-auth สำหรับทุก origin ชั่วคราว (ปรับให้จำกัดใน production)
    trustedOrigins: [
        "https://your.domain.com",
        "http://localhost:3000",
        "http://localhost:8810"
    ],

    // enable use email and password for signin
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }: EmailPasswordProps) => {
            await transporter.sendMail({
                from: `"AI Native App" <${process.env.GMAIL_USER}>`,
                to: user.email,
                subject: "รีเซ็ตรหัสผ่าน - AI Native App",
                html: `
                    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                        <h1 style="color: #7c3aed; font-size: 24px;">รีเซ็ตรหัสผ่าน</h1>
                        <p>สวัสดีคุณ ${user.name},</p>
                        <p>เราได้รับคำขอรีเซ็ตรหัสผ่านของคุณ คลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่:</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0;">
                            ตั้งรหัสผ่านใหม่
                        </a>
                        <p style="color: #6b7280; font-size: 14px;">ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
                        <p style="color: #9ca3af; font-size: 12px;">หากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยอีเมลนี้</p>
                    </div>
                `,
            })
        },
    },

    // ... database, emailAndPassword config ...
    emailVerification: {
        sendOnSignUp: true,
        // sendVerificationEmail: async ({ user, url }: { user: { name?: string | null; email: string }, url: string }) => {
        sendVerificationEmail: async ({ user, url }: EmailPasswordProps) => {
            await transporter.sendMail({
                from: `"AI Native App" <${process.env.GMAIL_USER}>`,
                to: user.email,
                subject: "ยืนยันอีเมลของคุณ - AI Native App",
                html: `
                    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                        <h1 style="color: #7c3aed; font-size: 24px;">ยืนยันอีเมล</h1>
                        <p>สวัสดีคุณ ${user.name},</p>
                        <p>คลิกปุ่มด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0;">
                            ยืนยันอีเมล
                        </a>
                        <p style="color: #9ca3af; font-size: 12px;">หากคุณไม่ได้สมัครสมาชิก กรุณาเพิกเฉยอีเมลนี้</p>
                    </div>
                `,
            })
        },
    },


    // เพิ่มส่วนนี้เพื่ออนุญาตให้เชื่อมบัญชีอัตโนมัติเมื่ออีเมลตรงกัน
    account: {
      accountLinking: {
          enabled: true, 
          trustedProviders: ["github", "google","facebook", "line"], // ยอมรับให้อีเมลจาก 3 เจ้านี้ผูกกับบัญชีหลักได้
      }
    },

    // login ด้วย Socials
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        line: {
            clientId: process.env.LINE_CLIENT_ID as string,
            clientSecret: process.env.LINE_CLIENT_SECRET as string,
        },
    },

    appName: "AI Native App", // ← ใช้เป็นชื่อใน Authenticator app
    // set plugins for role manager
    plugins: [
        adminPlugin({
            ac,
            roles: {
                admin,
                manager,
                user
            }
        }),
        twoFactor({
            issuer: "AI Native App",         // ← ชื่อที่แสดงใน Authenticator
            // อาจจะให้ verify email ก่อนต้องเป็น true
            skipVerificationOnEnable: false,  // ← บังคับยืนยัน OTP ก่อนเปิดใช้จริง
        }),
    ],

    // session config we got token from jwt
    session: {
        // default will be just you want to custom config.
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
})

