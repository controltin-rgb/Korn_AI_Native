import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"


// 1. กำหนด Actions ที่ทำได้ในระบบ
export const statement = {
    ...defaultStatements, 
    project: ["create", "read", "update", "delete"], 
} as const 

export const ac = createAccessControl(statement) 


//# 2. สร้าง Role ตามเงื่อนไขของคุณ

// กำหนด user role ให้ สร้าง และ อ่าน
export const user = ac.newRole({ 
    project: ["create", "read"], 
}) 

// กำหนด manager role ให้ สร้าง, อ่าน, แก้ไข
export const manager = ac.newRole({ 
    project: ["create", "read", "update"], 
}) 

// กำหนด admin role ให้สามารถจัดการได้ทั้งหมด
export const admin = ac.newRole({
    project: ["create", "read", "update", "delete"],
    ...adminAc.statements, // ให้สิทธิ์จัดการ User/Session มาตรฐานของ Admin ด้วย (role มาตรฐาน ของ better auth)
})