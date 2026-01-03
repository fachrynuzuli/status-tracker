// countdown/example.ts
import { isLeapYear, daysInYear, getDayOfYear, getDaysRemainingInYear } from "../lib/date-utils"

const now = new Date() // current time
const tz = "Asia/Jakarta"
const year = 2026

console.log("=== Date Logic Verification ===")
console.log("Leap year?", isLeapYear(year)) // false
console.log("Days in 2026:", daysInYear(year)) // 365
console.log("Today DOY (WIB):", getDayOfYear(now, tz)) // e.g., 3 on Jan 3 WIB
console.log("Days remaining (WIB):", getDaysRemainingInYear(now, tz))

// Additional verification for 2024 (leap year)
console.log("\n=== Additional Verification ===")
console.log("Leap year 2024?", isLeapYear(2024)) // true
console.log("Days in 2024:", daysInYear(2024)) // 366

// Test edge cases
console.log("\n=== Edge Cases ===")
console.log("Leap year 2000?", isLeapYear(2000)) // true (divisible by 400)
console.log("Leap year 1900?", isLeapYear(1900)) // false (divisible by 100 but not 400)
console.log("Leap year 2100?", isLeapYear(2100)) // false (divisible by 100 but not 400)
