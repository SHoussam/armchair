import {
  calculateSofaPrice,
  calculateChairPrice,
} from "./pricing"
import { products } from "../../data/data"

function runTests() {
  console.log("==================================================")
  console.log("RUNNING FOCUSED PRICING TESTS (L-SOFA & CHAIR)")
  console.log("==================================================\n")

  let passed = 0
  let failed = 0

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${testName}`)
      if (detail) console.error(`   Details: ${detail}`)
      failed++
    }
  }

  // ─────────────────────────────────────────────
  // 1. SOFA PRICING TESTS (9 Confirmed Test Cases)
  // ─────────────────────────────────────────────
  console.log("--- 1. L-Shaped Sofa Pricing Tests ---")

  const t1 = calculateSofaPrice({ seatSize: 70, length1: 2.70, length2: 2.00 })
  assert(
    t1.basePrice === 3000 && t1.finalPrice === 3000 && t1.ratePerMeter === 900,
    "Test 1: Seat 70cm, default (2.70m x 2.00m) -> Base 3,000 DH, Final 3,000 DH, Rate 900 DH/m"
  )

  const t2 = calculateSofaPrice({ seatSize: 80, length1: 2.70, length2: 2.00 })
  assert(
    t2.basePrice === 3500 && t2.finalPrice === 3500 && t2.ratePerMeter === 1000,
    "Test 2: Seat 80cm, default (2.70m x 2.00m) -> Base 3,500 DH, Final 3,500 DH, Rate 1,000 DH/m"
  )

  const t3 = calculateSofaPrice({ seatSize: 90, length1: 2.70, length2: 2.00 })
  assert(
    t3.basePrice === 4000 && t3.finalPrice === 4000 && t3.ratePerMeter === 1100,
    "Test 3: Seat 90cm, default (2.70m x 2.00m) -> Base 4,000 DH, Final 4,000 DH, Rate 1,100 DH/m"
  )

  const t4 = calculateSofaPrice({ seatSize: 70, length1: 3.00, length2: 2.00 })
  assert(
    t4.ratePerMeter === 900 && t4.extraMeters === 0.30 && t4.dimensionSupplement === 270 && t4.finalPrice === 3270,
    "Test 4: Seat 70cm, 3.00m × 2.00m -> Rate 900 DH/m, +0.30m, Supplement 270 DH, Final 3,270 DH"
  )

  const t5 = calculateSofaPrice({ seatSize: 80, length1: 3.00, length2: 2.00 })
  assert(
    t5.ratePerMeter === 1000 && t5.extraMeters === 0.30 && t5.dimensionSupplement === 300 && t5.finalPrice === 3800,
    "Test 5: Seat 80cm, 3.00m × 2.00m -> Rate 1,000 DH/m, +0.30m, Supplement 300 DH, Final 3,800 DH"
  )

  const t6 = calculateSofaPrice({ seatSize: 90, length1: 3.00, length2: 2.00 })
  assert(
    t6.ratePerMeter === 1100 && t6.extraMeters === 0.30 && t6.dimensionSupplement === 330 && t6.finalPrice === 4330,
    "Test 6: Seat 90cm, 3.00m × 2.00m -> Rate 1,100 DH/m, +0.30m, Supplement 330 DH, Final 4,330 DH"
  )

  const t7 = calculateSofaPrice({ seatSize: 70, length1: 2.20, length2: 1.80 })
  assert(
    t7.finalPrice === 3000,
    "Test 7: Dimensions below reference (2.20m × 1.80m) -> Final Price = Base Price protected (3000 DH)"
  )

  const seq70_1 = calculateSofaPrice({ seatSize: 70, length1: 3.50, length2: 2.50 })
  const seq80 = calculateSofaPrice({ seatSize: 80, length1: 3.50, length2: 2.50 })
  const seq90 = calculateSofaPrice({ seatSize: 90, length1: 3.50, length2: 2.50 })
  const seq70_2 = calculateSofaPrice({ seatSize: 70, length1: 3.50, length2: 2.50 })
  assert(
    seq70_1.finalPrice === 4170 && seq80.finalPrice === 4800 && seq90.finalPrice === 5430 && seq70_2.finalPrice === 4170,
    "Test 8: Rapid transition 70 -> 80 -> 90 -> 70 -> Updates with zero stale state"
  )

  const t9 = calculateSofaPrice({ seatSize: 80, length1: 3.20, length2: 2.20, headrests: 3, fabricMultiplier: 1.22 })
  assert(
    t9.finalPrice === 5124,
    "Test 9: Full personalized sofa with dimensions + fabric upgrade -> 5,124 DH"
  )

  // ─────────────────────────────────────────────
  // 2. ARMCHAIR PRICING TESTS
  // ─────────────────────────────────────────────
  console.log("\n--- 2. Armchair Pricing Tests ---")

  const chair = products.find((p) => p.id === 2)!
  if (chair.config.type === "chair") {
    // Base armchair (85cm, Natural Oak, Smooth)
    const c1 = calculateChairPrice({
      width: 0.85,
      legFinishId: "natural_oak",
      tuftingStyleId: "smooth",
      chairConfig: chair.config,
    })
    assert(
      c1.finalPrice === 1800 && c1.extraWidthCm === 0,
      "Test 10: Armchair base (85cm width, Oak legs, Smooth) -> 1,800 DH"
    )

    // Custom width 105cm (+20cm @ 15 DH/cm = +300 DH) + Brass Gold legs (+250 DH) + Diamond tufting (+220 DH)
    const c2 = calculateChairPrice({
      width: 1.05,
      legFinishId: "brass_gold",
      tuftingStyleId: "diamond",
      chairConfig: chair.config,
    })
    // 1800 + 300 + 250 + 220 = 2570 DH
    assert(
      c2.finalPrice === 2570 && c2.extraWidthCm === 20,
      "Test 11: Custom Armchair (105cm width, Brass legs, Diamond tufting) -> 2,570 DH",
      `Got ${c2.finalPrice}`
    )
  }

  console.log(`\n==================================================`)
  console.log(`ALL TESTS: ${passed} passed, ${failed} failed`)
  console.log(`==================================================`)

  if (failed > 0) process.exit(1)
}

runTests()
