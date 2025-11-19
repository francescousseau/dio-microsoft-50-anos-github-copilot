const fs = require('fs');

function luhnCheck(number) {
	const digits = number.replace(/\D/g, '');
	let sum = 0;
	let shouldDouble = false;
	for (let i = digits.length - 1; i >= 0; i--) {
		let d = parseInt(digits.charAt(i), 10);
		if (shouldDouble) {
			d *= 2;
			if (d > 9) d -= 9;
		}
		sum += d;
		shouldDouble = !shouldDouble;
	}
	return sum % 10 === 0;
}

let _prefixTrie = null;

function normalizeBrand(name) {
	if (!name) return name;
	const n = name.trim().toLowerCase();
	if (n.includes('visa')) return 'Visa';
	if (n.includes('master')) return 'Mastercard';
	if (n.includes('american')) return 'American Express';
	if (n.includes('diners')) return 'Diners Club';
	if (n.includes('discover')) return 'Discover';
	if (n.includes('jcb')) return 'JCB';
	if (n.includes('enroute') || n.includes('en route')) return 'enRoute';
	if (n.includes('voyager')) return 'Voyager';
	if (n.includes('hipercard')) return 'Hipercard';
	if (n.includes('aura')) return 'Aura';
	if (n.includes('elo')) return 'Elo';
	// fallback: title case
	return name.replace(/(^|\s)\S/g, s => s.toUpperCase());
}

function detectBrand(number) {
	const n = number.replace(/\D/g, '');
	if (!n) return null;

	// constrói trie uma vez
	if (!_prefixTrie) {
		try {
			_prefixTrie = buildPrefixTrieFromAssets();
		} catch (e) {
			_prefixTrie = null;
		}
	}

	let trieMatch = null;
	if (_prefixTrie) {
		const t = searchTrie(_prefixTrie, n);
		if (t) trieMatch = t; // { brand, length }
	}

	// Fallback estático mínimo
	// Ordem importante: padrões mais específicos devem vir antes de padrões genéricos
	const fallback = [
		['Elo', /^(401178|401179|431274|438935|457631|457632|504175|627780|636297|636368)/],
		['Hipercard', /^6062/],
		['Aura', /^50/],
		['Voyager', /^8699/],
		['enRoute', /^(2014|2149)/],
		['JCB', /^35(2[8-9]|[3-8][0-9])?/],
		['Discover', /^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]))/],
		['Diners Club', /^(30[0-5]|36|38|39)/],
		['American Express', /^3[47]/],
		['Mastercard', /^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]|720))/],
		// Visa é um prefixo genérico (/^4/) e deve ser verificado por último
		['Visa', /^4/],
	];

	// Encontra melhor correspondência no fallback (prefixo mais longo)
	let bestFallback = null;
	let bestFallbackLen = 0;
	for (const [name, rx] of fallback) {
		const m = rx.exec(n);
		if (m && m[0]) {
			const len = m[0].length;
			if (len > bestFallbackLen) {
				bestFallbackLen = len;
				bestFallback = name;
			}
		}
	}

	// Se houver correspondência na trie e no fallback, escolhe a mais específica (maior comprimento)
	if (trieMatch && bestFallback) {
		if ((trieMatch.length || 0) >= bestFallbackLen) return trieMatch.brand;
		return bestFallback;
	}
	if (trieMatch) return trieMatch.brand;
	if (bestFallback) return bestFallback;

	return 'Desconhecida';
}

function buildPrefixTrieFromAssets() {
	const path = `${__dirname}/../assets/cartoes.txt`;
	const raw = fs.readFileSync(path, 'utf8');
	const lines = raw.split(/\r?\n/);

	const root = { children: Object.create(null), brand: null };

	for (const line of lines) {
		// aceita linhas onde a segunda coluna pode terminar na linha (sem pipe final)
		const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)(?:\||$)/);
		if (!m) continue;
		const name = m[1].trim();
		let prefixes = m[2].trim();
		prefixes = prefixes.replace(/\(.*?\)/g, '');
		prefixes = prefixes.replace(/[–—−]/g, '-');
		const parts = prefixes.split(',').map(p => p.trim()).filter(Boolean);

		const expanded = [];
		for (const p of parts) {
			if (/^\d+-\d+$/.test(p)) {
				const [s, e] = p.split('-').map(x => parseInt(x, 10));
				if (Number.isFinite(s) && Number.isFinite(e) && e >= s) {
					const count = e - s + 1;
					if (count <= 2000) {
						const width = String(s).length;
						for (let v = s; v <= e; v++) expanded.push(String(v).padStart(width, '0'));
						continue;
					}
				}
			}
			const token = p.replace(/[^0-9]/g, '');
			if (token) expanded.push(token);
		}

		for (const prefix of expanded) {
			let node = root;
			for (const ch of prefix) {
				if (!node.children[ch]) node.children[ch] = { children: Object.create(null), brand: null };
				node = node.children[ch];
			}
			// define brand no nó terminal do prefix (normalizado)
			node.brand = normalizeBrand(name);
		}
	}

	// Se root não tiver filhos, consideramos falha
	if (Object.keys(root.children).length === 0) throw new Error('Nenhuma entrada encontrada em assets');
	return root;
}

function searchTrie(trie, digits) {
	let node = trie;
	let found = null;
	let depth = 0;
	let foundDepth = 0;
	for (const ch of digits) {
		if (!node) break;
		depth += 1;
		if (node.brand) {
			found = node.brand;
			foundDepth = depth - 1;
		}
		node = node.children[ch];
	}
	if (node && node.brand) {
		found = node.brand;
		foundDepth = depth;
	}
	if (!found) return null;
	return { brand: found, length: foundDepth };
}


function maskNumber(number) {
	const n = number.replace(/\D/g, '');
	if (n.length <= 4) return n;
	return n.slice(0, 4) + ' ' + '•'.repeat(Math.max(0, n.length - 8)) + ' ' + n.slice(-4);
}

/**
 * Valida um número de cartão e detecta a bandeira ('Bandeira').
 * Recebe string com dígitos (ou com espaços/hífens) e retorna objeto:
 * { valid: boolean, bandeira: string, number: string }
 */
function validateCard(number) {
	const digits = (number || '').toString().replace(/\s+/g, '');
	const onlyDigits = digits.replace(/\D/g, '');
	if (!onlyDigits) return { valid: false, bandeira: null, number };

	const bandeira = detectBrand(onlyDigits);
	const valid = luhnCheck(onlyDigits);
	return { valid, bandeira, number: onlyDigits };
}

// Se executado diretamente, permite passar um número de cartão como argumento
// Exemplo: `node src/index.js 4111111111111111` → imprime validação para este cartão
// Se nenhum argumento for passado, lê `assets/cartoes.txt` como antes.
if (require.main === module) {
	const cardArg = process.argv[2];
	if (cardArg && cardArg !== 'test') {
		if (cardArg === 'interactive') {
			// modo interativo: permitir digitar vários cartões
			const readline = require('readline');
			const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
			const prompt = () => rl.question('Digite número do cartão (ou ENTER para sair): ', answer => {
				const val = (answer || '').trim();
				if (!val) {
					rl.close();
					return;
				}
				const res = validateCard(val);
				console.log(`${maskNumber(res.number)}  | Bandeira: ${res.bandeira} | Válido: ${res.valid}`);
				prompt();
			});
			prompt();
			return;
		}

		const res = validateCard(cardArg);
		console.log(`${maskNumber(res.number)}  | Bandeira: ${res.bandeira} | Válido: ${res.valid}`);
		process.exit(0);
	}

	const path = `${__dirname}/../assets/cartoes.txt`;
	let content = '';
	try {
		content = fs.readFileSync(path, 'utf8');
	} catch (err) {
		console.error(`Não foi possível ler ${path}:`, err.message);
		process.exit(1);
	}

	const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	// Filtra somente linhas que provavelmente contêm um número de cartão (12-19 dígitos)
	const isLikelyCardLine = (str) => {
		if (!str) return false;
		// extrai dígitos
		const digits = (str.match(/\d+/g) || []).join('');
		return digits.length >= 12 && digits.length <= 19;
	};
	if (lines.length === 0) {
		console.log('Nenhum cartão encontrado em `assets/cartoes.txt`.');
		process.exit(0);
	}

	for (const line of lines) {
		if (!isLikelyCardLine(line)) continue;
		const res = validateCard(line);
		console.log(`${maskNumber(res.number)}  | Bandeira: ${res.bandeira} | Válido: ${res.valid}`);
	}
}

module.exports = { validateCard, detectBrand, luhnCheck };

