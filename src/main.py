#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def luhn_check(number: str) -> bool:
    digits = [int(d) for d in re.sub(r"\D", "", number)]
    if not digits:
        return False
    checksum = 0
    dbl = False
    for d in reversed(digits):
        if dbl:
            d = d * 2
            if d > 9:
                d -= 9
        checksum += d
        dbl = not dbl
    return checksum % 10 == 0


def normalize_brand(name: str) -> str:
    if not name:
        return name
    n = name.strip().lower()
    if 'visa' in n:
        return 'Visa'
    if 'master' in n:
        return 'Mastercard'
    if 'american' in n:
        return 'American Express'
    if 'diners' in n:
        return 'Diners Club'
    if 'discover' in n:
        return 'Discover'
    if 'jcb' in n:
        return 'JCB'
    if 'enroute' in n or 'en route' in n:
        return 'enRoute'
    if 'voyager' in n:
        return 'Voyager'
    if 'hipercard' in n:
        return 'Hipercard'
    if 'aura' in n:
        return 'Aura'
    if 'elo' in n:
        return 'Elo'
    return name.title()


def detect_brand(number: str) -> str:
    n = re.sub(r"\D", "", number)
    if not n:
        return None

    # Common checks
    if n.startswith('4'):
        return 'Visa'
    if n.startswith(('34', '37')):
        return 'American Express'
    # Mastercard: 51-55 or 2221-2720
    try:
        two = int(n[:2]) if len(n) >= 2 else -1
        four = int(n[:4]) if len(n) >= 4 else -1
    except ValueError:
        two = -1
        four = -1
    if 51 <= two <= 55 or 2221 <= four <= 2720:
        return 'Mastercard'

    # Diners Club
    if n.startswith(('300', '301', '302', '303', '304', '305', '36', '38', '39')):
        return 'Diners Club'

    # Discover
    if n.startswith('6011') or n.startswith('65') or (len(n) >= 3 and 644 <= int(n[:3]) <= 649):
        return 'Discover'
    if len(n) >= 6:
        try:
            six = int(n[:6])
            if 622126 <= six <= 622925:
                return 'Discover'
        except ValueError:
            pass

    # JCB 3528-3589
    if len(n) >= 4:
        try:
            four = int(n[:4])
            if 3528 <= four <= 3589:
                return 'JCB'
        except ValueError:
            pass

    # Voyager, Hipercard, Aura, Elo (simple prefixes)
    if n.startswith('8699'):
        return 'Voyager'
    if n.startswith('6062'):
        return 'Hipercard'
    if n.startswith('50'):
        return 'Aura'

    # Elo common prefixes (subset)
    elo_prefixes = {'401178','401179','431274','438935','457631','457632','504175','627780','636297','636368'}
    for p in elo_prefixes:
        if n.startswith(p):
            return 'Elo'

    return 'Desconhecida'


def mask_number(number: str) -> str:
    s = re.sub(r"\D", "", number)
    if len(s) <= 8:
        return s
    return f"{s[:4]} {'•'*max(0, len(s)-8)} {s[-4:]}"


def is_likely_card_line(line: str) -> bool:
    digits = ''.join(re.findall(r"\d+", line))
    return 12 <= len(digits) <= 19


def process_file(path: Path):
    text = path.read_text(encoding='utf8')
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    for line in lines:
        if not is_likely_card_line(line):
            continue
        digits = ''.join(re.findall(r"\d+", line))
        brand = detect_brand(digits)
        valid = luhn_check(digits)
        print(f"{mask_number(digits)}  | Bandeira: {brand} | Válido: {valid}")


def interactive_mode():
    try:
        while True:
            s = input('Digite número do cartão (ENTER para sair): ').strip()
            if not s:
                break
            brand = detect_brand(s)
            valid = luhn_check(s)
            print(f"{mask_number(s)}  | Bandeira: {brand} | Válido: {valid}")
    except (EOFError, KeyboardInterrupt):
        print()


def main(argv=None):
    argv = argv or sys.argv[1:]
    if argv:
        arg = argv[0]
        if arg == 'interactive':
            interactive_mode()
            return
        if arg == 'test':
            # run tests quickly
            print('Rodando testes básicos...')
            tests = ['4111111111111111','5555555555554444','378282246310005','6011111111111117']
            for t in tests:
                print(t, detect_brand(t), luhn_check(t))
            return
        # treat as card number
        brand = detect_brand(arg)
        valid = luhn_check(arg)
        print(f"{mask_number(arg)}  | Bandeira: {brand} | Válido: {valid}")
        return

    p = Path(__file__).resolve().parent.parent / 'assets' / 'cartoes.txt'
    if not p.exists():
        print('assets/cartoes.txt não encontrado')
        return
    process_file(p)


if __name__ == '__main__':
    main()
