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

Execute os testes Node definidos em `test/`:

```bash
npm test
# ou
node test/validateCard.test.js
```

### Python

Há dois modos de testar a implementação Python:

- Com `pytest` (se estiver disponível):

```bash
# instale pytest (recomendado em virtualenv)
python3 -m pip install pytest --user
pytest -q
```

- Sem `pytest`: um runner manual foi incluído para ambientes sem `pip`:

```bash
python3 tests/run_manual_tests.py
```

### Rust

Compile e execute com `cargo`:

```bash
cargo build --release
./target/release/card_validator_rust "4111111111111111"
```

Se preferir compilar diretamente com `rustc` (rápido para testes locais):

```bash
rustc src/main.rs -O -o target/card_validator_rust
./target/card_validator_rust "4111111111111111"
```

---

## Identificação de Bandeira

Cada bandeira segue padrões de prefixos e tamanhos:

- Visa → inicia com 4  
- Mastercard → 51–55 ou 2221–2720  
- Amex → 34 ou 37  
- JCB → 3528–3589  
- Elo, Hipercard, Aura → múltiplos ranges exclusivos  

**Observação:** a lista completa de prefixos/ranges está em `assets/cartoes.txt` e é usada pelas implementações para gerar correspondências mais precisas.

---

## Algoritmo de Luhn

1. Inverta os dígitos  
2. Multiplique por 2 cada segundo dígito  
3. Se > 9, subtraia 9  
4. Some tudo  
5. Total deve ser múltiplo de 10  

---

## Contribuição

Como contribuir (passo a passo):

1. Fork do repositório para sua conta no GitHub.

2. Crie uma branch a partir de `main` com nome descritivo, por exemplo: `feat/add-e2e-tests` ou `fix/readme-typo`.

3. Faça suas alterações localmente. Siga estas recomendações:

    - Escreva/atualize testes para qualquer comportamento novo ou correção (Node: `npm test`; Python: `python3 tests/run_manual_tests.py` ou `pytest`; Rust: `cargo build --release`).
    - Mantenha o estilo do projeto: JavaScript moderno (ES2020), Python 3.12+ idiomático e Rust formatado (`cargo fmt`) quando aplicável.
    - Use mensagens de commit claras, por exemplo: `feat(node): add BIN detection for new issuer` ou `fix(py): handle empty input in detect_brand`.

4. Faça push da sua branch para o seu fork.

5. Abra um Pull Request para `francescousseau:main` descrevendo:

    - O que foi alterado e por quê.
    - Como testar localmente (comandos para rodar testes e exemplos).
    - Quais arquivos foram afetados.

6. Aguarde revisão; responda a comentários e ajuste o PR conforme solicitado.


## Licença

MIT
