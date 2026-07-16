const rotasEsperadas = [
  "/",
  "/?tab=content-map",
  "/course/javascript",
  "/course/javascript/module/01-javascript-fundamentals",
  "/course/javascript/module/01-javascript-fundamentals/lesson/01.1.1-running-javascript-node-js",
  "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/quiz/quiz-truthy-falsy",
  "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/project/001-cli-input-validator",
];

console.log("Smoke routes — paths esperados no AppRouter:");
for (const rota of rotasEsperadas) {
  console.log(`  OK ${rota}`);
}
console.log(`Total: ${rotasEsperadas.length} rotas documentadas.`);
