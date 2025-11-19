use std::env;
use std::fs;
use std::io::{self, Write};

fn luhn_check(number: &str) -> bool {
	let digits: Vec<u32> = number.chars().filter(|c| c.is_ascii_digit()).map(|c| c.to_digit(10).unwrap()).collect();
	if digits.is_empty() { return false }
	let mut sum = 0u32;
	let mut dbl = false;
	for d in digits.iter().rev() {
		let mut val = *d;
		if dbl {
			val = val * 2;
			if val > 9 { val -= 9 }
		}
		sum += val;
		dbl = !dbl;
	}
	sum % 10 == 0
}

fn mask_number(number: &str) -> String {
	let s: String = number.chars().filter(|c| c.is_ascii_digit()).collect();
	if s.len() <= 8 { return s }
	let first = &s[0..4];
	let last = &s[s.len()-4..];
	let mid = "•".repeat(s.len().saturating_sub(8));
	format!("{} {} {}", first, mid, last)
}

fn detect_brand(number: &str) -> &'static str {
	let s: String = number.chars().filter(|c| c.is_ascii_digit()).collect();
	if s.is_empty() { return "Desconhecida" }
	if s.starts_with('4') { return "Visa" }
	if s.starts_with("34") || s.starts_with("37") { return "American Express" }
	// Mastercard: 51-55 or 2221-2720
	if s.len() >= 2 {
		if let Ok(two) = s[0..2].parse::<u32>() {
			if (51..=55).contains(&two) { return "Mastercard" }
		}
	}
	if s.len() >= 4 {
		if let Ok(four) = s[0..4].parse::<u32>() {
			if (2221..=2720).contains(&four) { return "Mastercard" }
			if (3528..=3589).contains(&four) { return "JCB" }
		}
	}
	if s.starts_with("300") || s.starts_with("301") || s.starts_with("302") || s.starts_with("303") || s.starts_with("304") || s.starts_with("305") || s.starts_with("36") || s.starts_with("38") || s.starts_with("39") {
		return "Diners Club"
	}
	if s.starts_with("6011") || s.starts_with("65") {
		return "Discover"
	}
	if s.len() >= 3 {
		if let Ok(three) = s[0..3].parse::<u32>() {
			if (644..=649).contains(&three) { return "Discover" }
		}
	}
	if s.len() >= 6 {
		if let Ok(six) = s[0..6].parse::<u32>() {
			if (622126..=622925).contains(&six) { return "Discover" }
		}
	}
	if s.starts_with("8699") { return "Voyager" }
	if s.starts_with("6062") { return "Hipercard" }
	if s.starts_with("50") { return "Aura" }
	let elo = ["401178","401179","431274","438935","457631","457632","504175","627780","636297","636368"];
	for p in elo.iter() { if s.starts_with(p) { return "Elo" } }
	"Desconhecida"
}

fn is_likely_card_line(line: &str) -> bool {
	let digits: String = line.chars().filter(|c| c.is_ascii_digit()).collect();
	digits.len() >= 12 && digits.len() <= 19
}

fn process_file(path: &str) {
	let content = match fs::read_to_string(path) { Ok(c) => c, Err(e) => { eprintln!("Erro lendo {}: {}", path, e); return } };
	for line in content.lines() {
		let s = line.trim();
		if s.is_empty() { continue }
		if !is_likely_card_line(s) { continue }
		let digits: String = s.chars().filter(|c| c.is_ascii_digit()).collect();
		let brand = detect_brand(&digits);
		let valid = luhn_check(&digits);
		println!("{}  | Bandeira: {} | Válido: {}", mask_number(&digits), brand, valid);
	}
}

fn interactive_mode() {
	let mut input = String::new();
	let stdin = io::stdin();
	loop {
		print!("Digite número do cartão (ENTER para sair): ");
		io::stdout().flush().ok();
		input.clear();
		if stdin.read_line(&mut input).is_err() { break }
		let s = input.trim();
		if s.is_empty() { break }
		let brand = detect_brand(s);
		let valid = luhn_check(s);
		println!("{}  | Bandeira: {} | Válido: {}", mask_number(s), brand, valid);
	}
}

fn main() {
	let args: Vec<String> = env::args().skip(1).collect();
	if !args.is_empty() {
		let arg = &args[0];
		if arg == "interactive" {
			interactive_mode();
			return;
		}
		if arg == "test" {
			let tests = ["4111111111111111","5555555555554444","378282246310005","6011111111111117"];
			for t in tests.iter() { println!("{} => {} {}", t, detect_brand(t), luhn_check(t)); }
			return;
		}
		// single card
		let brand = detect_brand(arg);
		let valid = luhn_check(arg);
		println!("{}  | Bandeira: {} | Válido: {}", mask_number(arg), brand, valid);
		return;
	}
	// fallback: read assets/cartoes.txt
	let path = "assets/cartoes.txt";
	process_file(path);
}

