const assert = require('assert');
const { validateCard, detectBrand, luhnCheck } = require('../src/index');

// Testes básicos de Luhn
assert.strictEqual(luhnCheck('4111111111111111'), true, 'Visa sample should pass Luhn');
assert.strictEqual(luhnCheck('378282246310005'), true, 'AmEx sample should pass Luhn');
assert.strictEqual(luhnCheck('5294088516427407'), true, 'Mastercard sample should pass Luhn');

// Testes de detecção de bandeira
assert.strictEqual(detectBrand('4111111111111111'), 'Visa', 'Visa should be detected');
assert.strictEqual(detectBrand('378282246310005'), 'American Express', 'AmEx should be detected');
assert.strictEqual(detectBrand('5294088516427407'), 'Mastercard', 'Mastercard should be detected');

// Validação via API
const v1 = validateCard('4111 1111 1111 1111');
assert.strictEqual(v1.valid, true);
assert.strictEqual(v1.bandeira, 'Visa');

const v2 = validateCard('5294 0885 1642 7407');
assert.strictEqual(v2.valid, true);
assert.strictEqual(v2.bandeira, 'Mastercard');

console.log('All tests passed');
