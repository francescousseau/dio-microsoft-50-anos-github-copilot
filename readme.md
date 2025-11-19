# Validador de Cartões (JS / Python / Rust)

<p align="center">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES2020-yellow?style=for-the-badge&logo=javascript&logoColor=black" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white" />
  <img alt="Rust" src="https://img.shields.io/badge/Rust-stable-orange?style=for-the-badge&logo=rust&logoColor=white" />
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/francescousseau/dio-microsoft-50-anos-github-copilot?style=flat-square" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/francescousseau/dio-microsoft-50-anos-github-copilot?style=flat-square&label=%C3%9Altimo%20commit" />
</p>

<p align="center">
  <img alt="Stars" src="https://img.shields.io/github/stars/francescousseau/dio-microsoft-50-anos-github-copilot?style=social" />
  <img alt="Forks" src="https://img.shields.io/github/forks/francescousseau/dio-microsoft-50-anos-github-copilot?style=social" />
</p>

---

# Validador de Cartões  
### (JavaScript • Python • Rust — Bandeiras + Algoritmo de Luhn)

Este repositório reúne implementações completas para validação de cartões de crédito e identificação da **bandeira** correspondente.  
Inclui suporte a:

- Algoritmo de **Luhn**
- Identificação de bandeiras (Visa, Mastercard, Amex, Elo, Hipercard, JCB, Aura, Diners, Discover e outras)
- Versões equivalentes em **JavaScript**, **Python** e **Rust**
- CLI funcional, modo interativo e exemplos de uso
- Conjunto amplo de cartões de teste via `.txt` e `.csv`

Ideal para estudo, demonstrações técnicas e desafios de portabilidade entre linguagens.

---

## Índice

- Principais Recursos
- Estrutura do Projeto
- Pré-requisitos
- Instalação Rápida
- Como Usar
  - Node.js
  - Python
  - Rust
- Modo Interativo
- Testes
- Como Funciona a Identificação de Bandeira
- Como Funciona o Algoritmo de Luhn
- Contribuição
- Licença

---

## Principais Recursos

- Identificação automática de bandeiras por prefixo e range
- Validação completa com Algoritmo de Luhn
- Implementações equivalentes em três linguagens
- Modo interativo para testes rápidos
- Sem dependências externas
- Arquivo `.csv` com dezenas de cartões fictícios organizados

---

## Estrutura do Projeto

```
.
├── assets/
│   ├── cartoes.txt
│   └── cartoes_exemplo.csv
├── examples/
│   └── usage.js
├── src/
│   ├── index.js
│   ├── main.py
│   └── main.rs
├── test/
│   └── validateCard.test.js
└── README.md
```

---

## Pré-requisitos

- Node.js 16+
- Python 3.8+
- Rust + Cargo

---

## Instalação Rápida

```bash
git clone <url-do-repositorio>
cd dio-microsoft-50-anos-github-copilot
```

---

## Como Usar

### Node.js

```bash
node src/index.js 4111111111111111
```

```bash
node src/index.js interactive
```

### Python

```bash
python3 src/main.py "4111111111111111"
```

```bash
python3 src/main.py interactive
```

### Rust

```bash
cargo build --release
./target/release/card_validator_rust "4111111111111111"
```

---

## Modo Interativo

Digite cartões sucessivamente e pressione ENTER vazio para sair.

---

## Testes

### Node.js

```bash
node test/validateCard.test.js
```

---

## Identificação de Bandeira

Cada bandeira segue padrões de prefixos e tamanhos:

- Visa → inicia com 4  
- Mastercard → 51–55 ou 2221–2720  
- Amex → 34 ou 37  
- JCB → 3528–3589  
- Elo, Hipercard, Aura → múltiplos ranges exclusivos  

---

## Algoritmo de Luhn

1. Inverta os dígitos  
2. Multiplique por 2 cada segundo dígito  
3. Se > 9, subtraia 9  
4. Some tudo  
5. Total deve ser múltiplo de 10  

---

## Contribuição

Sugestões:

- Testes unitários em Python e Rust  
- API REST (FastAPI / Express)  
- Versão Web com HTML + JS  

---

## Licença

MIT