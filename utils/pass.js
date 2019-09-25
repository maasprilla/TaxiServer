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
           
            
            // crypto.pbkdf2( value, salt, iterations, hashBytes, digest, (err, key) => {


            t.pbkdf2(l, i, n, r,'base64', function(t, n) {
                console.log('result hast');
                console.log(n);
                console.log(JSON.stringify(n));
                t ? u(t, null) : (n = n.toString("base64"), u(null, n))
            })
        } catch (o) {
            console.log('hash 2');
            console.log(o);
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