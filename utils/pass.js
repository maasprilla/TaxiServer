(function() {
    var t, n, r;
    t = require("crypto"), r = 128, n = 12e3, exports.hash = function(l, i, u) {
        var e;
        if (3 === arguments.length) try {
            console.log('hash 1');
            console.log(l);
            console.log(i);
            console.log(n);
            console.log(r);
            console.log(u);
            t.pbkdf2(l, i, n, r, function(t, n) {
                t ? u(t, null) : (i = i.toString("base64"), u(null, i))
            })
        } catch (o) {
            console.log('hash 2');
            e = o, u(e.toString(), null)
        } else u = i, t.randomBytes(r, function(i, o) {
            if (i) return u(i);
            o = o.toString("base64");
            try {
                console.log('hash 3');
                t.pbkdf2(l, o, n, r, function(t, n) {
                    return t ? u(t) : (n = n.toString("base64"), void u(null, o, n))
                })
            } catch (a) {
                console.log('hash 4');
                e = a, u(e.toString(), null, null)
            }
        })
    }
}).call(this);