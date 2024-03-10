/// Parametr `data` powinien być liczbą dziesiętną
/// Funkcja zwraca obiekt zawierający trzy pola będące różnymi zapisami liczby w sposób binarny 
/// Dla przykładu:
/// `const out = convert(data)`
/// `out.zm` zapis w systemie znak-moduł
/// `out.u1` zapis w systemie uzupełnienia do jeden
/// `out.u2` zapis w systemie uzupełnienia do dwóch
function convert(data) {
    data = data.toString()
    let check = parseFloat(data);
    let isNegative = false;
    if (check < 0) {
        isNegative = true
    }
    if (check > 127 || check < -127)
        return console.log("Liczba zbyt duża lub zbyt mała")

    let basic = ""
    let parsed = null
    if (data.includes(".")) {
        if (check > 15.9375 || check < -15.9375)
            return console.log("Liczba zbyt duża lub zbyt mała")
        parsed = parseFloat(data)
        if (isNegative) parsed *= -1
        for (let i = 3; i >= -4; --i) {
            if (parsed - (2 ** i) >= 0) {
                basic += "1"
                parsed -= (2 ** i)
            } else {
                basic += "0"
            }
            if (i == 0) {
                basic += "."
            }
        }
        let zm = basic;
        zm[0] = isNegative ? "1" : "0"
        let u1 = isNegative ? invert(basic) : basic
        u1 = u1.slice(0, 4) + "." + u1.slice(4)
        let u2 = isNegative ? inc(invert(zm)) : zm
        u2 = u2.slice(0, 4) + "." + u2.slice(4)
        // console.log(`u1: ${u1}`)
        // console.log(`u2: ${u2}`)
        return { basic, u1, u2, zm }
    } else {
        parsed = parseInt(data);
        if (isNegative) parsed *= -1
        for (let i = 7; i >= 0; i -= 1) {
            if (parsed - (2 ** i) >= 0) {
                basic += "1"
                parsed -= (2 ** i)
            } else {
                basic += "0"
            }
        }
        let zm = (isNegative ? "1" : "0") + basic.slice(1);
        let u1 = isNegative ? invert(basic) : basic
        let u2 = isNegative ? inc(invert(basic)) : zm
        return { zm, u1, u2 }
        // console.log(`u1: ${invert(basic)}`)
        // console.log(`u2: ${inc(invert(basic))}`)
    }


}

function revert(data) {
    let isNegative = false;
    if (data[0] == "1") {
        isNegative = true
    }
    let result = 0
    if (data.includes(".")) {

    } else {
        for (let i = 1; i <= 7; i++) {
            if (data[i] == "1") {
                result += (2 ** (7 - i))
            }
        }
    }
    return result * (isNegative ? -1 : 1)
}
/// Odwraca bity stringa zawierającego zera i jedynki
/// Np. invert("00111") == "11000"
function invert(bits) {
    return bits.split("").map((v) => v == "0" ? "1" : "0").join("")
}

function inc(bits) {
    let arr = bits.split("");
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == "1") {
            arr[i] = "0";
        } else {
            arr[i] = "1";
            break;
        }
    }
    return arr.join("");
}

const _HEX = "0123456789ABCDEF"
const _OCT = "01234567"

/// Działa na stringach stworzonych przez funkcję convert, reszty nie gwarantuję
/// Zamienia na system szesnastkowy np. hex("00001010") == "0A"
function hex(bits) {
    if (bits.includes(".")) {
        let parts = bits.split(".")
        let _conv = hex(parts[0].concat(parts[1]))
        let _final = _conv[0] + "." + _conv[1]
        return _final
    } else {
        let h_idx = 0;
        for (let i = 3; i >= 0; i -= 1) {
            if (bits[i] == 1) {
                h_idx += 2 ** (3 - i)
            }
        }
        let first = _HEX[h_idx]
        h_idx = 0
        for (let i = 3; i >= 0; i -= 1) {
            if (bits[i + 4] == 1) {
                h_idx += 2 ** (3 - i)
            }
        }
        let second = _HEX[h_idx]
        return first + second
    }
}