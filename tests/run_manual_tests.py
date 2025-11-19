"""Manual test runner for environments without pytest installed.
This script calls the same checks defined for pytest but runs them directly.
"""
import sys
from pathlib import Path

# ensure repo root is on sys.path so `from src import main` works
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from src import main as m


def test_luhn_check_samples():
    assert m.luhn_check('4111111111111111') is True
    assert m.luhn_check('378282246310005') is True
    assert m.luhn_check('5294088516427407') is True


def test_detect_brand_samples():
    assert m.detect_brand('4111111111111111') == 'Visa'
    assert m.detect_brand('378282246310005') == 'American Express'
    assert m.detect_brand('5294088516427407') == 'Mastercard'


def test_mask_number():
    assert m.mask_number('4111111111111111') == '4111 •••••••• 1111'
    assert m.mask_number('12345678') == '12345678'


def test_is_likely_card_line():
    assert m.is_likely_card_line('4111 1111 1111 1111')
    assert not m.is_likely_card_line('not a card')


if __name__ == '__main__':
    tests = [
        test_luhn_check_samples,
        test_detect_brand_samples,
        test_mask_number,
        test_is_likely_card_line,
    ]
    failed = 0
    for t in tests:
        name = t.__name__
        try:
            print('RUN', name)
            t()
        except AssertionError as e:
            print('FAIL', name, e)
            failed += 1
    if failed:
        print(f"{failed} tests failed")
        raise SystemExit(1)
    print('All manual tests passed')
