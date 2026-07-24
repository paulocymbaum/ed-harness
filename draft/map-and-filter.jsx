/**
 * Quokka tip: leave an expression on its own line to see its live value.
 * Solve each challenge with named functions + .map / .filter (you may chain them).
 */

// const numbers = [1, 2, 3, 4, 5, 6]
// const doubled = numbers.map((n) => n * 2)
// const evens = numbers.filter((n) => n % 2 === 0)
// doubled
// evens

/* =============================================================================
 * SHARED DATA (use these across challenges — or copy into a test call)
 * =============================================================================
 *
 * products = [
 *   { id: 1, name: "Notebook", price: 12, inStock: true,  tags: ["office", "paper"] },
 *   { id: 2, name: "Pen",      price: 3,  inStock: true,  tags: ["office"] },
 *   { id: 3, name: "Monitor",  price: 180,inStock: false, tags: ["tech"] },
 *   { id: 4, name: "USB Hub",  price: 25, inStock: true,  tags: ["tech", "office"] },
 *   { id: 5, name: "Sticker",  price: 1,  inStock: false, tags: ["fun"] },
 * ]
 *
 * cart = [
 *   { productId: 1, qty: 2 },
 *   { productId: 4, qty: 1 },
 *   { productId: 3, qty: 1 }, // out of stock — drop or flag per challenge
 * ]
 *
 * scores = [88, 42, 95, 70, 61, 100, 55]
 */

/* =============================================================================
 * CHALLENGE 1 — Easy: map + named function
 * =============================================================================
 * Write: doubleAll(nums: number[]) => number[]
 * Rule: return each number * 2 using .map and a named helper (e.g. double(n)).
 *
 * Desired input:  [1, 2, 3, 4, 5, 6]
 * Desired output: [2, 4, 6, 8, 10, 12]
 *
 * Test scenarios:
 *   - doubleAll([1, 2, 3, 4, 5, 6])  → [2, 4, 6, 8, 10, 12]
 *   - doubleAll([])                 → []
 *   - doubleAll([-2, 0, 5])          → [-4, 0, 10]
 *
 */
const inputvar = [1, 2, 3, 4, 5, 6]
 const doubleAll = (nums: number[]) => nums.map((n) => n * 2);

 const result = doubleAll(inputvar);
 console.log(result);
 
/* =============================================================================
 * CHALLENGE 3 — Easy/mixed: filter then map
 * =============================================================================
 * Write: inStockNames(products) => string[]
 * Rule: keep products where inStock === true, then map to name.
 * Prefer two named functions (isInStock, toName) called from filter/map.
 *
 * Desired input:  products (see SHARED DATA)
 * Desired output: ["Notebook", "Pen", "USB Hub"]
 *
 * Test scenarios:
 *   - inStockNames(products) → ["Notebook", "Pen", "USB Hub"]
 *   - inStockNames([])       → []
 *   - inStockNames([{ id: 9, name: "Ghost", price: 0, inStock: false, tags: [] }]) → []
 */
const products = [
{ id: 1, name: "Notebook", price: 12, inStock: true,  tags: ["office", "paper"] },
{ id: 2, name: "Pen",      price: 3,  inStock: true,  tags: ["office"] },
{ id: 3, name: "Monitor",  price: 180,inStock: false, tags: ["tech"] },
{ id: 4, name: "USB Hub",  price: 25, inStock: true,  tags: ["tech", "office"] },
{ id: 5, name: "Sticker",  price: 1,  inStock: false, tags: ["fun"] },
]

const inStockNames = (products: Product[]) => products.filter((p) => p.inStock).map((p) => p.name);
console.log(inStockNames(products));

/* =============================================================================
 * CHALLENGE 4 — Mixed: map that calls a price helper
 * =============================================================================
 * Write: formatPrices(products) => string[]
 * Write helper: formatPrice(p) => `${p.name}: $${p.price}`
 * Rule: .map must call formatPrice (do not inline the template in map).
 *
 * Desired input:  products
 * Desired output:
 *   ["Notebook: $12", "Pen: $3", "Monitor: $180", "USB Hub: $25", "Sticker: $1"]
 *
 * Test scenarios:
 *   - formatPrices(products) matches output above (order preserved)
 *   - formatPrices([{ id: 1, name: "X", price: 0, inStock: true, tags: [] }]) → ["X: $0"]
 */


// const products = [
//     { id: 1, name: "Notebook", price: 12, inStock: true,  tags: ["office", "paper"] },
//     { id: 2, name: "Pen",      price: 3,  inStock: true,  tags: ["office"] },
//     { id: 3, name: "Monitor",  price: 180,inStock: false, tags: ["tech"] },
//     { id: 4, name: "USB Hub",  price: 25, inStock: true,  tags: ["tech", "office"] },
//     { id: 5, name: "Sticker",  price: 1,  inStock: false, tags: ["fun"] },
//     ];
    
    const priceTag = (products:[]) => products.map((p) =>`${p.name}: $${p.price}` );
    console.log(priceTag(products))
    

/* =============================================================================
 * CHALLENGE 5 — Mixed: chain filter + map with a threshold helper
 * =============================================================================
 * Write: affordableInStockLabels(products, maxPrice: number) => string[]
 * Helpers (call these from filter/map):
 *   - isAffordableInStock(p, maxPrice) => boolean
 *   - toLabel(p) => `${p.name} ($${p.price})`
 *
 * Desired input:  products, maxPrice = 30
 * Desired output: ["Notebook ($12)", "Pen ($3)", "USB Hub ($25)"]
 *   (Monitor out of stock + too expensive; Sticker out of stock)
 *
 * Test scenarios:
 *   - affordableInStockLabels(products, 30) → ["Notebook ($12)", "Pen ($3)", "USB Hub ($25)"]
 *   - affordableInStockLabels(products, 3)  → ["Pen ($3)"]
 *   - affordableInStockLabels(products, 0)  → []
 *   - affordableInStockLabels(products, 12) → ["Notebook ($12)", "Pen ($3)"]  // include == max
 */

/* =============================================================================
 * CHALLENGE 6 — Mixed/harder: map over cart calling a finder + filter
 * =============================================================================
 * Write: cartLineTotals(cart, products) => number[]
 * Rules:
 *   1) Filter cart to lines whose product exists AND is inStock.
 *   2) Map remaining lines to (product.price * qty).
 * Helpers you must call:
 *   - findProduct(products, id) => product | undefined
 *   - lineTotal(product, qty) => number
 *
 * Desired input:  cart + products
 * Desired output: [24, 25]
 *   // Notebook 12*2=24, USB Hub 25*1=25; Monitor line dropped (out of stock)
 *
 * Test scenarios:
 *   - cartLineTotals(cart, products) → [24, 25]
 *   - cartLineTotals([], products)   → []
 *   - cartLineTotals([{ productId: 99, qty: 1 }], products) → []  // unknown id
 *   - cartLineTotals([{ productId: 2, qty: 3 }], products) → [9]    // Pen 3*3
 *   - cartLineTotals([{ productId: 3, qty: 5 }], products) → []     // out of stock only
 *
 * Stretch (optional): also write cartGrandTotal(...) that sums those line totals
 *   (you may use .reduce AFTER map/filter — or sum with a small helper).
 *   cartGrandTotal(cart, products) → 49
 */

// --- your solutions below ---
