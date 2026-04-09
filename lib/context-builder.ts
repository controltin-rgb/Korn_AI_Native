// ปรับให้ ai มีความแม่นยำขึ้น
import { SearchResult } from "./vector-search"

export interface ContextConfig {
  maxTokens?: number        // จำกัด token สำหรับ context
  minSimilarity?: number    // ค่า similarity ขั้นต่ำ
  maxDocuments?: number     // จำกัดจำนวนเอกสาร
}

export function buildContext(
  documents: SearchResult[],
  config: ContextConfig = {}
): string {
  const {
    maxTokens = 3000, // token ที่ใช้สูงสุกเพื่อประหยัด token
    minSimilarity = 0.5, //ถ้าน้อยกว่า 0.5 จะไม่เจอ
    maxDocuments = 5, // อ่านเอกสาร 5 รายการ
  } = config

  // 1. กรองเอกสารที่ similarity ต่ำเกินไป
  const relevantDocs = documents.filter(
    (doc) => doc.similarity >= minSimilarity
  )

  // 2. จำกัดจำนวนเอกสาร
  const limitedDocs = relevantDocs.slice(0, maxDocuments)

  // 3. สร้าง Context พร้อมจำกัด token
  let context = ""
  let estimatedTokens = 0

  for (const doc of limitedDocs) {
    // ประมาณ token (1 token ≈ 4 ตัวอักษรภาษาอังกฤษ, 1-2 ตัวอักษรภาษาไทย)
    const docTokens = Math.ceil(doc.content.length / 2)

    // check max token ถ้าถึงจุดที่จำกัดให้หยุดการทำงาน
    if (estimatedTokens + docTokens > maxTokens) break

    context += `[แหล่งที่มา: ${doc.metadata?.source || "N/A"}]\n${doc.content}\n\n---\n\n`
    estimatedTokens += docTokens
  }

  return context.trim()
}